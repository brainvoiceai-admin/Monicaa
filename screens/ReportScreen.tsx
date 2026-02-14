
import React from 'react';
import { DiagnosticResult } from '../geminiService';

interface ReportScreenProps {
  diagnosis: DiagnosticResult | null;
  onNavigateToRoutine: () => void;
}

const ReportScreen: React.FC<ReportScreenProps> = ({ diagnosis, onNavigateToRoutine }) => {
  if (!diagnosis) {
    return (
      <div className="p-10 h-full flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
           <span className="material-icons-round text-slate-300 dark:text-slate-600 text-4xl">biotech</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No Reports Yet</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500">Perform a diagnostic scan to see your detailed skin analysis here.</p>
      </div>
    );
  }

  const severityColor = {
    Low: 'bg-emerald-500',
    Moderate: 'bg-amber-500',
    High: 'bg-rose-500'
  }[diagnosis.severity];

  return (
    <div className="p-6 pt-4 space-y-6 pb-32">
      <header className="flex justify-between items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Clinical Report</p>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">{diagnosis.classification}</h1>
        </div>
        <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase text-white ${severityColor}`}>
          {diagnosis.severity} Severity
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
         {[
           { label: 'Inflamm.', val: diagnosis.metrics.inflammation, icon: 'whatshot' },
           { label: 'Hydration', val: diagnosis.metrics.hydration, icon: 'water_drop' },
           { label: 'Pigment.', val: diagnosis.metrics.pigmentation, icon: 'palette' }
         ].map((m, i) => (
           <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-50 dark:border-slate-700 shadow-sm flex flex-col items-center">
              <span className="material-icons-round text-slate-300 dark:text-slate-500 text-lg mb-2">{m.icon}</span>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter mb-1">{m.label}</p>
              <p className="text-xl font-black text-slate-800 dark:text-slate-100">{m.val}%</p>
           </div>
         ))}
      </div>

      {/* Dermatologist Insight */}
      <div className="bg-slate-900 dark:bg-slate-800 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
           <div className="w-12 h-12 rounded-2xl bg-[#13ec5b]/20 border border-[#13ec5b]/30 flex items-center justify-center">
              <span className="material-icons-round text-[#13ec5b] text-2xl">medical_services</span>
           </div>
           <div>
              <p className="text-[10px] font-bold text-[#13ec5b] uppercase tracking-widest">Personalized Insight</p>
              <p className="text-sm font-bold opacity-80">Clinical Summary</p>
           </div>
        </div>
        <p className="text-sm leading-relaxed text-slate-100 font-medium italic">
          "{diagnosis.dermatologistAdvice}"
        </p>
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#13ec5b]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Active Ingredients Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <span className="material-icons-round text-[#13ec5b] text-sm">science</span>
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Recommended Actives</h4>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {diagnosis.skincareIngredients.map((ing, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-[24px] border border-slate-100 dark:border-slate-700 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
                <span className="material-icons-round text-slate-400 dark:text-slate-500">opacity</span>
              </div>
              <div>
                <h5 className="text-sm font-black text-slate-800 dark:text-slate-100">{ing.name}</h5>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{ing.benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Home Remedies Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <span className="material-icons-round text-amber-500 text-sm">psychiatry</span>
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Natural Home Remedies</h4>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
          {diagnosis.homeRemedies.map((rem, i) => (
            <div key={i} className="min-w-[240px] bg-amber-50/50 dark:bg-amber-900/10 p-5 rounded-[28px] border border-amber-100/50 dark:border-amber-900/20">
              <h5 className="text-sm font-black text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                <span className="material-icons-round text-sm">spa</span> {rem.title}
              </h5>
              <p className="text-[11px] leading-relaxed text-amber-900/70 dark:text-amber-400/70 font-medium">
                {rem.instructions}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Next Steps</h4>
        {diagnosis.recommendations.map((rec, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all border border-slate-50 dark:border-slate-700">
             <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                <span className="material-icons-round text-emerald-500 text-sm">check_circle</span>
             </div>
             <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{rec}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
         <div className="flex items-center gap-2 mb-2">
            <span className="material-icons-round text-slate-400 dark:text-slate-500 text-sm">info</span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Medical Disclaimer</span>
         </div>
         <p className="text-[10px] leading-tight text-slate-400 dark:text-slate-500 italic">
           This analysis is generated by AI and is for educational purposes only. It is not a clinical diagnosis. Always consult with a board-certified dermatologist before starting new treatments.
         </p>
      </div>

      <button 
        onClick={onNavigateToRoutine}
        className="w-full bg-[#13ec5b] text-slate-900 py-4 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-lg shadow-[#13ec5b]/20 active:scale-95 transition-all"
      >
        Update Routine for {diagnosis.classification}
      </button>
    </div>
  );
};

export default ReportScreen;
