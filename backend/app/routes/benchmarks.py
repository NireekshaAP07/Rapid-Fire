import uuid, random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db import models
from app.schemas import BenchmarkCreate, BenchmarkOut

router = APIRouter()


def _enrich(benchmark: models.Benchmark) -> dict:
    b = BenchmarkOut.model_validate(benchmark).model_dump()
    b["agent_ids"] = [a.id for a in benchmark.agents]
    return b


@router.get("/")
def list_benchmarks(db: Session = Depends(get_db)):
    benchmarks = db.query(models.Benchmark).order_by(models.Benchmark.created_at.desc()).all()
    return [_enrich(b) for b in benchmarks]


@router.get("/{benchmark_id}")
def get_benchmark(benchmark_id: str, db: Session = Depends(get_db)):
    b = db.query(models.Benchmark).filter(models.Benchmark.id == benchmark_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Benchmark not found")
    return _enrich(b)


@router.post("/", status_code=201)
def create_benchmark(payload: BenchmarkCreate, db: Session = Depends(get_db)):
    benchmark = models.Benchmark(
        id=str(uuid.uuid4()),
        title=payload.title,
        category=payload.category,
        task=payload.task,
        failure_scenario=payload.failure_scenario,
        repetitions=payload.repetitions,
    )
    if payload.agent_ids:
        agents = db.query(models.Agent).filter(models.Agent.id.in_(payload.agent_ids)).all()
        benchmark.agents = agents
    db.add(benchmark)
    db.commit()
    db.refresh(benchmark)
    return _enrich(benchmark)


@router.post("/{benchmark_id}/run")
def run_benchmark(benchmark_id: str, db: Session = Depends(get_db)):
    """Simulate running a benchmark — generates mock results for each linked agent."""
    benchmark = db.query(models.Benchmark).filter(models.Benchmark.id == benchmark_id).first()
    if not benchmark:
        raise HTTPException(status_code=404, detail="Benchmark not found")

    benchmark.status = "running"
    db.commit()

    generated = []
    for agent in benchmark.agents:
        accuracy     = round(random.uniform(70, 98), 1)
        speed        = round(random.uniform(70, 98), 1)
        success_rate = round(random.uniform(75, 98), 1)
        error_rate   = round(random.uniform(2, 20), 1)
        latency_ms   = random.randint(800, 4000)
        token_usage  = random.randint(1000, 8000)
        cost_usd     = round(token_usage * 0.00003, 4)
        tool_calls   = random.randint(1, 7)
        retries      = random.randint(0, 2)
        status       = "passed" if success_rate >= 80 else "review"

        result = models.Result(
            id=str(uuid.uuid4()),
            benchmark_id=benchmark.id,
            agent_id=agent.id,
            accuracy=accuracy, speed=speed,
            success_rate=success_rate, error_rate=error_rate,
            token_usage=token_usage, cost_usd=cost_usd,
            latency_ms=latency_ms, tool_calls=tool_calls,
            retries=retries, status=status,
        )
        db.add(result)
        generated.append({"agent": agent.name, "accuracy": accuracy, "success_rate": success_rate, "status": status})

    benchmark.status = "completed"
    db.commit()
    return {"message": "Benchmark completed", "results": generated}


@router.delete("/{benchmark_id}")
def delete_benchmark(benchmark_id: str, db: Session = Depends(get_db)):
    b = db.query(models.Benchmark).filter(models.Benchmark.id == benchmark_id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Benchmark not found")
    db.delete(b)
    db.commit()
    return {"message": "Benchmark deleted"}
