
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const CHAT_HISTORY_KEY = 'unicou_chat_v3';
const INITIAL_MESSAGE: Message = { 
  role: 'model', 
  text: "Hello! Welcome to UniCou International Ltd. I'm your AI study abroad consultant. How can I help you today? I can guide you through exam vouchers, university admissions, or visa requirements for different countries." 
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
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a slight technical glitch. Please reach out to us on WhatsApp at +44 700 UNICOU for immediate help!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-premium transition-all duration-500 hover:scale-110 active:scale-95 relative group ${
          isOpen ? 'bg-unicou-navy border border-slate-700' : 'bg-unicou-orange'
        }`}
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[600px] bg-white rounded-3xl border border-slate-100 shadow-premium flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="p-8 bg-unicou-navy flex items-center gap-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-unicou-orange flex items-center justify-center text-2xl">🤖</div>
            <div>
              <h3 className="text-white font-bold text-lg leading-none">UniCou Assistant</h3>
              <div className="flex items-center gap-2 mt-1.5">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <p className="text-emerald-400 text-[9px] font-bold uppercase tracking-widest">Online</p>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-unicou-orange text-white rounded-tr-none shadow-action' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-premium'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-premium">
                    <div className="flex gap-1.5"><div className="w-2 h-2 bg-slate-200 rounded-full animate-bounce" /><div className="w-2 h-2 bg-slate-200 rounded-full animate-bounce delay-150" /><div className="w-2 h-2 bg-slate-200 rounded-full animate-bounce delay-300" /></div>
                 </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100 flex gap-3">
            <input
              type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-unicou-navy transition-all"
            />
            <button
              type="submit" disabled={isTyping || !input.trim()}
              className="w-12 h-12 bg-unicou-orange hover:bg-orange-600 rounded-xl flex items-center justify-center text-white transition-all shadow-action active:scale-90 disabled:opacity-30"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChat;
