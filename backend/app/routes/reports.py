import uuid, json, random, string
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.database import get_db
from app.db import models
from app.schemas import ReportCreate

router = APIRouter()


def _enrich(r: models.Report, db: Session) -> dict:
    agent_ids = json.loads(r.agent_ids or "[]")
    agent_names = []
    for aid in agent_ids:
        agent = db.query(models.Agent).filter(models.Agent.id == aid).first()
        agent_names.append(agent.name if agent else aid)
    return {
        "id": r.id, "title": r.title, "category": r.category,
        "benchmark_id": r.benchmark_id,
        "winner_id": r.winner_id,
        "winner_name": r.winner.name if r.winner else None,
        "agent_ids": agent_ids, "agent_names": agent_names,
        "created_at": r.created_at,
    }


@router.get("/")
def list_reports(category: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(models.Report).order_by(models.Report.created_at.desc())
    if category:
        q = q.filter(models.Report.category == category)
    return [_enrich(r, db) for r in q.all()]


@router.get("/{report_id}")
def get_report(report_id: str, db: Session = Depends(get_db)):
    r = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")
    return _enrich(r, db)


@router.post("/", status_code=201)
def create_report(payload: ReportCreate, db: Session = Depends(get_db)):
    report_id = f"RF-{random.randint(1000, 9999)}"
    report = models.Report(
        id=report_id,
        title=payload.title,
        category=payload.category,
        benchmark_id=payload.benchmark_id,
        winner_id=payload.winner_id,
        agent_ids=json.dumps(payload.agent_ids or []),
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return _enrich(report, db)


@router.delete("/{report_id}")
def delete_report(report_id: str, db: Session = Depends(get_db)):
    r = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(r)
    db.commit()
    return {"message": "Report deleted"}
