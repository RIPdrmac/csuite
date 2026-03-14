'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KPIStatCard } from '@/components/csuite/kpi-stat-card';
import { todos as initialTodos } from '@/data/mock';
import { TodoPriority, TodoStatus, TodoItem, AgentName } from '@/types';
import { cn } from '@/lib/utils';
import { Circle, CheckCircle2, Clock, AlertCircle, Plus } from 'lucide-react';

const statusFilters: (TodoStatus | 'All')[] = ['All', 'todo', 'in-progress', 'done', 'blocked'];

const priorityVariant: Record<TodoPriority, 'danger' | 'caution' | 'info' | 'default'> = {
  critical: 'danger',
  high: 'caution',
  medium: 'info',
  low: 'default',
};

const statusIcons: Record<TodoStatus, typeof Circle> = {
  'todo': Circle,
  'in-progress': Clock,
  'done': CheckCircle2,
  'blocked': AlertCircle,
};

const statusColors: Record<TodoStatus, string> = {
  'todo': 'text-muted',
  'in-progress': 'text-accent',
  'done': 'text-success',
  'blocked': 'text-danger',
};

const agentColors: Record<AgentName, string> = {
  PRODUCT: 'text-blue-400',
  GROWTH: 'text-emerald-400',
  FINANCE: 'text-amber-400',
  PROTOCOL: 'text-violet-400',
  BRAND: 'text-rose-400',
  TALENT: 'text-cyan-400',
};

export default function TodosPage() {
  const [filter, setFilter] = useState<TodoStatus | 'All'>('All');
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);

  const cycleStatus = (id: string) => {
    setTodos(prev => prev.map(t => {
      if (t.id !== id) return t;
      const next: Record<TodoStatus, TodoStatus> = {
        'todo': 'in-progress',
        'in-progress': 'done',
        'done': 'todo',
        'blocked': 'todo',
      };
      return { ...t, status: next[t.status] };
    }));
  };

  const filtered = todos.filter((t) => filter === 'All' || t.status === filter);

  const todoCount = todos.filter((t) => t.status === 'todo').length;
  const inProgressCount = todos.filter((t) => t.status === 'in-progress').length;
  const doneCount = todos.filter((t) => t.status === 'done').length;
  const criticalCount = todos.filter((t) => t.priority === 'critical' && t.status !== 'done').length;

  return (
    <div className="min-h-screen">
      <PageHeader title="Master TODO" subtitle="Execution checklist — what needs to happen">
        <Button size="sm">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Task
        </Button>
      </PageHeader>

      <div className="px-4 md:px-8 py-6 space-y-5">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPIStatCard label="To Do" value={todoCount.toString()} />
          <KPIStatCard label="In Progress" value={inProgressCount.toString()} />
          <KPIStatCard label="Done" value={doneCount.toString()} />
          <KPIStatCard label="Critical" value={criticalCount.toString()} change={criticalCount > 0 ? 'Needs attention' : 'Clear'} trend={criticalCount > 0 ? 'down' : 'up'} />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                'px-2.5 py-1.5 text-[12px] font-medium rounded-md transition-colors whitespace-nowrap',
                filter === status
                  ? 'bg-accent-subtle text-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card-hover'
              )}
            >
              {status === 'All' ? 'All' : status.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Task list */}
        <Card>
          <CardContent className="p-0">
            {filtered.map((todo, i) => {
              const StatusIcon = statusIcons[todo.status];
              return (
                <div
                  key={todo.id}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 hover:bg-card-hover transition-colors',
                    i !== filtered.length - 1 && 'border-b border-border'
                  )}
                >
                  <button onClick={() => cycleStatus(todo.id)} className="mt-0.5 flex-shrink-0 hover:scale-125 transition-transform" title="Click to change status">
                    <StatusIcon className={cn('w-4 h-4', statusColors[todo.status])} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h4 className={cn(
                        'text-[13px] font-medium',
                        todo.status === 'done' ? 'text-muted line-through' : 'text-foreground'
                      )}>
                        {todo.title}
                      </h4>
                      <Badge variant={priorityVariant[todo.priority]}>{todo.priority}</Badge>
                      {todo.agent && (
                        <span className={cn('text-[10px] font-mono font-semibold tracking-wider', agentColors[todo.agent])}>
                          {todo.agent}
                        </span>
                      )}
                      {/* Permission level */}
                      <span className={cn(
                        'px-1.5 py-0.5 text-[9px] font-mono rounded border',
                        todo.permission === 'auto' && 'bg-success/10 text-success border-success/20',
                        todo.permission === 'approve' && 'bg-accent/10 text-accent border-accent/20',
                        todo.permission === 'human' && 'bg-caution/10 text-caution border-caution/20',
                      )}>
                        {todo.permission === 'auto' ? 'AUTO' : todo.permission === 'approve' ? 'APPROVE' : 'HUMAN'}
                      </span>
                    </div>
                    {todo.description && (
                      <p className="text-[12px] text-muted-foreground">{todo.description}</p>
                    )}
                    {/* Action buttons + stage indicator */}
                    <div className="flex items-center gap-2 mt-2">
                      {todo.status === 'todo' && (
                        <button
                          onClick={() => setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, status: 'in-progress' as TodoStatus } : t))}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-accent/15 text-accent hover:bg-accent/25 transition-colors"
                        >
                          Start →
                        </button>
                      )}
                      {todo.status === 'in-progress' && (
                        <button
                          onClick={() => setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, status: 'done' as TodoStatus } : t))}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-success/15 text-success hover:bg-success/25 transition-colors"
                        >
                          Done ✓
                        </button>
                      )}
                      {todo.status === 'done' && (
                        <button
                          onClick={() => setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, status: 'todo' as TodoStatus } : t))}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-card-hover text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Reopen
                        </button>
                      )}
                      {/* Stage indicator */}
                      <div className="flex items-center gap-1 ml-auto">
                        <div className={cn('w-5 h-1 rounded-full', todo.status === 'todo' ? 'bg-muted/40' : 'bg-accent')} />
                        <div className={cn('w-5 h-1 rounded-full', todo.status === 'in-progress' ? 'bg-accent' : todo.status === 'done' ? 'bg-success' : 'bg-muted/20')} />
                        <div className={cn('w-5 h-1 rounded-full', todo.status === 'done' ? 'bg-success' : 'bg-muted/20')} />
                        <span className={cn('text-[10px] font-mono ml-1', statusColors[todo.status])}>
                          {todo.status === 'todo' ? 'TODO' : todo.status === 'in-progress' ? 'IN PROGRESS' : todo.status === 'done' ? 'DONE' : 'BLOCKED'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {todo.dueDate && (
                    <span className="text-[11px] font-mono text-muted flex-shrink-0">
                      {todo.dueDate}
                    </span>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
