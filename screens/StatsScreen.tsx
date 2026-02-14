
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Apr 01', score: 65 },
  { name: 'Apr 05', score: 72 },
  { name: 'Apr 10', score: 68 },
  { name: 'Apr 15', score: 78 },
  { name: 'Apr 20', score: 75 },
  { name: 'Apr 25', score: 85 },
];

const StatsScreen: React.FC = () => {
  return (
    <div className="p-6 pt-12 space-y-6">
      <header className="flex justify-between items-center">
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
          <span className="material-icons-round text-slate-400">chevron_left</span>
        </button>
        <h1 className="text-lg font-bold">Recovery Rate</h1>
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#13ec5b]">
          <span className="material-icons-round">share</span>
        </button>
      </header>

      <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-pink-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-icons-round text-rose-400">auto_awesome</span>
          <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">Monica AI Insights</p>
        </div>
        <p className="text-sm text-pink-700 leading-relaxed">
          Your skin barrier is healing 12% faster this week. The new evening serum is significantly reducing redness around your cheeks.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 flex flex-col items-center shadow-sm border border-slate-50">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="45%" stroke="#f1f5f9" strokeWidth="12" fill="none" />
            <circle cx="50%" cy="50%" r="45%" stroke="#13ec5b" strokeWidth="12" fill="none" strokeDasharray="1000" strokeDashoffset="750" strokeLinecap="round" />
          </svg>
          <div className="text-center">
            <p className="text-5xl font-bold tracking-tighter">85</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Score</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-12 w-full mt-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#13ec5b]">+8%</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">vs Last Month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">Peak</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Recovery State</p>
          </div>
        </div>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-xl">
        {['7D', '30D', '90D', '1Y'].map((t) => (
          <button key={t} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${t === '30D' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}>{t}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold">Improvement Trend</h3>
          <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-500 rounded-full uppercase">Consistent</span>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#13ec5b" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#13ec5b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <Area type="monotone" dataKey="score" stroke="#13ec5b" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-2 px-1">
          <p className="text-[9px] font-bold text-slate-300">APR 01</p>
          <p className="text-[9px] font-bold text-slate-300">APR 15</p>
          <p className="text-[9px] font-bold text-slate-300">TODAY</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: 'opacity', label: 'Hydration', val: '92%', trend: '↑ 5%', color: 'blue' },
          { icon: 'face', label: 'Texture', val: '78%', trend: '↑ 12%', color: 'emerald' },
          { icon: 'wb_sunny', label: 'UV Resistance', val: '64%', trend: 'Stable', color: 'amber' },
          { icon: 'shield', label: 'Redness', val: 'Good', trend: '↑ 2%', color: 'blue' },
        ].map((m, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-50 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className={`material-icons-round text-sm text-${m.color}-400`}>{m.icon}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-xl font-bold">{m.val}</p>
              <p className={`text-[9px] font-bold ${m.trend === 'Stable' ? 'text-slate-300' : 'text-[#13ec5b]'}`}>{m.trend}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsScreen;
