
import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const statusColors = {
    online: 'bg-emerald-500',
    building: 'bg-amber-500 animate-pulse',
    failed: 'bg-rose-500',
    idle: 'bg-slate-500',
  };

  return (
    <div 
      onClick={() => onClick(project)}
      className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700">
            <img 
              src={`https://api.dicebear.com/7.x/identicon/svg?seed=${project.name}`} 
              alt={project.name} 
              className="w-8 h-8 opacity-80"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-slate-500">{project.repo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-700">
          <div className={`w-2 h-2 rounded-full ${statusColors[project.status]}`}></div>
          <span className="text-xs font-medium text-slate-300 capitalize">{project.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Traffic (24h)</p>
          <p className="text-sm font-semibold text-white">{(project.traffic / 1000).toFixed(1)}k visits</p>
        </div>
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Framework</p>
          <p className="text-sm font-semibold text-white capitalize">{project.framework}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center">
        <span className="text-xs text-slate-500">Last build {project.lastDeployed}</span>
        <button className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1">
          View Logs
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
