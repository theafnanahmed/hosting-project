
import React, { useState, useEffect } from 'react';
import { getDeploymentAdvice } from '../services/geminiService';
import { Project, AIAdvice } from '../types';

interface AIOptimizerProps {
  projects: Project[];
}

const AIOptimizer: React.FC<AIOptimizerProps> = ({ projects }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [advice, setAdvice] = useState<AIAdvice[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return;

    setLoading(true);
    const results = await getDeploymentAdvice(project.name, project.framework);
    setAdvice(results);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedProjectId) {
      handleOptimize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Nova AI Optimizer
          </h2>
          <p className="text-slate-400 text-sm mt-1">Select a project to generate performance & security recommendations.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-slate-900 text-white border border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none flex-1 md:flex-none"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button 
            onClick={handleOptimize}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            Generate Advice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 h-64 rounded-2xl animate-pulse"></div>
          ))
        ) : advice.length > 0 ? (
          advice.map((item, index) => (
            <div key={index} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/80 transition-all relative overflow-hidden group">
              <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                item.impact === 'high' ? 'bg-rose-500/20 text-rose-400' :
                item.impact === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {item.impact} Impact
              </div>
              <h4 className="text-lg font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                {item.title}
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.content}
              </p>
              <button className="mt-6 w-full py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 hover:border-indigo-500/50 transition-all">
                Implement Suggestion
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-20 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
             <p className="text-slate-500">No advice generated yet. Click the button above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIOptimizer;
