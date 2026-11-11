from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from app.db.database import get_db
from app.db import models

router = APIRouter()


@router.get("/summary")
def results_summary(db: Session = Depends(get_db)):
    total  = db.query(func.count(models.Result.id)).scalar() or 0
    passed = db.query(func.count(models.Result.id)).filter(models.Result.status == "passed").scalar() or 0
    review = db.query(func.count(models.Result.id)).filter(models.Result.status == "review").scalar() or 0

    agg = db.query(
        func.round(func.avg(models.Result.accuracy), 1).label("avg_accuracy"),
        func.round(func.avg(models.Result.latency_ms / 1000.0), 2).label("avg_latency_s"),
        func.round(func.avg(models.Result.error_rate), 1).label("avg_error_rate"),
        func.round(func.avg(models.Result.success_rate), 1).label("avg_success_rate"),
        func.round(func.sum(models.Result.cost_usd), 4).label("total_cost"),
        func.sum(models.Result.token_usage).label("total_tokens"),
        func.sum(models.Result.tool_calls).label("total_tool_calls"),
    ).one()

    return {
        "total_runs": total, "passed": passed, "needs_review": review,
        "avg_accuracy": agg.avg_accuracy, "avg_latency_s": agg.avg_latency_s,
        "avg_error_rate": agg.avg_error_rate, "avg_success_rate": agg.avg_success_rate,
        "total_cost": agg.total_cost, "total_tokens": agg.total_tokens,
        "total_tool_calls": agg.total_tool_calls,
    }


@router.get("/")
def list_results(
    benchmark_id: Optional[str] = Query(None),
    agent_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(models.Result).join(models.Agent).join(models.Benchmark)
    if benchmark_id: q = q.filter(models.Result.benchmark_id == benchmark_id)
    if agent_id:     q = q.filter(models.Result.agent_id == agent_id)
    if status:       q = q.filter(models.Result.status == status)
    rows = q.order_by(models.Result.run_at.desc()).all()

    return [
        {
            **{c.name: getattr(r, c.name) for c in models.Result.__table__.columns},
            "agent_name":      r.agent.name,
            "benchmark_title": r.benchmark.title,
            "category":        r.benchmark.category,
        }
        for r in rows
    ]


@router.get("/{result_id}")
def get_result(result_id: str, db: Session = Depends(get_db)):
    r = db.query(models.Result).filter(models.Result.id == result_id).first()
    if not r:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Result not found")
    return {
        **{c.name: getattr(r, c.name) for c in models.Result.__table__.columns},
        "agent_name":      r.agent.name,
        "benchmark_title": r.benchmark.title,
        "category":        r.benchmark.category,
    }
