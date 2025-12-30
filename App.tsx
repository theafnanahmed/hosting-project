import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ProjectCard from './components/ProjectCard';
import Analytics from './components/Analytics';
import AIOptimizer from './components/AIOptimizer';
import { Project } from './types';

const INITIAL_PROJECTS: Project[] = [
  { id: '1', name: 'store-front-v2', repo: 'github.com/user/store-front', status: 'online', url: 'store-v2.nova.app', lastDeployed: '2h ago', framework: 'nextjs', traffic: 12400 },
  { id: '2', name: 'admin-dashboard', repo: 'github.com/user/admin-panel', status: 'online', url: 'admin.nova.app', lastDeployed: '12m ago', framework: 'react', traffic: 3200 },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deployMode, setDeployMode] = useState<'git' | 'manual'>('git');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectRepo, setNewProjectRepo] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDeploy = (name: string, repo: string, framework: Project['framework']) => {
    const newProj: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'unnamed-project',
      repo: repo || 'manual-upload',
      status: 'building',
      url: `${name || 'project'}.nova.app`,
      lastDeployed: 'Just now',
      framework: framework,
      traffic: 0
    };

    setProjects([newProj, ...projects]);
    setIsModalOpen(false);
    setActiveTab('deployments');
    setIsDeploying(true);

    // Simulate build completion
    setTimeout(() => {
      setProjects(prev => prev.map(p => p.id === newProj.id ? { ...p, status: 'online' } : p));
      setIsDeploying(false);
    }, 10000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Your Projects</h1>
                <p className="text-slate-400 text-sm mt-1">Manage and monitor your cloud deployments.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(p => (
                <ProjectCard key={p.id} project={p} onClick={() => setActiveTab('deployments')} />
              ))}
            </div>
          </div>
        );
      case 'deployments':
        const latestProject = projects[0];
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 backdrop-blur-md">
                <div>
                  <h2 className="text-xl font-bold text-white">Latest Activity: {latestProject?.name}</h2>
                  <p className="text-xs text-slate-500 mt-1">Ref: {latestProject?.repo}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                  latestProject?.status === 'building' 
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' 
                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}>
                  {latestProject?.status === 'building' ? 'BUILDING...' : 'LIVE'}
                </span>
              </div>
              <div className="bg-slate-950 p-6 font-mono text-xs overflow-y-auto max-h-[500px] leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
                {(latestProject?.status === 'building' || isDeploying) ? (
                  <BuildLogs mode={latestProject?.repo === 'manual-upload' ? 'manual' : 'git'} />
                ) : (
                  <div className="text-slate-500 italic py-10 text-center">
                    Select a project to view historical build logs or start a new deployment.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return <Analytics />;
      case 'ai-tools':
        return <AIOptimizer projects={projects} />;
      default:
        return <div className="text-center py-20 text-slate-500 italic">Module under construction...</div>;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 transition-all">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-900">
           <div className="flex items-center gap-4">
             <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
               <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
             </div>
             <input 
              type="text" 
              placeholder="Search projects..." 
              className="bg-transparent border-none text-slate-300 text-sm focus:ring-0 outline-none w-64"
             />
           </div>
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 px-3 py-1 bg-indigo-600/10 rounded-lg text-indigo-400 text-xs font-bold border border-indigo-600/20">
               <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
               SYSTEM ONLINE
             </div>
             <div className="w-10 h-10 rounded-full border-2 border-slate-800 p-0.5 overflow-hidden ring-2 ring-indigo-500/20">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full rounded-full object-cover bg-slate-800" />
             </div>
           </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Dynamic Deployment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-[2.5rem] p-10 shadow-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -z-10"></div>
            
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Deploy Project</h2>
                <p className="text-slate-400 text-sm mt-1">Choose your preferred deployment method.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-2xl mb-8 border border-slate-800">
              <button 
                onClick={() => setDeployMode('git')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${deployMode === 'git' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                Modern CI/CD
              </button>
              <button 
                onClick={() => setDeployMode('manual')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${deployMode === 'manual' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                Drag & Drop
              </button>
            </div>
            
            <div className="space-y-6">
              {deployMode === 'git' ? (
                <>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Project Name</label>
                    <input 
                      type="text" 
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="e.g. awesome-react-app" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Repository URL</label>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={newProjectRepo}
                        onChange={(e) => setNewProjectRepo(e.target.value)}
                        placeholder="https://github.com/user/repo" 
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); alert("Build folder detected! Files scanned."); }}
                  className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer ${dragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 bg-slate-950 hover:bg-slate-900'}`}
                >
                  <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-800 shadow-inner">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg">Drop your build folder</h3>
                  <p className="text-slate-500 text-sm mt-2">Upload your `dist` or `build` folder directly.</p>
                  <div className="mt-6">
                    <label className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                      Select Files
                      {/* Fix: Property 'webkitdirectory' does not exist on type 'DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>' */}
                      <input 
                        type="file" 
                        className="hidden" 
                        {...({ webkitdirectory: '', directory: '' } as any)} 
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4">
                 <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-black uppercase">Region</p>
                    <p className="text-white font-bold mt-1">Global Edge (Nova)</p>
                 </div>
                 <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-black uppercase">Environment</p>
                    <p className="text-white font-bold mt-1">Production</p>
                 </div>
              </div>

              <button 
                onClick={() => handleDeploy(newProjectName, newProjectRepo, 'react')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-indigo-600/30 active:scale-[0.98]"
              >
                {deployMode === 'git' ? 'Deploy from GitHub' : 'Deploy Static Assets'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Component for Build Logs
const BuildLogs: React.FC<{ mode: 'git' | 'manual' }> = ({ mode }) => {
  const [logs, setLogs] = useState<{time: string, msg: string, type: string}[]>([]);
  
  const gitLogs = [
    { time: '14:20:01', msg: 'Cloning repository from GitHub...', type: 'info' },
    { time: '14:20:05', msg: 'Checking environment variables...', type: 'info' },
    { time: '14:20:08', msg: 'Running "npm install" (v18.x)...', type: 'info' },
    { time: '14:20:15', msg: 'Creating production optimized build...', type: 'info' },
    { time: '14:20:25', msg: 'Compiled successfully. Size: 1.2MB', type: 'success' },
    { time: '14:20:30', msg: 'Deploying to global edge network...', type: 'info' },
  ];

  const manualLogs = [
    { time: '14:20:01', msg: 'Receiving build artifacts...', type: 'info' },
    { time: '14:20:03', msg: 'Analyzing directory structure...', type: 'info' },
    { time: '14:20:05', msg: 'Checksum verification passed.', type: 'success' },
    { time: '14:20:07', msg: 'Compressing assets for CDN edge...', type: 'info' },
    { time: '14:20:10', msg: 'Propagating to 24 regions...', type: 'info' },
    { time: '14:20:12', msg: 'Deployment live!', type: 'success' },
  ];

  useEffect(() => {
    const sequence = mode === 'git' ? gitLogs : manualLogs;
    setLogs([]);
    sequence.forEach((log, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, i * 1500);
    });
  }, [mode]);

  return (
    <>
      {logs.map((log, i) => (
        <div key={i} className="mb-1 flex gap-4 animate-in slide-in-from-left duration-500">
          <span className="text-slate-600 shrink-0">[{log.time}]</span>
          <span className={
            log.type === 'info' ? 'text-slate-400' :
            log.type === 'success' ? 'text-indigo-400 font-bold' :
            log.type === 'warning' ? 'text-amber-400' : 'text-rose-400'
          }>
            {log.msg}
          </span>
        </div>
      ))}
      {logs.length < (mode === 'git' ? 6 : 6) && (
        <div className="flex gap-2 items-center mt-2">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      )}
    </>
  );
};

export default App;