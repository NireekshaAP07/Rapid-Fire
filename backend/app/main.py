from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import Base, engine
from app.routes import agents, benchmarks, results, reports, leaderboard, alerts, search, llm

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RapidFire API",
    description="AI Agent Benchmarking Platform — Backend API",
    version="1.0.0",
)

# CORS — allow all local origins and network IPs for dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(agents.router,      prefix="/api/agents",      tags=["Agents"])
app.include_router(benchmarks.router,  prefix="/api/benchmarks",  tags=["Benchmarks"])
app.include_router(results.router,     prefix="/api/results",     tags=["Results"])
app.include_router(reports.router,     prefix="/api/reports",     tags=["Reports"])
app.include_router(leaderboard.router, prefix="/api/leaderboard", tags=["Leaderboard"])
app.include_router(alerts.router,      prefix="/api/alerts",      tags=["Alerts"])
app.include_router(search.router,      prefix="/api/search",      tags=["Search"])
app.include_router(llm.router,         prefix="/api/llm",         tags=["LLM Gateway"])


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "app": "RapidFire API"}
