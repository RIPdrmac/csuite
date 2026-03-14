'use client';

import { Card } from '@/components/ui/card';
import { KPIStats } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface PassTrackerProps {
  stats: KPIStats;
}

export function PassTracker({ stats }: PassTrackerProps) {
  const progress = (stats.currentMRR / stats.targetMRR) * 100;
  const paceRatio = stats.currentDailyPace / stats.requiredDailyPace;
  const onTrack = paceRatio >= 0.8;

  return (
    <Card className="overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${onTrack ? 'bg-success' : 'bg-danger'} animate-pulse`} />
          <span className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
            30-Day Pass Tracker
          </span>
        </div>
        <span className="text-[12px] font-mono text-muted">
          {stats.daysLeft}d remaining
        </span>
      </div>

      {/* Main numbers */}
      <div className="px-5 py-5">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-semibold text-foreground tracking-tight font-mono">
            {formatCurrency(stats.currentMRR)}
          </span>
          <span className="text-[13px] text-muted-foreground">
            of {formatCurrency(stats.targetMRR)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${progress}%`,
              background: onTrack
                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                : 'linear-gradient(90deg, #ef4444, #f87171)',
            }}
          />
        </div>

        {/* Gap */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[12px] text-muted">
            Gap: <span className="text-foreground font-mono">{formatCurrency(stats.gap)}</span>
          </span>
          <span className="text-[12px] text-muted">
            {progress.toFixed(1)}% complete
          </span>
        </div>
      </div>

      {/* Pace comparison */}
      <div className="px-5 py-3 border-t border-border grid grid-cols-2 gap-4">
        <div>
          <div className="text-[11px] text-muted uppercase tracking-wider mb-1">
            Required pace
          </div>
          <div className="text-lg font-mono font-semibold text-foreground">
            {formatCurrency(stats.requiredDailyPace)}
            <span className="text-[11px] text-muted font-normal">/day</span>
          </div>
        </div>
        <div>
          <div className="text-[11px] text-muted uppercase tracking-wider mb-1">
            Current pace
          </div>
          <div className={`text-lg font-mono font-semibold ${onTrack ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(stats.currentDailyPace)}
            <span className="text-[11px] text-muted font-normal">/day</span>
          </div>
        </div>
      </div>

      {/* Bottom KPIs */}
      <div className="px-5 py-3 border-t border-border grid grid-cols-4 gap-3">
        {[
          { label: 'Total Offers', value: stats.totalOffers.toString() },
          { label: 'Live', value: stats.liveOffers.toString() },
          { label: 'Open Decisions', value: stats.openDecisions.toString() },
          { label: 'Avg Conv.', value: `${(stats.conversionAvg * 100).toFixed(1)}%` },
        ].map((kpi) => (
          <div key={kpi.label}>
            <div className="text-[11px] text-muted uppercase tracking-wider">{kpi.label}</div>
            <div className="text-sm font-mono font-medium text-foreground mt-0.5">{kpi.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
