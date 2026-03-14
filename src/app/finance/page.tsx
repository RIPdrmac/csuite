'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KPIStatCard } from '@/components/csuite/kpi-stat-card';
import { kpiStats } from '@/data/mock';
import {
  budgetTracker,
  spendRecommendations,
  products,
  launchDeals,
  platformStrategies,
} from '@/data/products';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Target, Zap, ShoppingCart, BarChart3 } from 'lucide-react';

export default function FinancePage() {
  const liveProducts = products.filter((p) => p.status === 'live');
  const totalPotentialRevenue = products.reduce((sum, p) => {
    if (p.status === 'live' || p.status === 'staging') {
      return sum + p.tiers.starter.price * 10; // 10 sales estimate
    }
    return sum;
  }, 0);

  const avgStarterPrice = products.filter(p => p.status === 'live').reduce((s, p) => s + p.tiers.starter.price, 0) / liveProducts.length;
  const avgProPrice = products.filter(p => p.status === 'live').reduce((s, p) => s + p.tiers.pro.price, 0) / liveProducts.length;
  const avgSaasPrice = products.filter(p => p.status === 'live').reduce((s, p) => s + p.tiers.agency.price, 0) / liveProducts.length;

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Finance"
        subtitle="Budget, revenue, spend allocation, and pricing intelligence"
      />

      <div className="px-4 md:px-8 py-6 space-y-5">
        {/* Top-line KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPIStatCard label="Total Revenue" value={formatCurrency(kpiStats.totalRevenue)} change={`${formatCurrency(kpiStats.currentDailyPace)}/day pace`} trend={kpiStats.currentDailyPace >= kpiStats.requiredDailyPace ? 'up' : 'down'} />
          <KPIStatCard label="Ad Budget Left" value={formatCurrency(budgetTracker.remaining)} change={`of ${formatCurrency(budgetTracker.totalBudget)} total`} trend={budgetTracker.remaining > 250 ? 'up' : 'down'} />
          <KPIStatCard label="ROAS" value={budgetTracker.spent > 0 ? `${budgetTracker.roas.toFixed(1)}x` : 'N/A'} change={budgetTracker.spent > 0 ? 'From ad spend' : 'No spend yet'} trend="flat" />
          <KPIStatCard label="Organic Revenue" value={formatCurrency(budgetTracker.organicRevenue)} change="$0 ad cost" trend="up" />
        </div>

        {/* Revenue breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPIStatCard label="Template Sales" value={formatCurrency(kpiStats.templateRevenue)} />
          <KPIStatCard label="Affiliate Revenue" value={formatCurrency(kpiStats.affiliateRevenue)} change={formatPercent(kpiStats.affiliateAttachAvg) + ' attach rate'} trend="up" />
          <KPIStatCard label="Avg Order Value" value={formatCurrency(kpiStats.avgOrderValue)} />
          <KPIStatCard label="Target Gap" value={formatCurrency(kpiStats.gap)} change={`${kpiStats.daysLeft} days left`} trend="down" />
        </div>

        {/* $500 Budget — 5 Spend Recommendations */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Target className="w-4 h-4 text-accent" />
            <CardTitle>$500 Ad Budget — 5 Spend Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {spendRecommendations.map((rec, i) => (
              <div
                key={rec.id}
                className={cn(
                  'px-4 py-4 hover:bg-card-hover transition-colors',
                  i !== spendRecommendations.length - 1 && 'border-b border-border'
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[14px] font-medium text-foreground">{rec.title}</h4>
                      <Badge variant="accent">{formatCurrency(rec.allocation)}</Badge>
                      <Badge variant={rec.confidence === 'High' ? 'success' : rec.confidence === 'Solid' ? 'info' : 'caution'}>
                        {rec.confidence}
                      </Badge>
                    </div>
                    <p className="text-[12px] text-muted-foreground">{rec.rationale}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[11px] text-muted uppercase">Expected ROAS</div>
                    <div className="text-lg font-mono font-semibold text-success">{rec.expectedROAS}x</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-caution" />
                  <span className="text-[11px] text-caution/80">{rec.risk}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Budget allocation visual */}
        <Card className="p-4">
          <div className="text-[11px] text-muted uppercase tracking-wider mb-3">Budget Allocation — $500 Total</div>
          <div className="flex h-8 rounded-lg overflow-hidden gap-0.5">
            {spendRecommendations.map((rec, i) => {
              const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-rose-500'];
              const width = (rec.allocation / budgetTracker.totalBudget) * 100;
              return (
                <div
                  key={rec.id}
                  className={cn('flex items-center justify-center text-[10px] font-mono text-white font-semibold', colors[i])}
                  style={{ width: `${width}%` }}
                >
                  ${rec.allocation}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted">
            <span>BarberBook $150</span>
            <span>ChurchOS $50</span>
            <span>DJBook $100</span>
            <span>FreelanceOS $100</span>
            <span>Reserve $100</span>
          </div>
        </Card>

        {/* $100 Kill Threshold */}
        <div className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-[13px] font-medium text-foreground">$100 Kill Threshold Active</div>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              If any product generates $0 revenue after $100 ad spend, CSUITE will auto-recommend cutting it and reallocating budget to winners. No exceptions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Pricing Tiers */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Tiers — Market Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 py-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-border bg-card-hover text-center">
                  <div className="text-[10px] text-muted uppercase tracking-wider">Starter</div>
                  <div className="text-xl font-mono font-semibold text-foreground mt-1">{formatCurrency(avgStarterPrice)}</div>
                  <div className="text-[10px] text-muted mt-0.5">avg / mo</div>
                  <div className="text-[11px] text-success mt-2">Volume play</div>
                </div>
                <div className="p-3 rounded-lg border border-accent/30 bg-accent-subtle text-center">
                  <div className="text-[10px] text-accent uppercase tracking-wider font-semibold">Pro</div>
                  <div className="text-xl font-mono font-semibold text-foreground mt-1">{formatCurrency(avgProPrice)}</div>
                  <div className="text-[10px] text-muted mt-0.5">avg / mo</div>
                  <div className="text-[11px] text-accent mt-2">Sweet spot</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card-hover text-center">
                  <div className="text-[10px] text-muted uppercase tracking-wider">Agency</div>
                  <div className="text-xl font-mono font-semibold text-foreground mt-1">{formatCurrency(avgSaasPrice)}</div>
                  <div className="text-[10px] text-muted mt-0.5">avg / mo</div>
                  <div className="text-[11px] text-caution mt-2">High ARPU</div>
                </div>
              </div>
              <p className="text-[12px] text-muted-foreground">
                Market analysis: Starter pricing is competitive with Notion/Airtable templates ($97-$197). Pro tier undercuts custom development ($2K-$5K). Agency tier competes with vertical Agency ($500-$2K/mo).
              </p>
            </CardContent>
          </Card>

          {/* Launch Deals */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-caution" />
              <CardTitle>Launch Deals — Active Promotions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 py-3">
              {launchDeals.map((deal) => (
                <div key={deal.id} className="p-3 rounded-lg border border-border hover:bg-card-hover transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-foreground">{deal.name}</span>
                      <Badge variant="caution">{deal.discount}% OFF</Badge>
                    </div>
                    <span className="text-[11px] font-mono text-muted">
                      {deal.redemptions}/{deal.maxRedemptions}
                    </span>
                  </div>
                  <p className="text-[12px] text-muted-foreground">{deal.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-muted">Valid until {deal.validUntil}</span>
                    <span className="text-[11px] font-mono text-success">
                      Projected: {formatCurrency(deal.projectedRevenue)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Platform Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <ShoppingCart className="w-3.5 h-3.5 text-info" />
            <CardTitle>Platform Distribution Strategy</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {platformStrategies.map((ps, i) => (
              <div
                key={ps.platform}
                className={cn(
                  'px-4 py-3 hover:bg-card-hover transition-colors',
                  i !== platformStrategies.length - 1 && 'border-b border-border'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-foreground">{ps.platform}</span>
                    <Badge variant={ps.priority === 'primary' ? 'success' : ps.priority === 'secondary' ? 'info' : 'default'}>
                      {ps.priority}
                    </Badge>
                  </div>
                  <span className="text-[11px] font-mono text-muted">{ps.fee}</span>
                </div>
                <p className="text-[12px] text-muted-foreground">{ps.rationale}</p>
                <div className="text-[11px] text-accent mt-1">Products: {ps.products.join(', ')}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue Path to $10K */}
        <Card className="p-4">
          <div className="text-[11px] text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Path to $10K — Revenue Scenarios
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  {['Scenario', 'Avg Price', 'Sales Needed', 'Daily Sales', 'Affiliate/mo', 'Total'].map((h) => (
                    <th key={h} className="text-left text-[11px] text-muted uppercase tracking-wider font-medium px-3 py-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Starter Focus', price: 180, sales: 45, affiliate: 500, total: 8600 },
                  { name: 'Pro Focus', price: 380, sales: 22, affiliate: 800, total: 9160 },
                  { name: 'Agency + Launch Deal', price: 499, sales: 15, affiliate: 1200, total: 8685 },
                  { name: 'Blended (recommended)', price: 290, sales: 28, affiliate: 900, total: 9020 },
                ].map((s, i) => (
                  <tr key={s.name} className={cn('border-b border-border last:border-0', i === 3 && 'bg-accent-subtle')}>
                    <td className="px-3 py-2 text-[13px] font-medium text-foreground">{s.name}</td>
                    <td className="px-3 py-2 text-[13px] font-mono text-foreground">{formatCurrency(s.price)}</td>
                    <td className="px-3 py-2 text-[13px] font-mono text-foreground">{s.sales}</td>
                    <td className="px-3 py-2 text-[13px] font-mono text-foreground">{(s.sales / 30).toFixed(1)}</td>
                    <td className="px-3 py-2 text-[13px] font-mono text-foreground">{formatCurrency(s.affiliate)}</td>
                    <td className="px-3 py-2 text-[13px] font-mono font-semibold text-foreground">{formatCurrency(s.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
