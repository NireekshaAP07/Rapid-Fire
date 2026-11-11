"""
Seed the database with demo data matching the frontend's demo agents/reports.
Run with:  python -m app.db.seed
"""
import uuid, json, random
from app.db.database import SessionLocal, engine
from app.db import models
from app.db.database import Base

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── Agents ────────────────────────────────────────────────────
agents_data = [
    {"name": "Atlas Research", "framework": "LangChain",  "model": "GPT-4o",            "status": "Connected",    "description": "Demonstration agent"},
    {"name": "Nova Analyst",   "framework": "CrewAI",     "model": "Claude 3.5 Sonnet", "status": "Connected",    "description": "Demonstration agent"},
    {"name": "Sage Assistant", "framework": "AutoGen",    "model": "Gemini 1.5 Pro",    "status": "Connected",    "description": "Demonstration agent"},
    {"name": "Orion Workflow", "framework": "LangGraph",  "model": "GPT-4o mini",       "status": "Needs review", "description": "Demonstration agent"},
]

agent_objs = {}
for a in agents_data:
    existing = db.query(models.Agent).filter_by(name=a["name"]).first()
    if not existing:
        obj = models.Agent(id=str(uuid.uuid4()), **a)
        db.add(obj)
        db.flush()
        agent_objs[a["name"]] = obj
    else:
        agent_objs[a["name"]] = existing

db.commit()

# ── Benchmarks ────────────────────────────────────────────────
bench1 = db.query(models.Benchmark).filter_by(title="Research synthesis comparison").first()
if not bench1:
    bench1 = models.Benchmark(
        id=str(uuid.uuid4()), title="Research synthesis comparison",
        category="Research", task="Summarize a research article", status="completed"
    )
    bench1.agents = [agent_objs["Atlas Research"], agent_objs["Nova Analyst"]]
    db.add(bench1)

bench2 = db.query(models.Benchmark).filter_by(title="Tool reliability review").first()
if not bench2:
    bench2 = models.Benchmark(
        id=str(uuid.uuid4()), title="Tool reliability review",
        category="Tool use", task="Resolve a support request", status="completed"
    )
    bench2.agents = [agent_objs["Sage Assistant"], agent_objs["Orion Workflow"]]
    db.add(bench2)

db.commit()

# ── Results ───────────────────────────────────────────────────
result_data = [
    {"benchmark": bench1, "agent": agent_objs["Atlas Research"], "accuracy": 94, "speed": 82, "success_rate": 96, "error_rate": 5,  "token_usage": 71000, "cost_usd": 0.12, "latency_ms": 2100, "tool_calls": 3, "retries": 1, "status": "passed"},
    {"benchmark": bench1, "agent": agent_objs["Nova Analyst"],   "accuracy": 91, "speed": 89, "success_rate": 91, "error_rate": 8,  "token_usage": 82000, "cost_usd": 0.09, "latency_ms": 2300, "tool_calls": 4, "retries": 0, "status": "passed"},
    {"benchmark": bench2, "agent": agent_objs["Sage Assistant"], "accuracy": 87, "speed": 94, "success_rate": 88, "error_rate": 11, "token_usage": 65000, "cost_usd": 0.08, "latency_ms": 1800, "tool_calls": 5, "retries": 1, "status": "passed"},
    {"benchmark": bench2, "agent": agent_objs["Orion Workflow"], "accuracy": 81, "speed": 91, "success_rate": 79, "error_rate": 17, "token_usage": 86000, "cost_usd": 0.11, "latency_ms": 2900, "tool_calls": 6, "retries": 2, "status": "review"},
]
for r in result_data:
    bench = r.pop("benchmark")
    agent = r.pop("agent")
    if not db.query(models.Result).filter_by(benchmark_id=bench.id, agent_id=agent.id).first():
        db.add(models.Result(id=str(uuid.uuid4()), benchmark_id=bench.id, agent_id=agent.id, **r))

db.commit()

# ── Reports ───────────────────────────────────────────────────
reports_data = [
    {"id": "RF-2048", "title": "Research synthesis comparison", "category": "Research",  "benchmark_id": bench1.id, "winner_id": agent_objs["Atlas Research"].id, "agent_ids": json.dumps([agent_objs["Atlas Research"].id, agent_objs["Nova Analyst"].id])},
    {"id": "RF-2031", "title": "Tool reliability review",       "category": "Tool use",  "benchmark_id": bench2.id, "winner_id": agent_objs["Sage Assistant"].id,  "agent_ids": json.dumps([agent_objs["Sage Assistant"].id, agent_objs["Orion Workflow"].id])},
    {"id": "RF-2019", "title": "Instruction following eval",    "category": "Reasoning", "benchmark_id": bench1.id, "winner_id": agent_objs["Atlas Research"].id, "agent_ids": json.dumps([agent_objs["Atlas Research"].id, agent_objs["Sage Assistant"].id])},
    {"id": "RF-2004", "title": "Multi-source retrieval",        "category": "Research",  "benchmark_id": bench2.id, "winner_id": agent_objs["Nova Analyst"].id,   "agent_ids": json.dumps([agent_objs["Nova Analyst"].id,   agent_objs["Orion Workflow"].id])},
]
for r in reports_data:
    if not db.query(models.Report).filter_by(id=r["id"]).first():
        db.add(models.Report(**r))

db.commit()

# ── Alerts ────────────────────────────────────────────────────
alerts_data = [
    {"type": "success_rate", "title": "Success rate dip",          "detail": "Orion Workflow fell below 80% success threshold.", "severity": "error",   "agent_id": agent_objs["Orion Workflow"].id},
    {"type": "tool_errors",  "title": "Tool errors increased",     "detail": "Tool timeout failures rose in the latest batch.",   "severity": "warning", "agent_id": None},
    {"type": "token_usage",  "title": "Token usage rising",        "detail": "Average tokens per run increased by 14%.",          "severity": "info",    "agent_id": None},
    {"type": "cost",         "title": "Cost threshold approaching", "detail": "Estimated spend approaching $50 threshold.",       "severity": "warning", "agent_id": None},
]
for a in alerts_data:
    if not db.query(models.Alert).filter_by(title=a["title"]).first():
        db.add(models.Alert(id=str(uuid.uuid4()), **a))

db.commit()
db.close()
print("✅ Database seeded successfully!")
