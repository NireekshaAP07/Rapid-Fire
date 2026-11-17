# RapidFire — Test. Compare. Understand. 🔥

> **An End-to-End Evaluation & Benchmarking Platform for Autonomous AI Agents**

RapidFire is a full-stack platform designed to benchmark, compare, and diagnose multi-step autonomous AI agents across different frameworks (LangChain, CrewAI, AutoGen, LangGraph) and LLMs (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro).

---

## 🌟 Key Features

- 🤖 **Agent Management**: Register, manage, and test connectivity for AI agent profiles across frameworks.
- ⚖️ **Weighted Scoring Engine**: Adjust real-time sliders for Accuracy, Speed, Success Rate, Error Rate, and Cost to find the optimal agent.
- 🧪 **Benchmark Lab**: Run repeatable evaluation suites with optional failure scenario injection (tool timeouts, schema mismatches).
- 🏆 **Dynamic Leaderboard**: SQL-calculated rankings updated live across accuracy, latency, and success metrics.
- 🌐 **Live Web Search (Tavily)**: Integrated real-time web research to convert live internet findings into benchmark test prompts.
- 🔬 **Execution Trace Viewer**: Inspect granular step-by-step traces (Task Input → Model Request → Tool Calls → Retries → Rubric Evaluation).
- ⚠️ **Failure Diagnosis & AI Insights**: Analyze failure distributions and measure automated self-recovery rates.

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite | Fast, responsive single-page application |
| **Styling** | Tailwind CSS, Lucide Icons | Clean, modern dashboard interface |
| **Backend API** | Python 3.10+, FastAPI, Uvicorn | High-performance asynchronous REST API |
| **Database & ORM** | SQLite / PostgreSQL, SQLAlchemy | Persistent relational storage with seamless migration |
| **Validation** | Pydantic v2 | Strict request/response schema validation |
| **Web Research** | Tavily Search API | Live internet context retrieval for test cases |
| **LLM Gateway** | Bifrost Architecture | Model request routing and observability |

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18 or higher): [nodejs.org](https://nodejs.org/)
- **Python** (v3.10 or higher): [python.org](https://www.python.org/)
- **Git**: [git-scm.com](https://git-scm.com/)

---

## 🚀 Quick Start (Windows Only - One Click)

If you are on Windows, simply double-click:
```cmd
start-all.bat
```
This automatically launches both the FastAPI backend and Vite frontend in separate terminal windows.

---

## 💻 Step-by-Step Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/srushtimanjunath-059/Rapid-Fire.git
cd Rapid-Fire
```

---

### 2. Backend Setup (FastAPI & Python)

#### 🪟 On Windows (PowerShell / Command Prompt)

```powershell
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\activate
# (Or in Command Prompt: venv\Scripts\activate.bat)

# Upgrade pip and install all dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt

# Configure your environment variables
copy .env.example .env
```

#### 🐧 On Linux / macOS (Terminal)

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Upgrade pip and install all dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Configure your environment variables
cp .env.example .env
```

---

### 3. Configure API Keys in `backend/.env`

Open `backend/.env` in your code editor and configure your keys:

```env
# Database (defaults to local SQLite; change if using PostgreSQL)
DATABASE_URL=sqlite:///./rapidfire.db

# Tavily Search API Key (for live web search)
TAVILY_API_KEY=tvly-your_actual_key_here

# Bifrost LLM Gateway (Optional)
BIFROST_BASE_URL=http://localhost:8080
BIFROST_API_KEY=
```

---

### 4. Seed the Database (Optional but Recommended)

Populate the database with sample agents, benchmarks, results, and reports:

**Windows:**
```powershell
python -m app.db.seed
```

**Linux / macOS:**
```bash
python3 -m app.db.seed
```

---

### 5. Run the Backend Server

**Windows:**
```powershell
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Linux / macOS:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API Base URL: **`http://localhost:8000`**
- Interactive Swagger Docs: **`http://localhost:8000/docs`**

---

### 6. Frontend Setup (React & Vite)

Open a **new terminal window** in the root project folder:

#### 🪟 Windows / 🐧 Linux / 🍎 macOS:

```bash
# Ensure you are in the root directory (Rapid-Fire)
cd ..

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
```

- Web Application: **`http://localhost:5173`** (or `http://127.0.0.1:5173`)

---

## 📡 REST API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend health and status check |
| `GET` | `/api/agents/` | List all registered AI agents |
| `POST` | `/api/agents/` | Register a new AI agent |
| `GET` | `/api/agents/{id}` | Get specific agent details |
| `PATCH` | `/api/agents/{id}` | Update agent profile |
| `DELETE` | `/api/agents/{id}` | Delete an agent |
| `GET` | `/api/benchmarks/` | List benchmark test scenarios |
| `POST` | `/api/benchmarks/` | Create a benchmark test |
| `POST` | `/api/benchmarks/{id}/run` | Execute/simulate an agent benchmark run |
| `GET` | `/api/results/` | Query benchmark run results |
| `GET` | `/api/results/summary` | Get aggregated metrics (accuracy, cost, runs) |
| `GET` | `/api/leaderboard/` | Dynamic SQL rankings by metric |
| `GET` | `/api/reports/` | List historical comparison reports |
| `POST` | `/api/reports/` | Save a new benchmark report |
| `GET` | `/api/alerts/` | System reliability and threshold alerts |
| `POST` | `/api/search/` | Live Tavily web search proxy |
| `POST` | `/api/llm/run` | Bifrost LLM gateway routing proxy |

Explore and test all endpoints interactively at **[http://localhost:8000/docs](http://localhost:8000/docs)**.

---

## 📁 Project Directory Structure

```text
Rapid-Fire/
├── backend/                       # Python FastAPI Backend
│   ├── app/
│   │   ├── core/
│   │   │   └── config.py          # App settings & dynamic .env loader
│   │   ├── db/
│   │   │   ├── database.py        # SQLAlchemy engine & session maker
│   │   │   ├── models.py          # Relational DB models
│   │   │   └── seed.py            # Database seeder script
│   │   ├── routes/
│   │   │   ├── agents.py          # Agents CRUD endpoints
│   │   │   ├── alerts.py          # System alert endpoints
│   │   │   ├── benchmarks.py      # Benchmark runner endpoints
│   │   │   ├── leaderboard.py     # SQL dynamic ranking endpoints
│   │   │   ├── llm.py             # Bifrost gateway proxy
│   │   │   ├── reports.py         # Historical report endpoints
│   │   │   ├── results.py         # Results & analytics endpoints
│   │   │   └── search.py          # Tavily live web search proxy
│   │   ├── main.py                # FastAPI entry point & CORS configuration
│   │   └── schemas.py             # Pydantic request/response validation schemas
│   ├── .env.example               # Environment variables template
│   ├── .gitignore                 # Backend-specific ignore rules
│   ├── README.md                  # Backend documentation
│   ├── requirements.txt           # Python package dependencies
│   ├── run.bat                    # Windows backend launcher
│   └── run.ps1                    # PowerShell backend launcher
├── src/                           # React + TypeScript Frontend
│   ├── assets/                    # Images and icons
│   ├── services/
│   │   └── api.ts                 # Typed API client connecting UI to FastAPI
│   ├── App.css                    # Dashboard styling
│   ├── App.tsx                    # Main React application & views
│   ├── index.css                  # Global styles
│   └── main.tsx                   # React root entry point
├── start-all.bat                  # One-click Windows launcher (Backend + Frontend)
├── start-backend.bat              # Standalone Windows backend launcher
├── start-frontend.bat             # Standalone Windows frontend launcher
├── .gitignore                     # Git ignore rules (venv, .env, .db, node_modules)
├── package.json                   # Frontend npm dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── vite.config.ts                 # Vite bundler configuration
```

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project was developed for the RapidFire Hackathon. Distributed under the MIT License.
