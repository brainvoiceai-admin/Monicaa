
import React, { useState, useEffect } from 'react';
import { AppScreen, RoutineStep } from './types';
import ReportScreen from './screens/ReportScreen';
import ScanScreen from './screens/ScanScreen';
import RoutineScreen from './screens/RoutineScreen';
import StatsScreen from './screens/StatsScreen';
import ConnectScreen from './screens/ConnectScreen';
import BottomNav from './components/BottomNav';
import StatusBar from './components/StatusBar';
import { DiagnosticResult } from './geminiService';

const INITIAL_ROUTINE: RoutineStep[] = [
  { id: '1', step: 1, name: 'Gentle Foaming Cleanser', description: 'Cleanse & Prep', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&q=80', completed: true, type: 'AM' },
  { id: '2', step: 2, name: 'Vitamin C Serum', description: 'Treatment', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&q=80', completed: false, type: 'AM', isAiPick: true },
  { id: '3', step: 3, name: 'Barrier Repair Cream', description: 'Hydrate & Seal', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=150&q=80', completed: false, type: 'AM' },
  { id: '4', step: 4, name: 'Ultra-Light SPF 50+', description: 'Protection', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=150&q=80', completed: false, type: 'AM' },
];

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.REPORT);
  const [isSplash, setIsSplash] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [routine, setRoutine] = useState<RoutineStep[]>(INITIAL_ROUTINE);
  const [lastDiagnosis, setLastDiagnosis] = useState<DiagnosticResult | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleRoutineStep = (id: string) => {
    setRoutine(prev => prev.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    ));
  };

  const handleScanResult = (result: DiagnosticResult) => {
    setLastDiagnosis(result);
    setCurrentScreen(AppScreen.REPORT);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.REPORT:
        return <ReportScreen diagnosis={lastDiagnosis} onNavigateToRoutine={() => setCurrentScreen(AppScreen.ROUTINE)} />;
      case AppScreen.SCAN:
        return <ScanScreen onAnalysisComplete={handleScanResult} />;
      case AppScreen.ROUTINE:
        return <RoutineScreen steps={routine} onToggle={toggleRoutineStep} />;
      case AppScreen.STATS:
        return <StatsScreen />;
      case AppScreen.CONNECT:
        return <ConnectScreen />;
      default:
        return <ReportScreen diagnosis={lastDiagnosis} onNavigateToRoutine={() => setCurrentScreen(AppScreen.ROUTINE)} />;
    }
  };

  if (isSplash) {
    return (
      <div className="flex justify-center bg-slate-900 min-h-screen items-center">
        <div className="w-full max-w-[430px] h-screen bg-[#13ec5b] flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6">
            <span className="material-icons-round text-[#13ec5b] text-6xl">face</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Monica AI</h1>
          <p className="text-white/70 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Dermatology Companion</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 dark' : 'bg-slate-100'}`}>
      <div className="w-full max-w-[430px] h-screen bg-[#f6f8f6] dark:bg-slate-900 relative overflow-hidden flex flex-col shadow-2xl transition-colors duration-300">
        <StatusBar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {renderScreen()}
        </div>
        <BottomNav activeScreen={currentScreen} onNavigate={setCurrentScreen} />
      </div>
    </div>
  );
};

export default App;
