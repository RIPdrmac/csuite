'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { DecisionCard } from '@/components/csuite/decision-card';
import { KPIStatCard } from '@/components/csuite/kpi-stat-card';
import { decisions } from '@/data/mock';
import { DecisionStatus, DecisionMode } from '@/types';
import { cn } from '@/lib/utils';

const statusFilters: (DecisionStatus | 'All')[] = [
  'All', 'Awaiting approval', 'Deliberating', 'Approved', 'Overridden', 'Executed',
];

const modeFilters: (DecisionMode | 'All')[] = ['All', 'AUTO', 'HOLD', 'OVER'];

export default function DecisionsPage() {
  const [statusFilter, setStatusFilter] = useState<DecisionStatus | 'All'>('All');
  const [modeFilter, setModeFilter] = useState<DecisionMode | 'All'>('All');

  const filtered = decisions.filter((d) => {
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    const matchesMode = modeFilter === 'All' || d.mode === modeFilter;
    return matchesStatus && matchesMode;
  });

  const awaitingCount = decisions.filter((d) => d.status === 'Awaiting approval').length;
  const deliberatingCount = decisions.filter((d) => d.status === 'Deliberating').length;
  const criticalCount = decisions.filter((d) => d.consequenceClass === 'Critical').length;

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Decisions"
        subtitle="High-signal decision review and triage"
      />

      <div className="px-4 md:px-8 py-6 space-y-5">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPIStatCard label="Awaiting Approval" value={awaitingCount.toString()} />
          <KPIStatCard label="Deliberating" value={deliberatingCount.toString()} />
          <KPIStatCard label="Critical Decisions" value={criticalCount.toString()} />
          <KPIStatCard label="Total Open" value={decisions.filter((d) => !['Executed', 'Logged', 'Outcome recorded'].includes(d.status)).length.toString()} />
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'px-2.5 py-1.5 text-[12px] font-medium rounded-md transition-colors',
                  statusFilter === status
                    ? 'bg-accent-subtle text-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card-hover'
                )}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {modeFilters.map((mode) => (
              <button
                key={mode}
                onClick={() => setModeFilter(mode)}
                className={cn(
                  'px-2.5 py-1.5 text-[12px] font-medium rounded-md transition-colors',
                  modeFilter === mode
                    ? 'bg-accent-subtle text-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card-hover'
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Decision cards — expanded */}
        <div className="space-y-3">
          {filtered.map((decision) => (
            <DecisionCard key={decision.id} decision={decision} expanded />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[13px] text-muted-foreground">No decisions match the current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
