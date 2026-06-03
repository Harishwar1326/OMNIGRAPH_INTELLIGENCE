import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Loader2, Bot, User, Sparkles, Binary, BrainCircuit } from 'lucide-react';
import { chat } from '../services/api';
import type { ChatResponse } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  meta?: ChatResponse;
}

export default function ChatPage() {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = location.state as { initialQuestion?: string };
    if (state?.initialQuestion) {
      ask(state.initialQuestion);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function ask(question: string) {
    if (!question.trim()) return;
    setMessages((m) => [...m, { role: 'user', content: question }]);
    setInput('');
    setLoading(true);
    try {
      const res = await chat(question);
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: res.answer, meta: res },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: 'The Neural Engine is currently offline. Verify connection to Intelligence Hub.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex h-[85vh] max-w-5xl flex-col relative">
      <header className="mb-6 shrink-0">
        <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] mb-1">
          <BrainCircuit size={14} />
          <span>Neural Query Engine</span>
        </div>
        <h2 className="font-display text-4xl font-black text-white">Semantic <span className="gradient-text">Exploration</span></h2>
      </header>

      {/* Chat Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 space-y-6 overflow-y-auto rounded-3xl border border-white/5 bg-slate-900/40 p-8 custom-scrollbar backdrop-blur-sm mb-24"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 py-20">
            <Binary size={64} className="opacity-10 animate-pulse" />
            <p className="text-xs font-black uppercase tracking-widest italic">Awaiting Query Input</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-4 animate-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            {msg.role === 'assistant' && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
                <Bot size={20} className="text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl p-5 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/10 font-medium'
                  : 'bg-white/[0.03] border border-white/5 text-slate-200'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
              
              {msg.meta && (
                <div className="mt-5 border-t border-white/5 pt-4 space-y-4">
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-1.5"><Sparkles size={12} className="text-amber-500" /> Confidence {(msg.meta.confidence * 100).toFixed(0)}%</span>
                    <span>• {msg.meta.contextUsed} Relational Contexts</span>
                  </div>
                  
                  {msg.meta.evidence?.length > 0 && (
                    <div className="space-y-2">
                       <p className="text-[10px] uppercase font-black tracking-tighter text-indigo-400/70">Reasoning Chain</p>
                       <ul className="space-y-1.5">
                          {msg.meta.evidence.slice(0, 3).map((e, j) => (
                            <li key={j} className="text-[11px] text-slate-500 bg-white/[0.02] p-2 rounded-lg border border-white/5 truncate">
                              {e.path}
                            </li>
                          ))}
                       </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 ring-1 ring-white/10">
                <User size={20} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3 text-indigo-400 font-bold text-xs p-4 animate-pulse">
            <Loader2 className="animate-spin" size={16} /> SYMBOLIC REASONING IN PROGRESS…
          </div>
        )}
      </div>

      {/* Static Fixed Chat Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl">
        <form
          className="flex gap-3 p-1 rounded-2xl bg-white/[0.02]"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query the multi-layered knowledge network…"
            className="flex-1 bg-transparent px-5 py-4 text-sm text-white outline-none placeholder:text-slate-600 font-medium"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-indigo-600 h-12 px-6 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-30 transition-all active:scale-95"
          >
            <Send size={20} className="mr-2" />
            <span className="text-xs font-black uppercase tracking-widest">Send Query</span>
          </button>
        </form>
      </div>
    </div>
  );
}
