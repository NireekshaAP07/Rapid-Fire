from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.db import models

router = APIRouter()

ALLOWED_METRICS = {
    "accuracy":     (models.Result.accuracy,     "desc"),
    "speed":        (models.Result.speed,         "desc"),
    "success_rate": (models.Result.success_rate,  "desc"),
    "error_rate":   (models.Result.error_rate,    "asc"),   # lower is better
    "cost_usd":     (models.Result.cost_usd,      "asc"),   # lower is better
    "latency_ms":   (models.Result.latency_ms,    "asc"),   # lower is better
}


@router.get("/")
def leaderboard(metric: str = Query("accuracy"), db: Session = Depends(get_db)):
    if metric not in ALLOWED_METRICS:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=f"metric must be one of: {', '.join(ALLOWED_METRICS)}")

    col, direction = ALLOWED_METRICS[metric]

    rows = (
        db.query(
            models.Agent.id,
            models.Agent.name,
            models.Agent.framework,
            models.Agent.model,
            models.Agent.status,
            func.round(func.avg(models.Result.accuracy), 1).label("avg_accuracy"),
            func.round(func.avg(models.Result.speed), 1).label("avg_speed"),
            func.round(func.avg(models.Result.success_rate), 1).label("avg_success_rate"),
            func.round(func.avg(models.Result.error_rate), 1).label("avg_error_rate"),
            func.round(func.avg(models.Result.cost_usd), 4).label("avg_cost_usd"),
            func.count(models.Result.id).label("total_runs"),
        )
        .outerjoin(models.Result, models.Result.agent_id == models.Agent.id)
        .group_by(models.Agent.id)
        .order_by(
            func.avg(col).asc() if direction == "asc" else func.avg(col).desc()
        )
        .all()
    )

    return [
        {
            "rank": i + 1,
            "id": r.id, "name": r.name, "framework": r.framework,
            "model": r.model, "status": r.status,
            "avg_accuracy": r.avg_accuracy, "avg_speed": r.avg_speed,
            "avg_success_rate": r.avg_success_rate, "avg_error_rate": r.avg_error_rate,
            "avg_cost_usd": r.avg_cost_usd, "total_runs": r.total_runs,
        }
        for i, r in enumerate(rows)
    ]
