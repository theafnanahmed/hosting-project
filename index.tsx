
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

// --- Interfaces & Types ---
interface Project {
  id: string;
  name: string;
  repo: string;
  status: 'online' | 'building' | 'failed' | 'idle';
  url: string;
  lastDeployed: string;
  framework: 'react' | 'nextjs' | 'vue' | 'static';
  traffic: number;
}

interface AIAdvice {
  title: string;
  content: string;
  impact: 'high' | 'medium' | 'low';
}

// --- AI Service Logic ---
const getAIDeploymentAdvice = async (projectName: string, framework: string) => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

  // If no API key, return fallback advice immediately
  if (!apiKey) {
    return [
      { title: "Enable HTTP/3", content: "Switch to HTTP/3 to reduce latency for mobile users.", impact: "high" },
      { title: "Static Optimization", content: "Use server-side rendering for critical landing pages.", impact: "medium" },
      { title: "Gzip Compression", content: "Ensure all assets are gzipped to save bandwidth costs.", impact: "high" }
    ];
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Provide 3 expert deployment and performance tips for a ${framework} project named ${projectName}. Focus on speed, cost, and security.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ['high', 'medium', 'low'] }
            },
            required: ["title", "content", "impact"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      { title: "Enable HTTP/3", content: "Switch to HTTP/3 to reduce latency for mobile users.", impact: "high" },
      { title: "Static Optimization", content: "Use server-side rendering for critical landing pages.", impact: "medium" },
      { title: "Gzip Compression", content: "Ensure all assets are gzipped to save bandwidth costs.", impact: "high" }
    ];
  }
};

// --- Sub-Components ---

const Sidebar: React.FC<{ activeTab: string, setActiveTab: (t: string) => void }> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'projects', label: 'Projects', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    { id: 'deployments', label: 'Deployments', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'ai-tools', label: 'AI Optimizer', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">NovaDeploy</span>
        </div>
      </div>
      <nav className="flex-1 px-4 mt-2 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-200 ${activeTab === item.id
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-6">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-3 tracking-widest">System Load</p>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[35%] animate-pulse"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const BuildLogs: React.FC<{ mode: 'git' | 'manual' }> = ({ mode }) => {
  const [logs, setLogs] = useState<{ time: string, msg: string, type: string }[]>([]);

  useEffect(() => {
    const gitLogs = [
      { time: '14:20:01', msg: 'Cloning repository from GitHub...', type: 'info' },
      { time: '14:20:05', msg: 'Validating workflow configuration...', type: 'info' },
      { time: '14:20:08', msg: 'Installing dependencies (cached)...', type: 'info' },
      { time: '14:20:15', msg: 'Generating static optimized chunks...', type: 'info' },
      { time: '14:20:25', msg: 'Build completed. Bundle: 1.4 MB', type: 'success' },
      { time: '14:20:30', msg: 'Deploying to edge nodes (24 regions)...', type: 'info' },
    ];
    setLogs([]);
    gitLogs.forEach((log, i) => {
      setTimeout(() => setLogs(prev => [...prev, log]), i * 1200);
    });
  }, [mode]);

  return (
    <div className="space-y-1.5 font-mono text-xs">
      {logs.map((log, i) => (
        <div key={i} className="flex gap-4 animate-in fade-in slide-in-from-left duration-300">
          <span className="text-slate-600 shrink-0">[{log.time}]</span>
          <span className={log.type === 'info' ? 'text-slate-400' : log.type === 'success' ? 'text-indigo-400 font-bold' : 'text-rose-400'}>
            {log.msg}
          </span>
        </div>
      ))}
      {logs.length < 6 && (
        <div className="flex gap-1.5 items-center mt-3">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'main-portfolio', repo: 'github.com/user/portfolio', status: 'online', url: 'portfolio.nova.app', lastDeployed: '1h ago', framework: 'nextjs', traffic: 15400 },
    { id: '2', name: 'saas-landing', repo: 'github.com/user/saas-app', status: 'online', url: 'saas-prod.nova.app', lastDeployed: '5h ago', framework: 'react', traffic: 8200 },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [advice, setAdvice] = useState<AIAdvice[]>([]);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const handleCreateProject = () => {
    const p: Project = {
      id: Date.now().toString(),
      name: newProjectName || 'new-service',
      repo: 'github.com/user/repository',
      status: 'building',
      url: `${newProjectName}.nova.app`,
      lastDeployed: 'Just now',
      framework: 'react',
      traffic: 0
    };
    setProjects([p, ...projects]);
    setIsModalOpen(false);
    setActiveTab('deployments');
    setTimeout(() => {
      setProjects(prev => prev.map(item => item.id === p.id ? { ...item, status: 'online' } : item));
    }, 10000);
  };

  useEffect(() => {
    if (activeTab === 'ai-tools' && advice.length === 0) {
      setLoadingAdvice(true);
      getAIDeploymentAdvice(projects[0].name, projects[0].framework).then(res => {
        setAdvice(res);
        setLoadingAdvice(false);
      });
    }
  }, [activeTab]);

  const analyticsData = [
    { name: 'Mon', val: 4000 },
    { name: 'Tue', val: 3000 },
    { name: 'Wed', val: 5500 },
    { name: 'Thu', val: 2780 },
    { name: 'Fri', val: 1890 },
    { name: 'Sat', val: 2390 },
    { name: 'Sun', val: 3490 },
  ];

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 ml-64 p-10">
        <div className="max-w-6xl mx-auto">

          {/* Projects View */}
          {activeTab === 'projects' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">Infrastructure</h1>
                  <p className="text-slate-500 mt-1 font-medium">Monitoring your cloud assets across 4 regions.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                >
                  Create Deployment
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(p => (
                  <div key={p.id} className="glass rounded-[2rem] p-7 group hover:border-indigo-500/50 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 shadow-inner">
                        <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${p.name}`} className="w-9 h-9 opacity-80" />
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${p.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        {p.status}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{p.name}</h3>
                    <p className="text-sm text-slate-500 font-mono mb-6">{p.repo}</p>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                      <div>
                        <p className="text-[10px] text-slate-600 uppercase font-black">Framework</p>
                        <p className="text-sm font-bold text-slate-300 capitalize">{p.framework}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-600 uppercase font-black">Daily Load</p>
                        <p className="text-sm font-bold text-slate-300">{(p.traffic / 1000).toFixed(1)}k</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deployments View */}
          {activeTab === 'deployments' && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
              <h2 className="text-2xl font-bold text-white">CI/CD Pipeline</h2>
              <div className="glass rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                    <span className="font-mono text-sm font-bold text-slate-300">BUILD_SESSION_ID: 9821X-JK</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">NODE_ENV: production</div>
                </div>
                <div className="p-8 bg-black/40 min-h-[450px]">
                  <BuildLogs mode="git" />
                </div>
              </div>
            </div>
          )}

          {/* Analytics View */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-[2.5rem]">
                  <h3 className="text-xl font-bold text-white mb-8">Requests per Day</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData}>
                        <defs>
                          <linearGradient id="col" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#475569" axisLine={false} tickLine={false} fontSize={12} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={3} fill="url(#col)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="glass p-8 rounded-[2.5rem]">
                  <h3 className="text-xl font-bold text-white mb-8">Edge Performance</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData}>
                        <XAxis dataKey="name" stroke="#475569" axisLine={false} tickLine={false} fontSize={12} />
                        <Bar dataKey="val" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Optimizer View */}
          {activeTab === 'ai-tools' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-10 rounded-[2.5rem] border border-indigo-500/20">
                <h2 className="text-3xl font-black text-white mb-3">AI Cluster Optimization</h2>
                <p className="text-slate-400 font-medium">Gemini AI is analyzing your infrastructure for 24 cost-saving & performance opportunities.</p>
              </div>

              {loadingAdvice ? (
                <div className="flex justify-center py-20">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {advice.map((item, i) => (
                    <div key={i} className="glass p-8 rounded-[2.5rem] relative overflow-hidden group">
                      <div className={`absolute top-0 right-0 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${item.impact === 'high' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                        {item.impact} IMPACT
                      </div>
                      <h4 className="text-lg font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed mb-8">{item.content}</p>
                      <button className="w-full py-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold hover:border-indigo-500/50 transition-all active:scale-95">
                        Apply Fix
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal for New Project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/95 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="glass w-full max-w-lg rounded-[3rem] p-10 shadow-3xl">
            <h2 className="text-2xl font-black text-white mb-6">Deploy New Service</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">Service Alias</label>
                <input
                  type="text" value={newProjectName} onChange={e => setNewProjectName(e.target.value)}
                  placeholder="e.g. core-api-v2" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Region</p>
                  <p className="font-bold text-slate-200">US-EAST-1</p>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Runtime</p>
                  <p className="font-bold text-slate-200">Node.js 20.x</p>
                </div>
              </div>
              <button
                onClick={handleCreateProject}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-indigo-600/20 mt-4 transition-all active:scale-95"
              >
                Launch Cluster
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full text-slate-500 text-sm font-bold mt-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
