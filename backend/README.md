# RapidFire Backend

## Tech Stack
- **Python** + **FastAPI** — REST API
- **PostgreSQL** — Persistent storage
- **SQLAlchemy** — ORM
- **Pydantic** — Request/response validation
- **Bifrost** — LLM gateway (model routing & visibility)
- **Tavily** — Web research/search
- **HTTPX** — HTTP client for agent adapters
- **Alembic** — DB migrations

## Setup

### 1. Prerequisites
- Python 3.11+
- PostgreSQL running locally (or via Docker)

### 2. Create virtual environment
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment
```bash
cp .env.example .env
# Then edit .env with your DB credentials and API keys
```

### 5. Run database migrations
```bash
alembic upgrade head
```

### 6. Seed the database (optional)
```bash
python -m app.db.seed
```

### 7. Start the dev server
```bash
uvicorn app.main:app --reload --port 8000
```

API will be available at: http://localhost:8000  
Interactive docs: http://localhost:8000/docs

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/agents | List all agents |
| POST | /api/agents | Create an agent |
| GET | /api/agents/{id} | Get agent by ID |
| PATCH | /api/agents/{id} | Update agent |
| DELETE | /api/agents/{id} | Delete agent |
| GET | /api/benchmarks | List benchmarks |
| POST | /api/benchmarks | Create benchmark |
| POST | /api/benchmarks/{id}/run | Run a benchmark |
| GET | /api/results | List results (filterable) |
| GET | /api/results/summary | Aggregate stats |
| GET | /api/leaderboard | Agent rankings |
| GET | /api/reports | List reports |
| POST | /api/reports | Create report |
| GET | /api/alerts | List alerts |
| POST | /api/alerts | Create alert |
| PATCH | /api/alerts/{id}/resolve | Resolve alert |
| POST | /api/search | Tavily web search |
| POST | /api/llm/run | Bifrost LLM gateway |
| GET | /api/health | Health check |
