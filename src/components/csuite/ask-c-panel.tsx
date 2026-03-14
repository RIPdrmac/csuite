'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { AgentName } from '@/types';
import { agentRecommendations, blockers } from '@/data/mock';
import { X, MessageSquare, Send, Sparkles, AlertTriangle, Loader2, Users } from 'lucide-react';
import { formatPercent } from '@/lib/utils';
import { kpiStats } from '@/data/mock';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const agentColors: Record<AgentName, string> = {
  PRODUCT: 'text-blue-400',
  GROWTH: 'text-emerald-400',
  FINANCE: 'text-amber-400',
  PROTOCOL: 'text-violet-400',
  BRAND: 'text-rose-400',
  TALENT: 'text-cyan-400',
};

function detectAgent(text: string): AgentName | null {
  const first60 = text.slice(0, 60).toUpperCase();
  const agents: AgentName[] = ['PRODUCT', 'GROWTH', 'FINANCE', 'PROTOCOL', 'BRAND', 'TALENT'];
  for (const a of agents) {
    if (first60.startsWith(a) || first60.startsWith(`**${a}`) || first60.includes(`${a}:`)) return a;
  }
  return null;
}

function renderMarkdown(text: string) {
  // Split into lines and render with basic markdown support
  return text.split('\n').map((line, i) => {
    // Bold
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    // Bullet points
    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      return (
        <div key={i} className="flex gap-1.5 ml-1 my-0.5">
          <span className="text-muted flex-shrink-0 mt-[1px]">·</span>
          <span>{rendered.map((r, ri) => typeof r === 'string' ? r.replace(/^[-•]\s*/, '') : r)}</span>
        </div>
      );
    }

    // Headers (lines ending with :)
    if (line.trim().endsWith(':') && line.trim().length < 60 && !line.trim().startsWith('-')) {
      return <div key={i} className="text-foreground font-semibold mt-2 mb-0.5">{rendered}</div>;
    }

    // Empty lines = spacing
    if (line.trim() === '') return <div key={i} className="h-2" />;

    return <div key={i} className="my-0.5">{rendered}</div>;
  });
}

export function AskCPanel() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'chat' | 'team'>('chat');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hey Mac. CSUITE is online — all 6 agents are active and we\'re ready. What\'s on your mind?',
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const criticalBlockers = blockers.filter((b) => b.severity === 'critical');
  const hasWarnings = criticalBlockers.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const handleSend = useCallback(async (overrideInput?: string) => {
    const text = (overrideInput || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages.slice(-10), userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ask-c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.details || data.error);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `Had trouble reaching the intelligence layer. ${err instanceof Error ? err.message : 'Check the API key and try again.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-5 py-3.5 shadow-2xl shadow-accent/25 transition-all duration-300',
          'bg-accent hover:bg-accent-muted text-white',
          'md:bottom-6 md:right-6',
          open && 'scale-0 opacity-0 pointer-events-none'
        )}
      >
        {hasWarnings && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-danger animate-pulse" />
        )}
        <MessageSquare className="w-4 h-4" />
        <span className="text-[13px] font-semibold tracking-wide">ASK C</span>
      </button>

      {/* Panel — wider, taller, better proportions */}
      <div
        className={cn(
          'fixed z-50 transition-all duration-300 ease-out',
          'bottom-0 right-0 w-full h-full',
          'md:bottom-5 md:right-5 md:w-[480px] md:h-auto',
          open
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full md:translate-y-4 opacity-0 pointer-events-none'
        )}
      >
        <div className="bg-[#0c0e12] border-0 md:border border-border/60 rounded-none md:rounded-2xl shadow-2xl shadow-black/60 h-full md:max-h-[700px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 bg-[#0a0c10]">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-2.5 h-2.5 rounded-full',
                loading ? 'bg-caution animate-pulse' : 'bg-emerald-400'
              )} />
              <div>
                <span className="text-[14px] font-semibold text-foreground">CSUITE</span>
                <span className="text-[11px] text-muted-foreground ml-2">
                  {loading ? 'thinking...' : '6 agents · live'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setView(view === 'chat' ? 'team' : 'chat')}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors',
                  view === 'team'
                    ? 'bg-accent-subtle text-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card-hover'
                )}
              >
                <Users className="w-3 h-3" />
                Team
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-card-hover transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Warning strip */}
          {hasWarnings && (
            <div className="px-5 py-2 bg-danger/5 border-b border-danger/15 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-danger flex-shrink-0" />
              <span className="text-[11px] text-danger/90">
                Pace at {formatPercent(kpiStats.currentDailyPace / kpiStats.requiredDailyPace)} of target — {kpiStats.daysLeft}d left
              </span>
            </div>
          )}

          {view === 'chat' ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 min-h-[350px] md:min-h-[380px]">
                {messages.map((msg) => {
                  const agent = msg.role === 'assistant' ? detectAgent(msg.content) : null;
                  return (
                    <div key={msg.id} className={cn(
                      'flex',
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}>
                      <div className={cn(
                        'rounded-2xl px-4 py-3',
                        msg.role === 'user'
                          ? 'bg-accent/15 text-foreground max-w-[80%] rounded-br-md'
                          : 'bg-[#13161b] border border-border/30 max-w-[92%] rounded-bl-md'
                      )}>
                        {agent && (
                          <div className={cn('text-[10px] font-mono font-bold tracking-widest mb-1.5 uppercase', agentColors[agent])}>
                            {agent}
                          </div>
                        )}
                        <div className="text-[13px] leading-[1.65] text-foreground/90">
                          {renderMarkdown(msg.content)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-[#13161b] border border-border/30 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2.5">
                      <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
                      <span className="text-[13px] text-muted-foreground">Agents working on it...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick actions — scrollable pills */}
              <div className="px-5 py-2.5 border-t border-border/30 flex gap-2 overflow-x-auto scrollbar-none">
                {[
                  'what should I focus on?',
                  'break down our costs',
                  'brand & posting strategy',
                  'product pipeline status',
                  'affiliate math',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={loading}
                    className="px-3 py-1.5 text-[11px] rounded-full bg-[#13161b] border border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60 transition-colors whitespace-nowrap disabled:opacity-40 flex-shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="px-5 py-4 border-t border-border/30 bg-[#0a0c10]">
                <div className="flex items-center gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Talk to your team..."
                    disabled={loading}
                    className="flex-1 h-10 px-4 text-[14px] bg-[#13161b] border border-border/30 rounded-xl text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 disabled:opacity-50 transition-all"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-accent text-white hover:bg-accent-muted disabled:opacity-25 transition-all flex-shrink-0"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Team view */
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              <div className="text-[11px] text-muted uppercase tracking-widest mb-3">Your Executive Team</div>
              {(['PRODUCT', 'GROWTH', 'FINANCE', 'PROTOCOL', 'BRAND', 'TALENT'] as AgentName[]).map((agent) => {
                const rec = agentRecommendations.find((r) => r.agent === agent);
                return (
                  <div key={agent} className="p-3.5 rounded-xl border border-border/30 bg-[#13161b] hover:border-border/50 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={cn('text-[12px] font-mono font-bold tracking-wider', agentColors[agent])}>{agent}</span>
                      <span className="text-[10px] text-emerald-400/80 font-mono">ACTIVE</span>
                    </div>
                    {rec && <p className="text-[12px] text-muted-foreground leading-relaxed">{rec.recommendation}</p>}
                    {rec && rec.risk && (
                      <p className="text-[11px] text-caution/60 mt-1.5">Risk: {rec.risk}</p>
                    )}
                  </div>
                );
              })}
              <div className="pt-3 border-t border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[11px] text-accent uppercase tracking-widest font-medium">Adaptive Layer</span>
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  Focus beats breadth right now. One winning template scaled hard is better than five underperformers.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
