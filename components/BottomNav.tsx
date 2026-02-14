
import React from 'react';
import { AppScreen } from '../types';

interface BottomNavProps {
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, onNavigate }) => {
  const tabs = [
    { id: AppScreen.REPORT, label: 'Report', icon: 'analytics' },
    { id: AppScreen.ROUTINE, label: 'Routine', icon: 'face' },
    { id: AppScreen.SCAN, label: 'Scan', icon: 'center_focus_strong', isAction: true },
    { id: AppScreen.STATS, label: 'Stats', icon: 'insights' },
    { id: AppScreen.CONNECT, label: 'Chat', icon: 'chat_bubble_outline' },
  ];

  return (
    <nav className="h-24 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-6 flex justify-between items-center z-50 transition-colors duration-300">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all ${
            tab.isAction
              ? 'relative -top-8'
              : activeScreen === tab.id
              ? 'text-[#13ec5b]'
              : 'text-slate-300 dark:text-slate-600'
          }`}
        >
          {tab.isAction ? (
            <div className="w-16 h-16 bg-[#13ec5b] rounded-full shadow-lg shadow-[#13ec5b]/40 border-4 border-white dark:border-slate-800 flex items-center justify-center">
              <span className="material-icons-round text-white text-3xl">{tab.icon}</span>
            </div>
          ) : (
            <>
              <span className="material-icons-round text-2xl">{tab.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
            </>
          )}
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
