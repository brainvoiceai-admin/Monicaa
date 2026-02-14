
import React, { useState, useEffect } from 'react';

interface StatusBarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const StatusBar: React.FC<StatusBarProps> = ({ isDarkMode, onToggleDarkMode }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-12 px-6 flex justify-between items-center bg-transparent z-[100] transition-colors duration-300">
      <div className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleDarkMode}
          className="flex items-center justify-center p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors pointer-events-auto"
        >
          <span className="material-icons-round text-[18px] text-slate-600 dark:text-amber-400">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="material-icons-round text-[16px] text-slate-800 dark:text-slate-100">signal_cellular_alt</span>
          <span className="material-icons-round text-[16px] text-slate-800 dark:text-slate-100">wifi</span>
          <div className="flex items-center gap-0.5 ml-0.5">
            <div className="w-5 h-2.5 border border-slate-400 dark:border-slate-500 rounded-[2px] relative flex items-center px-[1px]">
              <div className="h-full bg-slate-800 dark:bg-slate-100 w-[80%] rounded-[1px]"></div>
            </div>
            <div className="w-[1.5px] h-1.5 bg-slate-400 dark:bg-slate-500 rounded-r-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
