'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LearningEventRow } from '@/components/csuite/learning-event-row';
import { KPIStatCard } from '@/components/csuite/kpi-stat-card';
import { learningEvents } from '@/data/mock';
import { LearningEventType } from '@/types';
import { cn, formatPercent } from '@/lib/utils';

const typeFilters: (LearningEventType | 'All')[] = ['All', 'Launch', 'Sale', 'Failure', 'Override', 'Pivot', 'Cut'];

export default function LearningLogPage() {
  const [filter, setFilter] = useState<LearningEventType | 'All'>('All');

  const filtered = learningEvents.filter((e) =>
    filter === 'All' || e.eventType === filter
  );

  const overrideCount = learningEvents.filter((e) => e.overridden).length;
  const followedCount = learningEvents.filter((e) => !e.overridden).length;
  const overrideRate = overrideCount / learningEvents.length;
  const successRate = learningEvents.filter((e) => e.eventType === 'Sale' || e.eventType === 'Launch').length / learningEvents.length;

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Learning Log"
        subtitle="Turn outcomes into tuning"
      />

      <div className="px-4 md:px-8 py-6 space-y-5">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPIStatCard label="Total Events" value={learningEvents.length.toString()} />
          <KPIStatCard label="Recommendations Followed" value={followedCount.toString()} />
          <KPIStatCard label="Override Rate" value={formatPercent(overrideRate)} change={overrideRate > 0.3 ? 'High — review needed' : 'Within bounds'} trend={overrideRate > 0.3 ? 'down' : 'flat'} />
          <KPIStatCard label="Positive Outcome Rate" value={formatPercent(successRate)} />
        </div>

        {/* Trend placeholders */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="text-[11px] text-muted uppercase tracking-wider mb-3">Recommendation Accuracy Trend</div>
            <div className="h-20 flex items-end gap-1">
              {[65, 72, 68, 78, 74, 82, 79, 85].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-accent/30"
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-muted font-mono">W1</span>
              <span className="text-[10px] text-muted font-mono">W8</span>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-[11px] text-muted uppercase tracking-wider mb-3">Override Trend</div>
            <div className="h-20 flex items-end gap-1">
              {[45, 38, 42, 30, 35, 25, 28, 20].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-caution/30"
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-muted font-mono">W1</span>
              <span className="text-[10px] text-muted font-mono">W8</span>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1">
          {typeFilters.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                'px-2.5 py-1.5 text-[12px] font-medium rounded-md transition-colors',
                filter === type
                  ? 'bg-accent-subtle text-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card-hover'
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Event list */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Events</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filtered.map((event) => (
              <LearningEventRow key={event.id} event={event} />
            ))}
          </CardContent>
        </Card>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[13px] text-muted-foreground">No learning events match the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
