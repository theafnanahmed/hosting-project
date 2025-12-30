
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';

const data = [
  { name: '00:00', req: 4000, latency: 240 },
  { name: '04:00', req: 3000, latency: 198 },
  { name: '08:00', req: 2000, latency: 210 },
  { name: '12:00', req: 2780, latency: 250 },
  { name: '16:00', req: 1890, latency: 220 },
  { name: '20:00', req: 2390, latency: 310 },
  { name: '23:59', req: 3490, latency: 280 },
];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Requests per Minute</h3>
            <span className="text-xs text-emerald-400 font-medium bg-emerald-400/10 px-2 py-1 rounded">+12.5%</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="req" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorReq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Latency (ms)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="latency" radius={[4, 4, 0, 0]}>
                   {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.latency > 250 ? '#f43f5e' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: '1.2M', sub: '+12% from last month', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
          { label: 'Avg Latency', value: '24ms', sub: '-5ms faster', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Error Rate', value: '0.04%', sub: 'Healthy status', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
          { label: 'Uptime', value: '99.99%', sub: 'Last 30 days', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
               <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                 </svg>
               </div>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase">{stat.label}</p>
            <h4 className="text-2xl font-bold text-white mt-1">{stat.value}</h4>
            <p className="text-[10px] text-slate-400 mt-2">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
