import { PageHeader } from '@/components/layout/page-header';
import { PassTracker } from '@/components/csuite/pass-tracker';
import { AgentRecommendationCard } from '@/components/csuite/agent-recommendation-card';
import { BlockerAlert } from '@/components/csuite/blocker-alert';
import { AdaptiveInsightPanel } from '@/components/csuite/adaptive-insight-panel';
import { ActivityFeed } from '@/components/csuite/activity-feed';
import { DecisionCard } from '@/components/csuite/decision-card';
import { KPIStatCard } from '@/components/csuite/kpi-stat-card';
import { CountdownClocks } from '@/components/csuite/countdown-clocks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  kpiStats,
  agentRecommendations,
  blockers,
  adaptiveInsights,
  activityEvents,
  decisions,
  todos,
} from '@/data/mock';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';

export default function CommandCenter() {
  const openDecisions = decisions.filter(
    (d) => d.status === 'Awaiting approval' || d.status === 'Deliberating'
  );

  const urgentTodos = todos.filter((t) => t.status !== 'done' && (t.priority === 'critical' || t.priority === 'high'));

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Command Center"
        subtitle="What changes the outcome today?"
      />

      <div className="px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left column — main content */}
          <div className="lg:col-span-8 space-y-5">
            {/* Countdown clocks */}
            <CountdownClocks />

            {/* Pass Tracker — dominant hero */}
            <PassTracker stats={kpiStats} />

            {/* Financial Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KPIStatCard label="Websites Created" value={kpiStats.websitesCreated.toString()} />
              <KPIStatCard label="Websites Sold" value={kpiStats.websitesSold.toString()} change={`${((kpiStats.websitesSold / kpiStats.websitesCreated) * 100).toFixed(0)}% sell-through`} trend="up" />
              <KPIStatCard label="Template Revenue" value={formatCurrency(kpiStats.templateRevenue)} />
              <KPIStatCard label="Affiliate Revenue" value={formatCurrency(kpiStats.affiliateRevenue)} change="+$40 this week" trend="up" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <KPIStatCard label="Avg Order Value" value={formatCurrency(kpiStats.avgOrderValue)} />
              <KPIStatCard label="Ad Spend" value={formatCurrency(kpiStats.adSpend)} />
              <KPIStatCard label="ROAS" value={`${kpiStats.roas.toFixed(1)}x`} change="Above 3x threshold" trend="up" />
              <KPIStatCard label="Affiliate Attach" value={formatPercent(kpiStats.affiliateAttachAvg)} change="Target: 60%+" trend={kpiStats.affiliateAttachAvg >= 0.6 ? 'up' : 'flat'} />
            </div>

            {/* Blockers */}
            {blockers.length > 0 && (
              <div className="space-y-2">
                {blockers.map((blocker) => (
                  <BlockerAlert key={blocker.id} blocker={blocker} />
                ))}
              </div>
            )}

            {/* Urgent TODOs */}
            {urgentTodos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Urgent Tasks</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {urgentTodos.slice(0, 5).map((todo, i) => {
                    const Icon = todo.status === 'in-progress' ? Clock : todo.status === 'done' ? CheckCircle2 : Circle;
                    const color = todo.status === 'in-progress' ? 'text-accent' : todo.status === 'done' ? 'text-success' : 'text-muted';
                    return (
                      <div
                        key={todo.id}
                        className={`flex items-center gap-3 px-4 py-2.5 ${i !== urgentTodos.slice(0, 5).length - 1 ? 'border-b border-border' : ''}`}
                      >
                        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${color}`} />
                        <span className="text-[13px] text-foreground flex-1 truncate">{todo.title}</span>
                        {todo.dueDate && (
                          <span className="text-[11px] font-mono text-muted flex-shrink-0">{todo.dueDate}</span>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Agent Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {agentRecommendations.map((rec) => (
                    <div key={rec.agent} className="px-4">
                      <AgentRecommendationCard recommendation={rec} compact />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Open Decision Queue Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Open Decision Queue</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 py-3">
                {openDecisions.map((decision) => (
                  <DecisionCard key={decision.id} decision={decision} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right rail — contextual */}
          <div className="lg:col-span-4 space-y-5">
            <AdaptiveInsightPanel insights={adaptiveInsights} />
            <ActivityFeed events={activityEvents} />
          </div>
        </div>
      </div>
    </div>
  );
}
