const getApiBase = () => {
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:8000/api`;
  }
  return 'http://127.0.0.1:8000/api';
};

const API_BASE = getApiBase();

export interface Agent {
  id: string;
  name: string;
  framework: string;
  model: string;
  description: string;
  status: string;
  created_at?: string;
}

export interface Benchmark {
  id: string;
  title: string;
  category: string;
  task: string;
  failure_scenario: string;
  repetitions: number;
  status: string;
  agent_ids: string[];
}

export interface ResultSummary {
  total_runs: number;
  passed: number;
  needs_review: number;
  avg_accuracy: number | null;
  avg_latency_s: number | null;
  avg_error_rate: number | null;
  avg_success_rate: number | null;
  total_cost: number | null;
  total_tokens: number | null;
  total_tool_calls: number | null;
}

export interface ReportItem {
  id: string;
  title: string;
  category: string;
  benchmark_id?: string;
  winner_id?: string;
  winner_name?: string;
  agent_ids: string[];
  agent_names: string[];
  created_at: string;
}

export interface LeaderboardAgent {
  rank: number;
  id: string;
  name: string;
  framework: string;
  model: string;
  status: string;
  avg_accuracy: number | null;
  avg_speed: number | null;
  avg_success_rate: number | null;
  avg_error_rate: number | null;
  avg_cost_usd: number | null;
  total_runs: number;
}

export interface AlertItem {
  id: string;
  type: string;
  title: string;
  detail: string;
  severity: string;
  agent_id?: string;
  agent_name?: string;
  resolved: boolean;
  created_at: string;
}

export const api = {
  // Health
  checkHealth: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Agents
  getAgents: async (): Promise<Agent[]> => {
    const res = await fetch(`${API_BASE}/agents/`);
    if (!res.ok) throw new Error('Failed to fetch agents');
    return res.json();
  },

  createAgent: async (agent: { name: string; framework: string; model: string; description?: string }): Promise<Agent> => {
    const res = await fetch(`${API_BASE}/agents/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent),
    });
    if (!res.ok) throw new Error('Failed to create agent');
    return res.json();
  },

  // Benchmarks
  getBenchmarks: async (): Promise<Benchmark[]> => {
    const res = await fetch(`${API_BASE}/benchmarks/`);
    if (!res.ok) throw new Error('Failed to fetch benchmarks');
    return res.json();
  },

  runBenchmark: async (id: string) => {
    const res = await fetch(`${API_BASE}/benchmarks/${id}/run`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to run benchmark');
    return res.json();
  },

  // Results & Summary
  getResultsSummary: async (): Promise<ResultSummary> => {
    const res = await fetch(`${API_BASE}/results/summary`);
    if (!res.ok) throw new Error('Failed to fetch results summary');
    return res.json();
  },

  getResults: async () => {
    const res = await fetch(`${API_BASE}/results/`);
    if (!res.ok) throw new Error('Failed to fetch results');
    return res.json();
  },

  // Reports
  getReports: async (): Promise<ReportItem[]> => {
    const res = await fetch(`${API_BASE}/reports/`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  // Leaderboard
  getLeaderboard: async (metric = 'accuracy'): Promise<LeaderboardAgent[]> => {
    const res = await fetch(`${API_BASE}/leaderboard/?metric=${metric}`);
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return res.json();
  },

  // Alerts
  getAlerts: async (): Promise<AlertItem[]> => {
    const res = await fetch(`${API_BASE}/alerts/`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  // Tavily Search
  searchTavily: async (query: string, maxResults = 3) => {
    const res = await fetch(`${API_BASE}/search/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, max_results: maxResults }),
    });
    if (!res.ok) throw new Error('Tavily search failed');
    return res.json();
  },
};
