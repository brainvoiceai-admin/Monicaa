
import React, { useState, useRef, useEffect } from 'react';
import { getAiChatResponse } from '../geminiService';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isAi?: boolean;
}

const ConnectScreen: React.FC = () => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Hi! I'm Monica, your AI skin companion. I've analyzed your recent reports. Do you have any concerns about redness or hydration today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAi: true
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const doctors = [
    { name: 'Dr. Chen', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&q=80', status: 'online', role: 'Dermatologist' },
    { name: 'Dr. Wilson', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&q=80', status: 'online', role: 'Skin Spec.' },
    { name: 'Dr. Rossi', img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&q=80', status: 'offline', role: 'Offline' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const response = await getAiChatResponse(input, history);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I'm sorry, I couldn't process that. Can you rephrase?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAi: true
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/50">
      <header className="bg-white/80 backdrop-blur-xl pt-4 pb-4 px-6 border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="material-icons-round text-slate-400">psychology</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Monica AI Chat</h1>
              <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Intelligent Assistant
              </p>
            </div>
          </div>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
            <span className="material-icons-round text-sm">medical_services</span>
            Derm. Pro
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar px-2">
          {doctors.map((d, i) => (
            <div key={i} className={`flex-shrink-0 flex flex-col items-center w-20 transition-opacity ${d.status === 'offline' ? 'opacity-30' : 'opacity-100'}`}>
              <div className="relative">
                <img src={d.img} alt={d.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" />
                {d.status === 'online' && <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>}
              </div>
              <p className="text-[9px] font-bold mt-2 truncate w-full text-center text-slate-700">{d.name}</p>
              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">{d.role}</p>
            </div>
          ))}
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <div className="flex justify-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300 bg-white px-4 py-1.5 rounded-full shadow-sm border border-slate-50">Security: Encrypted</span>
        </div>

        {messages.map((m) => (
          <div key={m.id} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${m.role === 'model' ? 'bg-[#13ec5b]' : 'bg-slate-800'}`}>
              <span className="material-icons-round text-white text-lg">{m.role === 'model' ? 'face' : 'person'}</span>
            </div>
            <div className={`p-4 rounded-3xl max-w-[75%] shadow-sm text-sm leading-relaxed ${m.role === 'model' ? 'bg-white text-slate-700 rounded-tl-none border border-slate-100' : 'bg-slate-800 text-white rounded-tr-none'}`}>
              {m.text}
              <p className={`text-[9px] font-bold mt-2 ${m.role === 'model' ? 'text-slate-300' : 'text-white/40'}`}>{m.timestamp}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#13ec5b] flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-icons-round text-white text-lg">face</span>
            </div>
            <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-[#13ec5b] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[#13ec5b] rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-[#13ec5b] rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white p-4 pb-10 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
            <span className="material-icons-round">attach_file</span>
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about skin..." 
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-[#13ec5b]/20" 
            />
            <button 
              onClick={handleSend}
              disabled={isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#13ec5b] text-white flex items-center justify-center shadow-lg shadow-[#13ec5b]/30 active:scale-95 transition-all disabled:opacity-50"
            >
              <span className="material-icons-round">send</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ConnectScreen;
