
import React, { useState } from 'react';
import { RoutineStep } from '../types';

interface RoutineScreenProps {
  steps: RoutineStep[];
  onToggle: (id: string) => void;
}

const RoutineScreen: React.FC<RoutineScreenProps> = ({ steps, onToggle }) => {
  const [activeTab, setActiveTab] = useState<'AM' | 'PM'>('AM');

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="p-6 pt-4 space-y-6">
      <header className="flex justify-between items-center">
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-95 transition-all">
          <span className="material-icons-round text-slate-400">arrow_back_ios_new</span>
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-slate-800">Daily Routine</h1>
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#13ec5b] rounded-full animate-pulse"></span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">AI Optimized</span>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm active:scale-95 transition-all">
          <span className="material-icons-round text-slate-400">more_horiz</span>
        </button>
      </header>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Morning Progress</p>
          <p className="text-sm font-bold text-[#13ec5b]">{progressPercent}%</p>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="bg-[#13ec5b] h-full rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-2xl">
        <button
          onClick={() => setActiveTab('AM')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${activeTab === 'AM' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}
        >
          <span className="material-icons-round text-sm">wb_sunny</span> AM
        </button>
        <button
          onClick={() => setActiveTab('PM')}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${activeTab === 'PM' ? 'bg-white shadow-md text-slate-900' : 'text-slate-400'}`}
        >
          <span className="material-icons-round text-sm">dark_mode</span> PM
        </button>
      </div>

      <div className="space-y-4">
        {steps.map((s) => (
          <div 
            key={s.id} 
            onClick={() => onToggle(s.id)}
            className={`glass-card p-4 rounded-3xl flex items-center gap-4 border-l-4 transition-all active:scale-[0.98] cursor-pointer ${s.completed ? 'border-l-[#13ec5b] bg-[#13ec5b]/5 opacity-80' : 'border-l-slate-200'}`}
          >
            <div className="w-14 h-14 bg-slate-50 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 border border-slate-100">
              <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${s.completed ? 'bg-[#13ec5b] text-white' : 'bg-slate-100 text-slate-500'}`}>
                  Step {s.step}
                </span>
                {s.isAiPick && <span className="text-[9px] font-bold px-2 py-0.5 bg-rose-50 text-rose-500 rounded-full uppercase tracking-tighter">AI Pick</span>}
              </div>
              <h3 className={`text-sm font-bold leading-tight ${s.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{s.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{s.description}</p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${s.completed ? 'bg-[#13ec5b] border-[#13ec5b] shadow-lg shadow-[#13ec5b]/30' : 'border-slate-200 bg-white'}`}>
              {s.completed && <span className="material-icons-round text-white text-lg">check</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-5 text-white flex gap-4 shadow-2xl relative overflow-hidden group">
        <div className="p-3 bg-[#13ec5b]/10 rounded-2xl h-fit">
          <span className="material-icons-round text-[#13ec5b] text-2xl">psychology</span>
        </div>
        <div className="flex-1 relative z-10">
          <p className="text-[10px] font-bold text-[#13ec5b] uppercase tracking-widest mb-1.5">Monica's Expert Tip</p>
          <p className="text-[11px] leading-relaxed opacity-80 font-medium italic">"Based on current UV index and your scan, don't skip the SPF. Reapply every 4 hours if you're outdoors today."</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
           <span className="material-icons-round text-9xl">tips_and_updates</span>
        </div>
      </div>
    </div>
  );
};

export default RoutineScreen;
