import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const CHAT_HISTORY_KEY = 'unicou_chat_v2';
const INITIAL_MESSAGE: Message = { 
  role: 'model', 
  text: "Establishing secure link... Welcome to UNICOU Unified Support. I am your AI consultant for Academic Mobility. I can guide you through Voucher procurement, OTHM degree tracks, or help you initialize your Identity Registry (Signup). How may I assist your trajectory today?" 
};

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(CHAT_HISTORY_KEY);
    if (saved) {
      try { setMessages(JSON.parse(saved)); } catch (e) { setMessages([INITIAL_MESSAGE]); }
    } else {
      setMessages([INITIAL_MESSAGE]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    const updated = [...messages, { role: 'user', text: userMessage } as Message];
    setMessages(updated);
    setIsTyping(true);

    try {
      const history = updated.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      const stream = GeminiService.chatStream(userMessage, history.slice(0, -1));
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: 'model', text: fullResponse };
          return next;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Support node latency detected. Please retry or connect via WhatsApp +44 700 UNICOU." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-3xl transition-all duration-700 hover:scale-110 active:scale-95 relative group ${
          isOpen ? 'bg-slate-800 -rotate-90 border border-slate-700' : 'bg-unicou-orange border-4 border-slate-950 ring-2 ring-unicou-orange/30'
        }`}
      >
        {isOpen ? (
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
        )}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-slate-950 text-[10px] font-black text-white flex items-center justify-center animate-bounce shadow-xl">1</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[420px] h-[650px] glass rounded-[3.5rem] border border-white/10 shadow-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          <div className="p-10 bg-unicou-navy flex items-center justify-between border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-5xl">AI</div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 backdrop-blur-2xl flex items-center justify-center border border-white/20 shadow-inner">
                <span className="text-3xl">🦾</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl tracking-tight">UNICOU Nexus</h3>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <p className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">Active Authority</p>
                </div>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-8 bg-slate-950/40 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`max-w-[90%] px-6 py-5 rounded-[2rem] text-sm leading-relaxed shadow-2xl ${
                  m.role === 'user' 
                  ? 'bg-unicou-orange text-white rounded-tr-none' 
                  : 'bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-slate-900 px-6 py-5 rounded-[2rem] rounded-tl-none border border-slate-800 shadow-xl">
                    <div className="flex gap-2"><div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" /><div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-150" /><div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-300" /></div>
                 </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-8 bg-slate-900/90 border-t border-slate-800 flex gap-4">
            <input
              type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for 'Signup' or 'PTE stock'..."
              className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl px-6 py-5 text-sm outline-none focus:border-primary-500 transition-all text-white placeholder:text-slate-700 shadow-inner"
            />
            <button
              type="submit" disabled={isTyping || !input.trim()}
              className="w-16 h-16 bg-unicou-orange hover:bg-orange-600 rounded-2xl flex items-center justify-center text-white transition-all shadow-xl active:scale-90 disabled:opacity-30"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9-2-9-18-9 18 9 2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChat;