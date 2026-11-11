from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ── Agent Schemas ─────────────────────────────────────────────
class AgentCreate(BaseModel):
    name: str
    framework: str
    model: str
    description: Optional[str] = ""
    status: Optional[str] = "Connected"


class AgentUpdate(BaseModel):
    name: Optional[str] = None
    framework: Optional[str] = None
    model: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class AgentOut(BaseModel):
    id: str
    name: str
    framework: str
    model: str
    description: str
    status: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


# ── Benchmark Schemas ─────────────────────────────────────────
class BenchmarkCreate(BaseModel):
    title: str
    category: str
    task: str
    failure_scenario: Optional[str] = "No injected failure"
    repetitions: Optional[int] = 1
    agent_ids: Optional[List[str]] = []


class BenchmarkOut(BaseModel):
    id: str
    title: str
    category: str
    task: str
    failure_scenario: str
    repetitions: int
    status: str
    created_at: datetime
    agent_ids: Optional[List[str]] = []

    class Config:
        from_attributes = True


# ── Result Schemas ────────────────────────────────────────────
class ResultOut(BaseModel):
    id: str
    benchmark_id: str
    agent_id: str
    agent_name: Optional[str] = None
    benchmark_title: Optional[str] = None
    category: Optional[str] = None
    accuracy: float
    speed: float
    success_rate: float
    error_rate: float
    token_usage: int
    cost_usd: float
    latency_ms: int
    tool_calls: int
    retries: int
    status: str
    run_at: datetime

    class Config:
        from_attributes = True


class ResultSummary(BaseModel):
    total_runs: int
    avg_accuracy: Optional[float]
    avg_latency_s: Optional[float]
    avg_error_rate: Optional[float]
    avg_success_rate: Optional[float]
    total_cost: Optional[float]
    total_tokens: Optional[int]
    total_tool_calls: Optional[int]
    passed: int
    needs_review: int


# ── Report Schemas ────────────────────────────────────────────
class ReportCreate(BaseModel):
    title: str
    category: str
    benchmark_id: Optional[str] = None
    winner_id: Optional[str] = None
    agent_ids: Optional[List[str]] = []


class ReportOut(BaseModel):
    id: str
    title: str
    category: str
    benchmark_id: Optional[str]
    winner_id: Optional[str]
    winner_name: Optional[str] = None
    agent_ids: List[str] = []
    agent_names: Optional[List[str]] = []
    created_at: datetime

    class Config:
        from_attributes = True


# ── Alert Schemas ─────────────────────────────────────────────
class AlertCreate(BaseModel):
    type: str
    title: str
    detail: str
    severity: Optional[str] = "info"
    agent_id: Optional[str] = None


class AlertOut(BaseModel):
    id: str
    type: str
    title: str
    detail: str
    severity: str
    agent_id: Optional[str]
    agent_name: Optional[str] = None
    resolved: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ── Leaderboard Schemas ───────────────────────────────────────
class LeaderboardEntry(BaseModel):
    rank: int
    id: str
    name: str
    framework: str
    model: str
    status: str
    avg_accuracy: Optional[float]
    avg_speed: Optional[float]
    avg_success_rate: Optional[float]
    avg_error_rate: Optional[float]
    avg_cost_usd: Optional[float]
    total_runs: int


# ── Search Schemas ────────────────────────────────────────────
class SearchRequest(BaseModel):
    query: str
    max_results: Optional[int] = 3
    search_depth: Optional[str] = "basic"   # basic | advanced


class SearchResult(BaseModel):
    title: str
    url: str
    content: str
    score: Optional[float] = None


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]


# ── LLM / Bifrost Schemas ─────────────────────────────────────
class LLMRequest(BaseModel):
    model: str                              # e.g. "openai/gpt-4o"
    messages: List[dict]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1024


class LLMResponse(BaseModel):
    model: str
    content: str
    usage: Optional[dict] = None
