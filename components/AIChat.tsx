import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const CHAT_HISTORY_KEY = 'unicou_chat_v2';
const INITIAL_MESSAGE: Message = { 
  role: 'model', 
  text: "Welcome to UNICOU Support! I'm your AI consultant. I can help with PTE/IELTS vouchers, visa paths, or OTHM qualifications in our Learning Hub. How can I assist you today?" 
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
      setMessages(prev => [...prev, { role: 'model', text: "Support node busy. Please try again or WhatsApp us directly at +44 700 UNICOU." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {/* Reverted to brand orange for the main chat toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-800 -rotate-90' : 'bg-unicou-orange'
        }`}
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-slate-950 flex items-center justify-center animate-bounce">
            <span className="text-[10px] font-black text-white">1</span>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[600px] glass rounded-[3rem] border border-white/10 shadow-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
          <div className="p-8 bg-unicou-navy flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="text-white font-bold tracking-tight">UNICOU Assistant</h3>
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing Active</p>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-950/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-[1.8rem] text-sm leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-unicou-orange text-white rounded-tr-none shadow-xl' 
                  : 'bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800 shadow-lg'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-slate-900 px-5 py-4 rounded-[1.8rem] rounded-tl-none border border-slate-800">
                    <div className="flex gap-1.5"><div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" /><div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-100" /><div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-200" /></div>
                 </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-5 bg-slate-900/80 border-t border-slate-800 flex gap-3">
            <input
              type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about PTE, Visa, or OTHM..."
              className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm outline-none focus:border-primary-500 transition-all text-white"
            />
            <button
              type="submit" disabled={isTyping || !input.trim()}
              className="w-14 h-14 bg-unicou-orange hover:bg-orange-600 rounded-2xl flex items-center justify-center text-white transition-all shadow-xl active:scale-90 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9-2-9-18-9 18 9 2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChat;