
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { api } from '../services/apiService';
import { ViewState } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIChatProps {
  onNavigate: (view: ViewState) => void;
}

const CHAT_HISTORY_KEY = 'unicou_chat_v4';
const INITIAL_MESSAGE: Message = { 
  role: 'model', 
  text: "Hello! Welcome to UniCou Ltd. I'm your primary support node. For the best experience and to track your support history, please ensure you are signed in. How can I help with vouchers or admissions?" 
};

// MANDATORY SECURITY FILTERS (Requirement V.v)
const securityProtocol = (text: string) => {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
  
  return text
    .replace(emailRegex, "[REDACTED: PRIVACY NODE]")
    .replace(phoneRegex, (match) => match.length > 8 ? "[REDACTED: CONTACT RESTRICTION]" : match);
};

const AIChat: React.FC<AIChatProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUser = api.getCurrentUser();

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

    const rawInput = input.trim();
    const sanitizedInput = securityProtocol(rawInput);
    
    setInput('');
    const updated = [...messages, { role: 'user', text: sanitizedInput } as Message];
    setMessages(updated);
    setIsTyping(true);

    try {
      // Escalation logic to Sales Agent
      const escalationKeywords = ['agent', 'human', 'call', 'talk to person', 'help', 'stuck', 'failed'];
      if (escalationKeywords.some(kw => rawInput.toLowerCase().includes(kw))) {
        await new Promise(r => setTimeout(r, 1200));
        setMessages(prev => [...prev, { role: 'model', text: "Establishing a secure handshake with a human Support Agent. Your current identity node is logged for performance tracking." }]);
        setIsTyping(false);
        return;
      }

      const history = updated.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      const stream = GeminiService.chatStream(sanitizedInput, history.slice(0, -1));
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: 'model', text: securityProtocol(fullResponse) };
          return next;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Protocol sync interrupted. Please verify connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      <button onClick={() => setIsOpen(!isOpen)} className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-premium transition-all duration-500 hover:scale-110 active:scale-95 relative group ${isOpen ? 'bg-unicou-navy border border-slate-700' : 'bg-unicou-orange'}`}>
        {isOpen ? <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2.5}/></svg> : <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth={2.5}/></svg>}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[600px] bg-white rounded-3xl border border-slate-100 shadow-premium flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="p-6 bg-unicou-navy flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-unicou-orange flex items-center justify-center text-xl shadow-lg">🤖</div>
               <div>
                 <h3 className="text-white font-bold text-sm leading-none uppercase tracking-tighter">Unified Hub</h3>
                 <div className="flex items-center gap-2 mt-1"><div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /><p className="text-emerald-400 text-[8px] font-black uppercase tracking-widest">Active Node</p></div>
               </div>
            </div>
            {!currentUser && (
               <div className="flex gap-1">
                  <button onClick={() => onNavigate({type: 'login'})} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[8px] font-black uppercase transition-all">Sign In</button>
                  <button onClick={() => onNavigate({type: 'signup'})} className="px-3 py-1 bg-unicou-orange text-white rounded-lg text-[8px] font-black uppercase transition-all">Sign Up</button>
               </div>
            )}
          </div>

          {currentUser && (
            <div className="bg-slate-50 px-6 py-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logged in as: {currentUser.name.split(' ')[0]}</span>
              <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-tighter">Verified session</span>
            </div>
          )}

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-unicou-orange text-white rounded-tr-none shadow-action' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-premium font-medium italic'}`}>{m.text}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100 flex gap-3">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Consult about vouchers..." className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-unicou-navy transition-all font-bold" />
            <button type="submit" disabled={isTyping || !input.trim()} className="w-12 h-12 bg-unicou-orange hover:bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-action transition-all active:scale-90 disabled:opacity-30">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
          <div className="bg-slate-100 px-8 py-2 text-center border-t border-slate-200"><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Single active support terminal. All interactions logged for performance audit.</p></div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
