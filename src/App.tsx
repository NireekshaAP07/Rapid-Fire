import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bot,
  CheckCircle2,
  CircleCheck,
  CircleX,
  Clock3,
  FlaskConical,
  Flame,
  Files,
  Gauge,
  GitCompareArrows,
  LayoutDashboard,
  LogOut,
  Menu,
  Play,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  Trophy,
  Wallet,
  Wrench,
  RotateCcw,
  PlugZap,
  PanelRightOpen,
  ChartNoAxesCombined,
} from 'lucide-react';
import './App.css';

const navItems: Array<[string, string]> = [
  ['Overview', 'layout-dashboard'],
  ['Agent Management', 'bot'],
  ['Compare Agents', 'git-compare-arrows'],
  ['Benchmark Lab', 'flask-conical'],
  ['Tavily Search', 'search'],
  ['Results & Analytics', 'chart-no-axes-combined'],
  ['Past Reports', 'files'],
  ['Leaderboard', 'trophy'],
  ['Failure Center', 'shield-alert'],
  ['AI Insights', 'sparkles'],
  ['Alerts', 'bell'],
  ['Settings', 'settings'],
];

type DemoAgent = {
  name: string;
  framework: string;
  model: string;
  status: string;
  score: number;
  accuracy: number;
  speed: number;
  success: number;
  errors: number;
  tokens: number;
  cost: number;
  tools: number;
  reliability: number;
};

const demoAgents: DemoAgent[] = [
  { name: 'Atlas Research', framework: 'LangChain', model: 'GPT-4o', status: 'Connected', score: 92, accuracy: 94, speed: 82, success: 96, errors: 5, tokens: 71, cost: 76, tools: 88, reliability: 94 },
  { name: 'Nova Analyst', framework: 'CrewAI', model: 'Claude 3.5 Sonnet', status: 'Connected', score: 88, accuracy: 91, speed: 89, success: 91, errors: 8, tokens: 82, cost: 70, tools: 86, reliability: 90 },
  { name: 'Sage Assistant', framework: 'AutoGen', model: 'Gemini 1.5 Pro', status: 'Connected', score: 84, accuracy: 87, speed: 94, success: 88, errors: 11, tokens: 89, cost: 87, tools: 77, reliability: 85 },
  { name: 'Orion Workflow', framework: 'LangGraph', model: 'GPT-4o mini', status: 'Needs review', score: 78, accuracy: 81, speed: 91, success: 79, errors: 17, tokens: 86, cost: 93, tools: 72, reliability: 76 },
];

const metricNames: Record<string, string> = {
  accuracy: 'Accuracy',
  speed: 'Speed',
  success: 'Success rate',
  errors: 'Error rate',
  tokens: 'Token efficiency',
  cost: 'Cost efficiency',
  tools: 'Tool calls',
  reliability: 'Reliability',
};

const sources = [
  {
    title: 'Building reliable AI agents: evaluation patterns',
    url: 'https://www.anthropic.com/engineering/building-effective-agents',
    summary: 'A practical overview of agent workflows, tool use, and evaluation considerations.',
    score: 96,
    topic: 'AI',
    date: '2025-02-10',
  },
  {
    title: 'A guide to measuring retrieval quality',
    url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/',
    summary: 'Foundational concepts for retrieval, grounding, and assessing source relevance.',
    score: 91,
    topic: 'AI',
    date: '2024-09-18',
  },
  {
    title: 'Benchmarking agentic systems in practice',
    url: 'https://www.langchain.com/blog',
    summary: 'Ideas for repeatable tasks, traces, and comparing multi-step agent behavior.',
    score: 87,
    topic: 'Research',
    date: '2024-11-04',
  },
];

const reports = [
  { id: 'RF-2048', title: 'Research synthesis comparison', date: 'May 20, 2025', agents: 'Atlas · Nova', winner: 'Atlas Research', category: 'Research' },
  { id: 'RF-2031', title: 'Tool reliability review', date: 'May 16, 2025', agents: 'Sage · Orion', winner: 'Sage Assistant', category: 'Tool use' },
  { id: 'RF-2019', title: 'Instruction following evaluation', date: 'May 12, 2025', agents: 'Atlas · Sage', winner: 'Atlas Research', category: 'Reasoning' },
  { id: 'RF-2004', title: 'Multi-source retrieval', date: 'May 08, 2025', agents: 'Nova · Orion', winner: 'Nova Analyst', category: 'Research' },
];

function App() {
  const [page, setPage] = useState<string>('Overview');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['Atlas Research', 'Nova Analyst']);
  const [weights, setWeights] = useState({ accuracy: 25, speed: 15, success: 20, errors: 10, tokens: 10, cost: 10, reliability: 10 });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [benchmarkTask, setBenchmarkTask] = useState('Summarize a research article');
  const [runProgress, setRunProgress] = useState(0);
  const [reportFilter, setReportFilter] = useState('');
  const [sortMetric, setSortMetric] = useState('score');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState<{ title: string; content: string } | null>(null);

  const heading = (title: string, subtitle: string, actions?: React.ReactNode) => (
    <div className="heading" key={title}>
      <div>
        <div className="eyebrow">RapidFire / {title}</div>
        <h1>{title}</h1>
        <p className="sub">{subtitle}</p>
      </div>
      <div className="row">{actions}</div>
    </div>
  );

  const renderStat = (label: string, value: string, icon: React.ReactNode, delta: string) => (
    <div className="card stat-card" key={label}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">
        {label} <span title="Demonstration metric; not live data">ⓘ</span>
      </div>
      <div className="stat-value">{value}</div>
      <span className="delta">{delta}</span>
    </div>
  );

  const overview = () => (
    <>
      {heading('Overview', 'A calm, clear view of how your agents are performing.', (
        <button className="btn primary" type="button" onClick={() => setPage('Benchmark Lab')}>
          <Plus size={15} /> New benchmark
        </button>
      ))}
      <div className="notice">This workspace uses illustrative benchmark results. Your own agents are saved separately in a Canva Sheet.</div>
      <div className="grid stats">
        {renderStat('Total agents', String(demoAgents.length).padStart(2, '0'), <Bot size={18} />, '4 demo agents included')}
        {renderStat('Experiments', '128', <FlaskConical size={18} />, '↑ 12.4% vs last month')}
        {renderStat('Success rate', '92.8%', <CircleCheck size={18} />, '↑ 3.2% vs last month')}
        {renderStat('Total spend', '$48.26', <Wallet size={18} />, 'Sample estimated cost')}
      </div>
      <div className="split">
        <section className="card canva-card">
          <div className="card-head"><h2>Benchmark activity</h2><span className="pill">Last 12 weeks</span></div>
          <div className="mini">Experiment runs over the last 12 weeks</div>
          <div className="chart">
            {[46, 62, 54, 72, 58, 75, 68, 81, 73, 91, 78, 95].map((v, i) => (
              <div className="bar-wrap" key={i}>
                <div className="bar" style={{ height: `${v}%`, background: i % 3 === 0 ? '#d8c7eb' : '#9b7bc8' }} />
                <small>{i % 2 === 0 ? `W${i + 1}` : ''}</small>
              </div>
            ))}
          </div>
        </section>
        <section className="card canva-card">
          <div className="card-head"><h2>Quick actions</h2></div>
          <div className="list">
            {[['Compare agents','Find the strongest fit for your tasks','Compare Agents'],['Run a benchmark','Evaluate against repeatable tasks','Benchmark Lab'],['Explore results','See trends and detailed traces','Results & Analytics'],['Review reports','Revisit previous comparisons','Past Reports']].map(([label, text, pageName]) => (
              <div className="list-item" key={label}>
                <div>
                  <strong>{label}</strong>
                  <small>{text}</small>
                </div>
                <button className="btn" type="button" onClick={() => setPage(pageName as string)}><ArrowUpRight size={15} /></button>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="split">
        <section className="card canva-card">
          <div className="card-head"><h2>Recent experiments</h2></div>
          <div className="table-wrap"><table className="table"><thead><tr><th>Experiment</th><th>Agents</th><th>Success</th><th>Date</th></tr></thead><tbody><tr><td>Research synthesis</td><td>Atlas · Nova</td><td>96%</td><td>Today</td></tr><tr><td>Tool reliability test</td><td>Sage · Orion</td><td>89%</td><td>Yesterday</td></tr><tr><td>Multi-step reasoning</td><td>Atlas · Sage</td><td>93%</td><td>May 18</td></tr></tbody></table></div>
        </section>
        <section className="card canva-card">
          <div className="card-head"><h2>Usage snapshot</h2></div>
          <div className="list">
            <div className="list-item"><span>Tokens processed</span><strong>1.24M</strong></div>
            <div className="list-item"><span>Average latency</span><strong>2.4 s</strong></div>
            <div className="list-item"><span>Tool calls</span><strong>3,482</strong></div>
            <div className="list-item"><span>Estimated cost / run</span><strong>$0.38</strong></div>
          </div>
        </section>
      </div>
    </>
  );

  const agentsView = () => (
    <>
      {heading('Agent Management', 'Keep your agent roster organized and ready to evaluate.', (
        <button className="btn primary" type="button">
          <Plus size={15} /> Add agent
        </button>
      ))}
      <div className="notice">Four example agents illustrate the platform. Add your own agent profile to save it in a Canva Sheet. “Test connection” is a simulated UI check, not a live API test.</div>
      <div className="grid agent-grid">
        {demoAgents.map((agent) => (
          <article className="card agent-card" key={agent.name}>
            <div className="agent-top"><div className="agent-logo">{agent.name[0]}</div><span className={`badge ${agent.status === 'Connected' ? '' : 'orange'}`}>{agent.status}</span></div>
            <div><h3>{agent.name}</h3><p>Demonstration agent</p></div>
            <div className="agent-meta"><div><small>Framework</small><strong>{agent.framework}</strong></div><div><small>Model</small><strong>{agent.model}</strong></div></div>
            <div className="agent-actions"><button className="btn" type="button" onClick={() => alert('Demo check only: no live connection was tested.')}><PlugZap size={15} /> Test connection</button></div>
          </article>
        ))}
      </div>
    </>
  );

  const compare = () => {
    const selected = demoAgents.filter((agent) => selectedAgents.includes(agent.name));
    const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
    const computeScore = (agent: DemoAgent) => Math.round(
      Object.entries(weights).reduce((sum, [key, weight]) => {
        const value = key === 'errors' ? 100 - agent.errors : (agent as any)[key];
        return sum + value * weight;
      }, 0) / total,
    );
    const winner = [...selected].sort((a, b) => computeScore(b) - computeScore(a))[0];

    return (
      <>
        {heading('Compare Agents', 'Same tasks. Clear evidence. A comparison you can actually act on.', (
          <>
            <button className="btn" type="button">Download CSV</button>
            <button className="btn primary" type="button" onClick={() => setPage('Benchmark Lab')}><Play size={15} /> Run benchmark</button>
          </>
        ))}
        <div className="notice">Illustrative results from identical sample tasks: research synthesis, fact extraction, and tool-use recovery. Select at least two agents. Scores update as you adjust weights.</div>
        <section className="card canva-card">
          <div className="card-head"><h2>Choose agents to compare</h2></div>
          <div className="compare-picker">
            {demoAgents.map((agent) => (
              <label className="pick" key={agent.name}>
                <input type="checkbox" checked={selectedAgents.includes(agent.name)} onChange={(e) => {
                  if (e.target.checked) setSelectedAgents((prev) => [...prev, agent.name]);
                  else setSelectedAgents((prev) => prev.filter((name) => name !== agent.name));
                }} />
                {agent.name}
              </label>
            ))}
          </div>
        </section>
        <div className="split">
          <section className="card canva-card">
            <div className="card-head"><h2>Weighted scoring</h2></div>
            <p className="mini">Set what matters most. Weights are normalized automatically; lower error rate earns a higher score.</p>
            {Object.entries(weights).map(([key, value]) => (
              <div className="weight-row" key={key}><label htmlFor={`weight-${key}`}>{metricNames[key]}</label><input id={`weight-${key}`} type="range" min={0} max={50} value={value} onChange={(e) => setWeights({ ...weights, [key]: Number(e.target.value) })} /><output>{value}%</output></div>
            ))}
            <p className="mini">Total weight: <strong>{total}%</strong></p>
          </section>
          <section className="card canva-card">
            <div className="card-head"><h2>The current leader</h2></div>
            {selected.length >= 2 ? (
              <>
                <div className="score-card"><span className="pill">Highest weighted score</span><h2 style={{ margin: '15px 0 2px' }}>{winner?.name}</h2><div className="score-num">{winner ? computeScore(winner) : 0}<span style={{ fontSize: 16 }}> / 100</span></div><p className="sub">Based on your selected metric weights.</p></div>
                <p className="mini" style={{ marginTop: 15 }}>Scores are demonstration estimates, not live evaluations.</p>
              </>
            ) : (
              <div className="empty"><GitCompareArrows size={32} /><p>Select at least two agents to see a winner.</p></div>
            )}
          </section>
        </div>
        {selected.length >= 2 ? (
          <div className="split">
            <section className="card canva-card">
              <div className="card-head"><h2>Side-by-side performance</h2></div>
              <div className="table-wrap"><table className="table"><thead><tr><th>Metric</th>{selected.map((agent) => <th key={agent.name}>{agent.name}</th>)}</tr></thead><tbody>{Object.keys(metricNames).map((key) => (
                <tr key={key}>
                  <td><strong>{metricNames[key]}</strong></td>
                  {selected.map((agent) => {
                    const value = (agent as any)[key];
                    return <td key={`${agent.name}-${key}`}>{key === 'errors' ? `${value}%` : `${value} / 100`}</td>;
                  })}
                </tr>
              ))}</tbody></table></div>
            </section>
            <section className="card canva-card">
              <div className="card-head"><h2>Performance profile</h2></div>
              <div className="mini">Higher bars indicate stronger performance, including inverted error rate.</div>
              {selected.map((agent) => {
                return (
                  <div key={agent.name} style={{ marginTop: 19 }}>
                    <strong>{agent.name}</strong>
                    {['accuracy', 'speed', 'success', 'reliability'].map((key) => (
                      <div className="metric-row" key={`${agent.name}-${key}`}>
                        <span>{metricNames[key]}</span>
                        <div className="meter"><span style={{ width: `${agent[key as keyof DemoAgent]}%` }} /></div>
                        <strong>{agent[key as keyof DemoAgent]}</strong>
                      </div>
                    ))}
                  </div>
                );
              })}
            </section>
          </div>
        ) : null}
      </>
    );
  };

  const benchmark = () => (
    <>
      {heading('Benchmark Lab', 'Design a repeatable evaluation, then watch a sample execution unfold.', (
        <button className="btn" type="button" onClick={() => setPage('Execution Trace Viewer')}>
          <PanelRightOpen size={15} /> View trace
        </button>
      ))}
      <div className="split">
        <section className="card canva-card">
          <div className="card-head"><h2>Configure a run</h2><span className="pill">Demo simulation</span></div>
          <div className="formgrid">
            <div className="field"><label htmlFor="bench-agent">Agent</label><select id="bench-agent" className="select">{demoAgents.map((agent) => <option key={agent.name}>{agent.name}</option>)}</select></div>
            <div className="field"><label htmlFor="bench-category">Category</label><select id="bench-category" className="select"><option>Research & retrieval</option><option>Reasoning</option><option>Tool use</option><option>Instruction following</option></select></div>
            <div className="field"><label htmlFor="bench-task">Predefined task</label><select id="bench-task" className="select" value={benchmarkTask} onChange={(e) => setBenchmarkTask(e.target.value)}><option>Summarize a research article</option><option>Extract facts from sources</option><option>Resolve a support request</option><option>Compare two product options</option></select></div>
            <div className="field"><label htmlFor="bench-reps">Repetitions</label><select id="bench-reps" className="select"><option>1 run</option><option>3 runs</option><option>5 runs</option><option>10 runs</option></select></div>
          </div>
          <div className="field" style={{ marginTop: 17 }}><label htmlFor="custom-task">Custom task (optional)</label><textarea id="custom-task" className="textarea" placeholder="Describe a task to use in this demonstration..." value={benchmarkTask !== 'Summarize a research article' ? benchmarkTask : ''} onChange={(e) => setBenchmarkTask(e.target.value)} /></div>
          <div className="field" style={{ marginTop: 17 }}><label htmlFor="failure-scenario">Failure scenario</label><select id="failure-scenario" className="select"><option>No injected failure</option><option>Tool timeout</option><option>Incomplete source</option><option>Ambiguous instruction</option></select></div>
          <div className="row" style={{ marginTop: 22 }}><button type="button" className="btn primary" onClick={() => { setRunProgress(0); const interval = window.setInterval(() => { setRunProgress((prev) => { const next = Math.min(prev + 10, 100); if (next === 100) window.clearInterval(interval); return next; }); }, 350); }}><Play size={15} /> Start demo run</button><span className="mini">No external models are called.</span></div>
        </section>
        <section className="card canva-card">
          <div className="card-head"><h2>Execution progress</h2></div>
          <div className="score-card"><div className="row" style={{ justifyContent: 'space-between' }}><strong>{runProgress === 100 ? 'Demo run completed' : runProgress ? 'Running sample steps' : 'Ready when you are'}</strong><strong>{runProgress}%</strong></div><div className="progress"><span style={{ width: `${runProgress}%` }} /></div><p className="mini">A sample timeline will appear as the demonstration advances.</p></div>
          <div className="steps">{['Prepare task', 'Call model', 'Use tools', 'Score result'].map((step, index) => <div className={`step ${runProgress > index * 25 ? 'done' : ''}`} key={step}>{String(index + 1).padStart(2, '0')}<strong>{step}</strong></div>)}</div>
          <div className="notice">Want to inspect each request, retry, and output? Open the Execution Trace Viewer.</div>
          <button className="btn" type="button" onClick={() => setPage('Execution Trace Viewer')}>Open trace <ArrowRight size={15} /></button>
        </section>
      </div>
    </>
  );

  const tavily = () => (
    <>
      {heading('Tavily Search', 'Explore a research workflow and turn a result into a benchmark task.', '')}
      <div className="search-hero">
        <div className="eyebrow">Search workspace · sample mode</div>
        <h2>Find context, then test with it.</h2>
        <p className="sub">Search and filters operate on a small set of sample results. No live Tavily request is made.</p>
        <div className="row" style={{ marginTop: 20 }}>
          <input id="search-query" className="input" placeholder="Search sample results..." defaultValue="AI agents" style={{ flex: 1, minWidth: 210 }} />
          <button className="btn primary" type="button" onClick={() => setSearchHistory((prev) => {
            const value = (document.getElementById('search-query') as HTMLInputElement | null)?.value.trim();
            return value ? [value, ...prev].slice(0, 5) : prev;
          })}><Search size={15} /> Search</button>
        </div>
      </div>
      <div className="toolbar"><select className="select"><option>Basic depth</option><option>Advanced depth</option></select><select className="select"><option>3 results</option><option>2 results</option><option>1 result</option></select><select className="select"><option>All topics</option><option>AI</option><option>Research</option></select><select className="select"><option>Any date</option><option>2025</option><option>2024</option></select><input className="input" placeholder="Filter domain" /></div>
      <div className="split">
        <div>
          {sources.map((item) => (
            <article className="result-card" key={item.url}>
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="badge purple">{item.topic}</span><span className="mini">Relevance {item.score}%</span></div>
              <h3>{item.title}</h3>
              <a className="url" href={item.url} target="_blank" rel="noopener noreferrer">{item.url} ↗</a>
              <p>{item.summary}</p>
              <div className="row"><button className="btn soft" type="button" onClick={() => { setBenchmarkTask(`Summarize and evaluate: ${item.title}`); setPage('Benchmark Lab'); }}><Plus size={15} /> Use as benchmark task</button><span className="mini">{item.date}</span></div>
            </article>
          ))}
        </div>
        <section className="card canva-card"><div className="card-head"><h2>Search history</h2></div><div className="list">{searchHistory.length ? searchHistory.map((term) => <div className="list-item" key={term}><span>{term}</span><span className="mini">This session</span></div>) : <p className="sub">Your searches in this view will appear here.</p>}</div><div className="notice" style={{ marginTop: 18 }}>For live search, connect a secure service outside this demonstration. Do not enter API keys here.</div></section>
      </div>
    </>
  );

  const results = () => (
    <>
      {heading('Results & Analytics', 'Spot trends and understand what happened across sample experiments.', (
        <button className="btn" type="button" onClick={() => setPage('Execution Trace Viewer')}>
          View execution trace <ArrowRight size={15} />
        </button>
      ))}
      <div className="toolbar"><select className="select"><option>Last 30 days</option><option>Last 7 days</option><option>All time</option></select><select className="select"><option>All agents</option>{demoAgents.map((agent) => <option key={agent.name}>{agent.name}</option>)}</select><select className="select"><option>All categories</option><option>Research</option><option>Reasoning</option><option>Tool use</option></select></div>
      <div className="grid stats">{renderStat('Runs completed', '128', <CheckCircle2 size={18} />, 'Sample results')}{renderStat('Avg. accuracy', '89.4%', <Target size={18} />, '↑ 2.1%')}{renderStat('Avg. latency', '2.4 s', <Clock3 size={18} />, '↓ 0.3 s')}{renderStat('Failure rate', '7.2%', <TriangleAlert size={18} />, '↓ 1.8%')}</div>
      <div className="split">
        <section className="card canva-card"><div className="card-head"><h2>Success trend</h2></div><div className="mini">Weekly success rate · illustrative</div><div className="chart">{[68,72,70,77,75,82,79,84,86,83,90,93].map((v, i) => <div className="bar-wrap" key={i}><div className="bar" style={{ height: `${v}%` }} /><small>{i % 2 === 0 ? `W${i + 1}` : ''}</small></div>)}</div></section>
        <section className="card canva-card"><div className="card-head"><h2>Failure distribution</h2></div><div className="list">{[['Tool failures','41%',41],['Model failures','32%',32],['Instruction failures','18%',18],['Other','9%',9]].map(([label, value, width]) => <div className="list-item" style={{ display: 'block' }} key={label}><div className="row" style={{ justifyContent: 'space-between', marginBottom: 9 }}><strong>{label}</strong><span>{value}</span></div><div className="meter"><span style={{ width: `${width}%` }} /></div></div>)}</div></section>
      </div>
      <div style={{ marginTop: 17 }}><section className="card canva-card"><div className="card-head"><h2>Experiment summary</h2></div><div className="table-wrap"><table className="table"><thead><tr><th>Experiment</th><th>Agent</th><th>Category</th><th>Accuracy</th><th>Latency</th><th>Status</th></tr></thead><tbody><tr><td>RF-2048</td><td>Atlas Research</td><td>Research</td><td>94%</td><td>2.1 s</td><td><span className="badge">Passed</span></td></tr><tr><td>RF-2047</td><td>Nova Analyst</td><td>Reasoning</td><td>91%</td><td>2.3 s</td><td><span className="badge">Passed</span></td></tr><tr><td>RF-2046</td><td>Sage Assistant</td><td>Tool use</td><td>87%</td><td>1.8 s</td><td><span className="badge">Passed</span></td></tr><tr><td>RF-2045</td><td>Orion Workflow</td><td>Research</td><td>81%</td><td>2.9 s</td><td><span className="badge orange">Review</span></td></tr></tbody></table></div></section></div>
    </>
  );

  const trace = () => {
    const steps = [
      ['09:41:02', 'Task received', 'Input', 'Summarize three sources and cite supporting evidence.', 'Task accepted; source constraints verified.'],
      ['09:41:03', 'Model request', 'Model', 'Prompt: extract core claims and plan retrieval. Model: GPT-4o.', 'Plan: retrieve sources, compare claims, draft concise summary.'],
      ['09:41:05', 'Search sources', 'Tool call', 'search(query="agent evaluation patterns", depth="basic")', '3 relevant source excerpts returned.'],
      ['09:41:07', 'Tool retry', 'Retry', 'First source fetch timed out after 2.0 seconds.', 'Second attempt succeeded in 0.8 seconds.'],
      ['09:41:09', 'Draft response', 'Output', 'Context: three retrieved excerpts and task rubric.', 'A structured summary with two citations was produced.'],
      ['09:41:10', 'Score response', 'Evaluation', 'Rubric: accuracy, citation relevance, completeness.', 'Accuracy 94/100 · Success: passed.'],
    ];

    return (
      <>
        {heading('Execution Trace Viewer', 'Follow the journey from task input to scored response.', (
          <button className="btn" type="button" onClick={() => setPage('Results & Analytics')}>
            <ArrowLeft size={15} /> Back to results
          </button>
        ))}
        <div className="split">
          <section className="card canva-card"><div className="card-head"><h2>RF-2048 · Research synthesis</h2><span className="badge">Completed</span></div><div className="notice">Demonstration trace. Expand any step to inspect its sample input and output.</div><div style={{ padding: '15px 10px' }}>{steps.map((step, index) => <div className="trace-step" key={step[1]}><details open={index === 0}><summary>{step[1]} <span className="mini"> · {step[0]} · {step[2]}</span></summary><p><strong>Input</strong></p><pre>{step[3]}</pre><p><strong>Output</strong></p><pre>{step[4]}</pre></details></div>)}</div></section>
          <div><section className="card canva-card"><div className="card-head"><h2>Run details</h2></div><div className="list">{[['Agent', 'Atlas Research'], ['Model', 'GPT-4o'], ['Duration', '8.4 seconds'], ['Tokens', '2,840'], ['Tool calls', '3'], ['Retries', '1'], ['Estimated cost', '$0.12']].map(([label, value]) => <div className="list-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section><div style={{ height: 17 }} /><section className="card canva-card"><div className="card-head"><h2>What to notice</h2></div><div className="insight"><strong>Recovered from a timeout</strong><p>The source fetch succeeded on retry, so the final answer could be evaluated.</p></div><div className="insight"><strong>Citation opportunity</strong><p>Adding one more citation may improve evidence coverage in future runs.</p></div></section></div>
        </div>
      </>
    );
  };

  const pastReports = () => (
    <>
      {heading('Past Reports', 'Every sample run, organized for easy review.', (
        <button className="btn" type="button">Compare history</button>
      ))}
      <div className="toolbar"><input className="input" placeholder="Search reports or IDs" value={reportFilter} onChange={(e) => setReportFilter(e.target.value)} /><select className="select"><option>All categories</option><option>Research</option><option>Tool use</option><option>Reasoning</option></select></div>
      <section className="card canva-card"><div className="card-head"><h2>Report history</h2></div>{reports.filter((report) => `${report.id} ${report.title} ${report.agents} ${report.winner} ${report.category}`.toLowerCase().includes(reportFilter.toLowerCase())).length ? <div className="table-wrap"><table className="table"><thead><tr><th>Report ID</th><th>Report</th><th>Agents</th><th>Date</th><th>Winner</th><th>Actions</th></tr></thead><tbody>{reports.filter((report) => `${report.id} ${report.title} ${report.agents} ${report.winner} ${report.category}`.toLowerCase().includes(reportFilter.toLowerCase())).map((report) => <tr key={report.id}><td><strong>{report.id}</strong></td><td>{report.title}<div className="mini">{report.category}</div></td><td>{report.agents}</td><td>{report.date}</td><td><span className="badge purple">{report.winner}</span></td><td><button className="btn" type="button" onClick={() => setPage('Execution Trace Viewer')}>View</button></td></tr>)}</tbody></table></div> : <div className="empty">No matching reports.</div>}</section>
    </>
  );

  const leaderboardView = () => {
    const sorted = [...demoAgents].sort((a, b) => (sortMetric === 'errors' ? a.errors - b.errors : (b as any)[sortMetric] - (a as any)[sortMetric]));
    return (
      <>
        {heading('Leaderboard', 'A quick read on which agents lead each sample metric.')}
        <div className="toolbar"><label className="row" htmlFor="leader-sort"><strong>Sort by</strong><select id="leader-sort" className="select" value={sortMetric} onChange={(e) => setSortMetric(e.target.value)}>{Object.entries(metricNames).map(([key, label]) => <option key={key} value={key}>{label}</option>)}<option value="score">Overall score</option></select></label></div>
        <section className="card canva-card"><div className="card-head"><h2>Agent rankings</h2></div><div className="table-wrap"><table className="table"><thead><tr><th>Rank</th><th>Agent</th><th>Framework</th><th>Model</th><th>Success</th><th>Accuracy</th><th>Score</th></tr></thead><tbody>{sorted.map((agent, index) => <tr key={agent.name}><td><strong>{index === 0 ? '🏆 ' : ''}#{index + 1}</strong></td><td><strong>{agent.name}</strong></td><td>{agent.framework}</td><td>{agent.model}</td><td>{agent.success}%</td><td>{agent.accuracy}%</td><td><span className="badge purple">{agent.score} / 100</span></td></tr>)}</tbody></table></div></section>
        <p className="mini" style={{ marginTop: 14 }}>User-added agents receive placeholder sample metrics until a real evaluation service is connected.</p>
      </>
    );
  };

  const failure = () => (
    <>
      {heading('Failure Center', 'Find patterns, inspect recovery, and prioritize fixes.')}
      <div className="grid stats">{renderStat('Total failures', '23', <TriangleAlert size={18} />, 'Sample period')}{renderStat('Tool failures', '10', <Wrench size={18} />, 'Most common type')}{renderStat('Recovered', '16', <RotateCcw size={18} />, '69.6% recovered')}{renderStat('Unresolved', '07', <CircleX size={18} />, 'Needs attention')}</div>
      <div className="split"><section className="card canva-card"><div className="card-head"><h2>Failure breakdown</h2></div><div className="list">{[['Tool timeout','10 cases','Retry with backoff','orange'],['Model response','7 cases','Clarify output schema','red'],['Instruction mismatch','4 cases','Revise rubric','purple'],['Other','2 cases','Inspect traces','purple']].map(([label, value, note, tone]) => <div className="list-item" key={label}><div><strong>{label}</strong><small>{note}</small></div><span className={`badge ${tone}`}>{value}</span></div>)}</div></section><section className="card canva-card"><div className="card-head"><h2>Recovery analysis</h2></div><div className="score-card"><span className="mini">Recovered after retry</span><div className="score-num">69.6%</div><p className="sub">16 of 23 sample failures resolved without intervention.</p></div><div className="insight"><strong>Suggested next step</strong><p>Review tool timeout traces first. They account for the largest share of failures and often have a clear retry path.</p></div><button className="btn" type="button" onClick={() => setPage('Execution Trace Viewer')}>Inspect example trace <ArrowRight size={15} /></button></section></div>
    </>
  );

  const insights = () => (
    <>
      {heading('AI Insights', 'Evidence-led observations, in plain language.')}
      <div className="notice">These insights are illustrative interpretations of the sample metrics, not output from a live AI service.</div>
      <div className="thirds">{[['sparkles','Why Atlas leads','Atlas achieves 94% accuracy and 96% success across the sample tasks. Its strongest edge is consistent research synthesis.','Try harder source-conflict tasks to validate this advantage.'],['gauge','Where Nova excels','Nova responds faster in the sample set (89/100 speed versus Atlas at 82/100) while retaining strong accuracy.','Consider Nova when latency is more important than a small accuracy difference.'],['shield-check','Recovery matters','The sample trace shows a successful retry after a tool timeout, preserving the final result.','Add varied timeout conditions to test reliability under pressure.']].map(([iconName, title, text, action]) => <article className="card canva-card" key={title}><div className="stat-icon">{iconName === 'sparkles' ? <Sparkles size={18} /> : iconName === 'gauge' ? <Gauge size={18} /> : <ShieldCheck size={18} />}</div><h2>{title}</h2><p className="sub" style={{ margin: '13px 0' }}>{text}</p><div className="insight"><strong>Improvement to test</strong><p>{action}</p></div></article>)}</div>
      <div style={{ marginTop: 17 }}><section className="card canva-card"><div className="card-head"><h2>Evidence at a glance</h2></div><div className="table-wrap"><table className="table"><thead><tr><th>Observation</th><th>Evidence</th><th>Next action</th></tr></thead><tbody><tr><td>Atlas accuracy lead</td><td>94 vs 91 for Nova</td><td>Test more source types</td></tr><tr><td>Nova speed advantage</td><td>89 vs 82 for Atlas</td><td>Measure latency in production</td></tr><tr><td>Tool timeout recovery</td><td>Retry succeeded in trace</td><td>Stress-test retry policy</td></tr></tbody></table></div></section></div>
    </>
  );

  const alertsView = () => (
    <>
      {heading('Alerts', 'Keep important changes visible without the noise.')}
      <section className="card canva-card"><div className="card-head"><h2>Recent sample alerts</h2></div><div className="list">{[['Success rate dip','Orion Workflow fell below an 80% sample success threshold.','Today, 9:42 AM','red'],['Tool errors increased','Tool timeout failures rose in the latest sample batch.','Yesterday, 2:18 PM','orange'],['Token usage rising','Average tokens per run increased by 14% in the sample period.','May 18, 2025','purple'],['Cost threshold approaching','Estimated spend is approaching the sample $50 threshold.','May 17, 2025','orange']].map(([title, detail, time, tone]) => <div className="list-item" key={title}><div><strong><span className={`dot ${tone === 'red' ? 'red' : 'warn'}`} />{title}</strong><small>{detail}</small></div><span className="mini">{time}</span></div>)}</div></section>
      <div style={{ marginTop: 17 }}><section className="card canva-card"><div className="card-head"><h2>Alert preferences</h2></div><div className="settings-row"><div><strong>Success rate and errors</strong><p>Show sample alerts when reliability changes.</p></div><input className="toggle" type="checkbox" defaultChecked /></div><div className="settings-row"><div><strong>Token usage and cost</strong><p>Show sample alerts for usage changes.</p></div><input className="toggle" type="checkbox" defaultChecked /></div></section></div>
    </>
  );

  const settingsView = () => (
    <>
      {heading('Settings', 'A few thoughtful controls for your demonstration workspace.')}
      <div className="split"><div><section className="card canva-card"><div className="card-head"><h2>Profile</h2></div><div className="settings-row"><div><strong>Workspace name</strong><p>RapidFire Demo</p></div><span className="badge purple">Public demo</span></div><div className="settings-row"><div><strong>Data</strong><p>Agent profiles you add are saved in a Canva Sheet.</p></div></div></section><div style={{ height: 17 }} /><section className="card canva-card"><div className="card-head"><h2>Connections</h2></div><div className="settings-row"><div><strong>Bifrost</strong><p>Not connected in this demonstration.</p></div><span className="badge orange">Demo only</span></div><div className="settings-row"><div><strong>Tavily</strong><p>Search uses a local sample result set.</p></div><span className="badge purple">Sample mode</span></div><p className="mini">Secure service integrations must be configured outside this sandbox. Do not enter credentials here.</p></section></div><div><section className="card canva-card"><div className="card-head"><h2>Security</h2></div><div className="settings-row"><div><strong>Authentication</strong><p>This public demo does not include sign-in or account access.</p></div><span className="badge orange">Unavailable</span></div><div className="settings-row"><div><strong>External navigation</strong><p>Source links open in a new tab.</p></div><span className="badge">Enabled</span></div></section><div style={{ height: 17 }} /><section className="card canva-card"><div className="card-head"><h2>Notifications</h2></div><div className="settings-row"><div><strong>In-app alerts</strong><p>Display sample alert indicators.</p></div><input className="toggle" type="checkbox" defaultChecked /></div><div className="settings-row"><div><strong>Weekly summary</strong><p>Visual preference only; no email is sent.</p></div><input className="toggle" type="checkbox" /></div></section></div></div>
    </>
  );

  const renderPage = () => {
    switch (page) {
      case 'Agent Management': return agentsView();
      case 'Compare Agents': return compare();
      case 'Benchmark Lab': return benchmark();
      case 'Tavily Search': return tavily();
      case 'Results & Analytics': return results();
      case 'Execution Trace Viewer': return trace();
      case 'Past Reports': return pastReports();
      case 'Leaderboard': return leaderboardView();
      case 'Failure Center': return failure();
      case 'AI Insights': return insights();
      case 'Alerts': return alertsView();
      case 'Settings': return settingsView();
      default: return overview();
    }
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand"><span className="brandmark"><Flame size={18} /></span>RapidFire</div>
        <div className="side-label">Workspace</div>
        <nav className="nav" aria-label="Sections">
          {navItems.map(([label, icon]) => (
            <button type="button" key={label} className={`nav-button ${page === label ? 'active' : ''}`} onClick={() => { setPage(label); setSidebarOpen(false); }}>
              {icon === 'layout-dashboard' ? <LayoutDashboard size={17} /> : icon === 'bot' ? <Bot size={17} /> : icon === 'git-compare-arrows' ? <GitCompareArrows size={17} /> : icon === 'flask-conical' ? <FlaskConical size={17} /> : icon === 'search' ? <Search size={17} /> : icon === 'chart-no-axes-combined' ? <ChartNoAxesCombined size={17} /> : icon === 'files' ? <Files size={17} /> : icon === 'trophy' ? <Trophy size={17} /> : icon === 'shield-alert' ? <ShieldAlert size={17} /> : icon === 'sparkles' ? <Sparkles size={17} /> : icon === 'bell' ? <Bell size={17} /> : <Settings size={17} />}
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="side-bottom"><div className="profile"><div className="avatar">RF</div><div><strong>Demo workspace</strong><small>Sample environment</small></div></div><button type="button" className="side-action" onClick={() => setModal({ title: 'About this demo', content: 'RapidFire is a public interactive demonstration. Its benchmark results, reports, search results, and connection checks are illustrative. No sign-in or live AI service is connected.' })}><LogOut size={15} /> About this demo</button></div>
      </aside>
      <div className={`drawer-backdrop ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className="workspace">
        <header className="topbar">
          <div className="top-left"><button type="button" className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={18} /></button><span className="crumb">Workspace / <strong>{page}</strong></span></div>
          <div className="top-actions"><span className="demo-pill">✦ Demonstration data</span><button type="button" aria-label="View alerts" onClick={() => setPage('Alerts')}><Bell size={18} /></button><div className="avatar" aria-label="Demo profile">RF</div></div>
        </header>
        <main className="content">{renderPage()}</main>
      </div>
      {modal ? <div className="overlay show" role="presentation" onClick={(e) => e.target === e.currentTarget && setModal(null)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">{modal.title}</h2><p className="sub">{modal.content}</p><div className="row" style={{ justifyContent: 'flex-end', marginTop: 20 }}><button type="button" className="btn primary" onClick={() => setModal(null)}>Got it</button></div></div></div> : null}
    </div>
  );
}

export default App;
