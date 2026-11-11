import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.database import get_db
from app.db import models
from app.schemas import AlertCreate

router = APIRouter()


@router.get("/")
def list_alerts(resolved: Optional[bool] = Query(None), db: Session = Depends(get_db)):
    q = db.query(models.Alert).order_by(models.Alert.created_at.desc())
    if resolved is not None:
        q = q.filter(models.Alert.resolved == resolved)
    rows = q.all()
    return [
        {
            **{c.name: getattr(a, c.name) for c in models.Alert.__table__.columns},
            "agent_name": a.agent.name if a.agent else None,
        }
        for a in rows
    ]


@router.post("/", status_code=201)
def create_alert(payload: AlertCreate, db: Session = Depends(get_db)):
    alert = models.Alert(id=str(uuid.uuid4()), **payload.model_dump())
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


@router.patch("/{alert_id}/resolve")
def resolve_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.resolved = True
    db.commit()
    return {"message": "Alert resolved"}


@router.delete("/{alert_id}")
def delete_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.delete(alert)
    db.commit()
    return {"message": "Alert deleted"}
