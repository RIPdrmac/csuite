'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KPIStatCard } from '@/components/csuite/kpi-stat-card';
import { ConfidenceBadge } from '@/components/csuite/confidence-badge';
import { agentRecommendations, agentLogs as initialLogs, todos as initialTodos } from '@/data/mock';
import { AgentName, AgentLog, TodoItem, TodoStatus } from '@/types';
import { cn, formatPercent } from '@/lib/utils';
import {
  Brain, CheckCircle2, XCircle, Clock, Activity,
  TrendingUp, TrendingDown, Circle, AlertCircle,
} from 'lucide-react';

const agents: AgentName[] = ['PRODUCT', 'GROWTH', 'FINANCE', 'PROTOCOL', 'BRAND', 'TALENT'];

const agentMeta: Record<AgentName, { role: string; scope: string[] }> = {
  PRODUCT: { role: 'Template quality, niche analysis, build sequencing', scope: ['Template builds', 'QA', 'Feature decisions', 'Niche validation'] },
  GROWTH: { role: 'Traffic, ads, conversion, channel strategy', scope: ['Ad spend', 'Social media', 'Landing pages', 'Email sequences', 'SEO'] },
  FINANCE: { role: 'Pricing, unit economics, budget, ROAS', scope: ['Pricing tiers', 'Budget allocation', 'Revenue tracking', 'Platform fees', 'Affiliate commissions'] },
  PROTOCOL: { role: 'Process hygiene, decision logging, discipline', scope: ['Decision deadlines', 'Logging compliance', 'Process enforcement', 'Timeline tracking'] },
  BRAND: { role: 'Voice, copy, social proof, positioning', scope: ['Copy generation', 'Visual assets', 'Logo/branding', 'Social content', 'Landing page copy'] },
  TALENT: { role: 'Hiring, automation, capacity planning', scope: ['Automation', 'Tool selection', 'Outsourcing decisions', 'Capacity analysis'] },
};

const agentColors: Record<AgentName, string> = {
  PRODUCT: 'border-blue-500/30 bg-blue-500/5',
  GROWTH: 'border-emerald-500/30 bg-emerald-500/5',
  FINANCE: 'border-amber-500/30 bg-amber-500/5',
  PROTOCOL: 'border-violet-500/30 bg-violet-500/5',
  BRAND: 'border-rose-500/30 bg-rose-500/5',
  TALENT: 'border-cyan-500/30 bg-cyan-500/5',
};

const agentTextColors: Record<AgentName, string> = {
  PRODUCT: 'text-blue-400',
  GROWTH: 'text-emerald-400',
  FINANCE: 'text-amber-400',
  PROTOCOL: 'text-violet-400',
  BRAND: 'text-rose-400',
  TALENT: 'text-cyan-400',
};

const statusIcons = { 'todo': Circle, 'in-progress': Clock, 'done': CheckCircle2, 'blocked': AlertCircle };
const statusColors = { 'todo': 'text-muted', 'in-progress': 'text-accent', 'done': 'text-success', 'blocked': 'text-danger' };
const priorityVariant: Record<string, 'danger' | 'caution' | 'info' | 'default'> = { critical: 'danger', high: 'caution', medium: 'info', low: 'default' };

export default function AgentIntelPage() {
  const [selectedAgent, setSelectedAgent] = useState<AgentName | null>(null);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>(initialLogs);
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);

  const acceptLog = (id: string) => {
    setAgentLogs(prev => prev.map(l => l.id === id ? { ...l, accepted: true } : l));
  };

  const ignoreLog = (id: string) => {
    setAgentLogs(prev => prev.map(l => l.id === id ? { ...l, accepted: false } : l));
  };

  const cycleTodoStatus = (id: string, newStatus: TodoStatus) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const totalRecs = agentLogs.length;
  const acceptedRecs = agentLogs.filter(l => l.accepted === true).length;
  const rejectedRecs = agentLogs.filter(l => l.accepted === false).length;
  const pendingRecs = agentLogs.filter(l => l.accepted === null).length;
  const correctRecs = agentLogs.filter(l => l.accepted === true || (l.accepted === false && l.outcome?.toLowerCase().includes('correct'))).length;
  const accuracyRate = totalRecs > 0 ? correctRecs / totalRecs : 0;

  const filteredLogs = selectedAgent ? agentLogs.filter(l => l.agent === selectedAgent) : agentLogs;

  return (
    <div className="min-h-screen">
      <PageHeader title="Agent Intelligence" subtitle="The brain — suggestions, decisions, outcomes, predictions" />

      <div className="px-4 md:px-8 py-6 space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <KPIStatCard label="Suggestions Made" value={totalRecs.toString()} />
          <KPIStatCard label="Used" value={acceptedRecs.toString()} change={totalRecs > 0 ? `${((acceptedRecs/totalRecs)*100).toFixed(0)}% follow rate` : ''} trend="up" />
          <KPIStatCard label="Ignored" value={rejectedRecs.toString()} trend={rejectedRecs > 1 ? 'down' : 'flat'} />
          <KPIStatCard label="Prediction Accuracy" value={totalRecs > 0 ? formatPercent(accuracyRate) : 'N/A'} trend={accuracyRate >= 0.7 ? 'up' : 'down'} />
          <KPIStatCard label="Pending Review" value={pendingRecs.toString()} change="Needs your call" trend="flat" />
        </div>

        {/* Agent cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] text-muted uppercase tracking-widest font-medium">Agent Team — Click to Focus</h2>
            {selectedAgent && (
              <button onClick={() => setSelectedAgent(null)} className="text-[12px] text-accent hover:underline">Show all ×</button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {agents.map((agent) => {
              const logs = agentLogs.filter(l => l.agent === agent);
              const taskCount = todos.filter(t => t.agent === agent && t.status !== 'done').length;
              const isSelected = selectedAgent === agent;
              return (
                <button
                  key={agent}
                  onClick={() => setSelectedAgent(isSelected ? null : agent)}
                  className={cn(
                    'p-3 rounded-xl border text-left transition-all',
                    agentColors[agent],
                    isSelected && 'ring-2 ring-accent/60 scale-[1.02]',
                    !isSelected && 'hover:brightness-110'
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn('text-[11px] font-mono font-bold tracking-wider', agentTextColors[agent])}>{agent}</span>
                    <Activity className="w-3 h-3 text-success" />
                  </div>
                  <div className="text-[10px] font-mono text-muted">{logs.length} recs · {taskCount} tasks</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Left 3/5: Decision log */}
          <div className="lg:col-span-3 space-y-5">
            {/* Current rec */}
            {selectedAgent && (() => {
              const rec = agentRecommendations.find(r => r.agent === selectedAgent);
              if (!rec) return null;
              return (
                <Card className={cn('border', agentColors[selectedAgent])}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn('text-[11px] font-mono font-bold', agentTextColors[selectedAgent])}>{selectedAgent}</span>
                      <ConfidenceBadge level={rec.confidence} />
                    </div>
                    <p className="text-[13px] text-foreground leading-relaxed mb-1">{rec.recommendation}</p>
                    <p className="text-[12px] text-muted-foreground">{rec.rationale}</p>
                    {rec.risk && <p className="text-[12px] text-caution/70 mt-1">Risk: {rec.risk}</p>}
                  </CardContent>
                </Card>
              );
            })()}

            {/* Decision log */}
            <Card>
              <CardHeader><CardTitle>{selectedAgent ? `${selectedAgent} Decisions` : 'All Decision History'}</CardTitle></CardHeader>
              <CardContent className="p-0">
                {filteredLogs.map((log, i) => (
                  <div key={log.id} className={cn('px-4 py-3.5 hover:bg-card-hover transition-colors', i !== filteredLogs.length - 1 && 'border-b border-border')}>
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn('text-[10px] font-mono font-bold tracking-wider', agentTextColors[log.agent])}>{log.agent}</span>
                        <span className="text-[12px] text-muted-foreground">{log.action}</span>
                        <ConfidenceBadge level={log.confidence} />
                      </div>
                      <div className="flex-shrink-0">
                        {log.accepted === true && <Badge variant="success"><CheckCircle2 className="w-3 h-3 mr-1" />Used</Badge>}
                        {log.accepted === false && <Badge variant="danger"><XCircle className="w-3 h-3 mr-1" />Ignored</Badge>}
                        {log.accepted === null && <Badge variant="caution"><Clock className="w-3 h-3 mr-1" />Pending</Badge>}
                      </div>
                    </div>
                    <p className="text-[13px] text-foreground">{log.recommendation}</p>
                    {log.outcome && (
                      <div className="mt-2 px-3 py-2 rounded-lg bg-card-hover border border-border">
                        <div className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Outcome</div>
                        <p className="text-[12px] text-foreground">{log.outcome}</p>
                        {log.outcome.toLowerCase().includes('correct') && (
                          <div className="flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3 text-success" /><span className="text-[11px] text-success">AI was right</span></div>
                        )}
                        {log.outcome.toLowerCase().includes('wasted') && (
                          <div className="flex items-center gap-1 mt-1"><TrendingDown className="w-3 h-3 text-danger" /><span className="text-[11px] text-danger">Override cost real money</span></div>
                        )}
                      </div>
                    )}
                    {/* Action buttons for pending */}
                    {log.accepted === null && (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => acceptLog(log.id)}
                          className="px-3 py-1.5 text-[11px] font-medium rounded-md bg-success/15 text-success hover:bg-success/25 transition-colors"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => ignoreLog(log.id)}
                          className="px-3 py-1.5 text-[11px] font-medium rounded-md bg-danger/15 text-danger hover:bg-danger/25 transition-colors"
                        >
                          ✗ Ignore
                        </button>
                      </div>
                    )}
                    <div className="text-[10px] font-mono text-muted mt-1.5">{new Date(log.timestamp).toLocaleDateString()}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Prediction scorecard */}
            <Card className="p-4">
              <div className="text-[11px] text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                <Brain className="w-3.5 h-3.5" /> Prediction Scorecard
              </div>
              {agents.map(agent => {
                const logs = agentLogs.filter(l => l.agent === agent);
                const correct = logs.filter(l => l.accepted === true || (l.accepted === false && l.outcome?.toLowerCase().includes('correct'))).length;
                const total = logs.length;
                const score = total > 0 ? correct / total : 0;
                return (
                  <div key={agent} className="flex items-center gap-3 mb-2">
                    <span className={cn('text-[10px] font-mono font-bold w-16', agentTextColors[agent])}>{agent}</span>
                    <div className="flex-1 h-2 bg-border/40 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full', score >= 0.7 ? 'bg-success' : score >= 0.4 ? 'bg-caution' : total === 0 ? 'bg-muted/30' : 'bg-danger')} style={{ width: total > 0 ? `${score * 100}%` : '0%' }} />
                    </div>
                    <span className="text-[10px] font-mono text-muted w-14 text-right">{total > 0 ? `${correct}/${total}` : '—'}</span>
                  </div>
                );
              })}
            </Card>
          </div>

          {/* Right 2/5: Tasks by agent sector */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader><CardTitle>{selectedAgent ? `${selectedAgent} Tasks` : 'Tasks by Agent Sector'}</CardTitle></CardHeader>
              <CardContent className="p-0">
                {selectedAgent ? (
                  // Filtered to one agent
                  (() => {
                    const agentTasks = todos.filter(t => t.agent === selectedAgent);
                    if (agentTasks.length === 0) return <div className="px-4 py-6 text-center text-[13px] text-muted-foreground">No tasks for {selectedAgent}</div>;
                    return agentTasks.map((todo, i) => {
                      const StatusIcon = statusIcons[todo.status];
                      return (
                        <div key={todo.id} className={cn('flex items-start gap-3 px-4 py-2.5 hover:bg-card-hover', i !== agentTasks.length - 1 && 'border-b border-border')}>
                          <button onClick={() => cycleTodoStatus(todo.id, todo.status === 'todo' ? 'in-progress' : todo.status === 'in-progress' ? 'done' : 'todo')} className="mt-0.5 flex-shrink-0 hover:scale-125 transition-transform">
                            <StatusIcon className={cn('w-3.5 h-3.5', statusColors[todo.status])} />
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={cn('text-[12px] font-medium', todo.status === 'done' ? 'text-muted line-through' : 'text-foreground')}>{todo.title}</span>
                              <Badge variant={priorityVariant[todo.priority]}>{todo.priority}</Badge>
                              <span className={cn('text-[9px] font-mono px-1.5 py-0.5 rounded border', todo.permission === 'auto' ? 'bg-success/10 text-success border-success/20' : todo.permission === 'approve' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-caution/10 text-caution border-caution/20')}>
                                {todo.permission === 'auto' ? 'AUTO' : todo.permission === 'approve' ? 'APPROVE' : 'HUMAN'}
                              </span>
                            </div>
                            {todo.status !== 'done' && (
                              <div className="flex items-center gap-1.5 mt-1">
                                {todo.status === 'todo' && <button onClick={() => cycleTodoStatus(todo.id, 'in-progress')} className="px-2 py-0.5 text-[10px] rounded bg-accent/15 text-accent hover:bg-accent/25">Start →</button>}
                                {todo.status === 'in-progress' && <button onClick={() => cycleTodoStatus(todo.id, 'done')} className="px-2 py-0.5 text-[10px] rounded bg-success/15 text-success hover:bg-success/25">Done ✓</button>}
                              </div>
                            )}
                          </div>
                          {todo.dueDate && <span className="text-[10px] font-mono text-muted flex-shrink-0">{todo.dueDate}</span>}
                        </div>
                      );
                    });
                  })()
                ) : (
                  // Grouped by agent
                  agents.map(agent => {
                    const agentTasks = todos.filter(t => t.agent === agent);
                    if (agentTasks.length === 0) return null;
                    return (
                      <div key={agent}>
                        <div className={cn('px-4 py-2 border-b border-border bg-card-hover/50')}>
                          <span className={cn('text-[10px] font-mono font-bold tracking-wider', agentTextColors[agent])}>{agent}</span>
                          <span className="text-[10px] text-muted ml-2">{agentTasks.filter(t => t.status !== 'done').length} open</span>
                        </div>
                        {agentTasks.map((todo, i) => {
                          const StatusIcon = statusIcons[todo.status];
                          return (
                            <div key={todo.id} className={cn('flex items-start gap-2.5 px-4 py-2 hover:bg-card-hover', i !== agentTasks.length - 1 && 'border-b border-border/50')}>
                              <StatusIcon className={cn('w-3.5 h-3.5 mt-0.5 flex-shrink-0', statusColors[todo.status])} />
                              <span className={cn('text-[12px] flex-1', todo.status === 'done' ? 'text-muted line-through' : 'text-foreground')}>{todo.title}</span>
                              <Badge variant={priorityVariant[todo.priority]}>{todo.priority}</Badge>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Scope reference */}
            {selectedAgent && (
              <Card className="p-4">
                <div className="text-[11px] text-muted uppercase tracking-widest mb-2">{selectedAgent} Responsibilities</div>
                <p className="text-[12px] text-muted-foreground mb-2">{agentMeta[selectedAgent].role}</p>
                <div className="flex flex-wrap gap-1.5">
                  {agentMeta[selectedAgent].scope.map(s => (
                    <span key={s} className="px-2 py-1 text-[11px] rounded-md bg-card-hover border border-border text-muted-foreground">{s}</span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
