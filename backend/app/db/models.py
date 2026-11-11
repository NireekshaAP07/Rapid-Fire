import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, ForeignKey, DateTime, Text, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base

# Many-to-many: benchmarks <-> agents
benchmark_agents = Table(
    "benchmark_agents",
    Base.metadata,
    Column("benchmark_id", String, ForeignKey("benchmarks.id", ondelete="CASCADE"), primary_key=True),
    Column("agent_id",     String, ForeignKey("agents.id",     ondelete="CASCADE"), primary_key=True),
)


class Agent(Base):
    __tablename__ = "agents"

    id          = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name        = Column(String, nullable=False, unique=True)
    framework   = Column(String, nullable=False)
    model       = Column(String, nullable=False)
    description = Column(Text, default="")
    status      = Column(String, default="Connected")
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    results    = relationship("Result",    back_populates="agent",    cascade="all, delete")
    alerts     = relationship("Alert",     back_populates="agent")
    benchmarks = relationship("Benchmark", secondary=benchmark_agents, back_populates="agents")


class Benchmark(Base):
    __tablename__ = "benchmarks"

    id               = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title            = Column(String, nullable=False)
    category         = Column(String, nullable=False)
    task             = Column(Text, nullable=False)
    failure_scenario = Column(String, default="No injected failure")
    repetitions      = Column(Integer, default=1)
    status           = Column(String, default="pending")  # pending | running | completed
    created_at       = Column(DateTime(timezone=True), server_default=func.now())
    updated_at       = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    agents  = relationship("Agent",  secondary=benchmark_agents, back_populates="benchmarks")
    results = relationship("Result", back_populates="benchmark",  cascade="all, delete")
    reports = relationship("Report", back_populates="benchmark")


class Result(Base):
    __tablename__ = "results"

    id           = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    benchmark_id = Column(String, ForeignKey("benchmarks.id", ondelete="CASCADE"), nullable=False)
    agent_id     = Column(String, ForeignKey("agents.id",     ondelete="CASCADE"), nullable=False)
    accuracy     = Column(Float,   default=0)
    speed        = Column(Float,   default=0)
    success_rate = Column(Float,   default=0)
    error_rate   = Column(Float,   default=0)
    token_usage  = Column(Integer, default=0)
    cost_usd     = Column(Float,   default=0)
    latency_ms   = Column(Integer, default=0)
    tool_calls   = Column(Integer, default=0)
    retries      = Column(Integer, default=0)
    status       = Column(String,  default="passed")   # passed | review | failed
    trace        = Column(Text,    nullable=True)       # JSON trace blob
    run_at       = Column(DateTime(timezone=True), server_default=func.now())

    benchmark = relationship("Benchmark", back_populates="results")
    agent     = relationship("Agent",     back_populates="results")


class Report(Base):
    __tablename__ = "reports"

    id           = Column(String, primary_key=True)   # e.g. RF-2048
    title        = Column(String, nullable=False)
    category     = Column(String, nullable=False)
    benchmark_id = Column(String, ForeignKey("benchmarks.id"), nullable=True)
    winner_id    = Column(String, ForeignKey("agents.id"),     nullable=True)
    agent_ids    = Column(Text,   default="[]")               # JSON list
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    benchmark = relationship("Benchmark", back_populates="reports")
    winner    = relationship("Agent",     foreign_keys=[winner_id])


class Alert(Base):
    __tablename__ = "alerts"

    id         = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    type       = Column(String, nullable=False)
    title      = Column(String, nullable=False)
    detail     = Column(Text,   nullable=False)
    severity   = Column(String, default="info")   # info | warning | error
    agent_id   = Column(String, ForeignKey("agents.id"), nullable=True)
    resolved   = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    agent = relationship("Agent", back_populates="alerts")
