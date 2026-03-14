'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { OfferCard } from '@/components/csuite/offer-card';
import { StageBadge } from '@/components/csuite/stage-badge';
import { KPIStatCard } from '@/components/csuite/kpi-stat-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { offers } from '@/data/mock';
import { OfferStatus } from '@/types';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import { Search, LayoutGrid, List, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusFilters: (OfferStatus | 'All')[] = ['All', 'Live', 'Testing', 'Building', 'Idea', 'Scaling', 'Cut'];

export default function OffersPage() {
  const [filter, setFilter] = useState<OfferStatus | 'All'>('All');
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [search, setSearch] = useState('');

  const filtered = offers.filter((offer) => {
    const matchesFilter = filter === 'All' || offer.status === filter;
    const matchesSearch = offer.name.toLowerCase().includes(search.toLowerCase()) ||
      offer.niche.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = offers.reduce((sum, o) => sum + o.revenue, 0);
  const liveCount = offers.filter((o) => o.status === 'Live').length;
  const avgConversion = offers.filter((o) => o.conversionRate > 0).reduce((sum, o, _, arr) => sum + o.conversionRate / arr.length, 0);

  return (
    <div className="min-h-screen">
      <PageHeader title="Offers" subtitle="Active template offers tied to revenue">
        <Button size="sm">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          New Offer
        </Button>
      </PageHeader>

      <div className="px-4 md:px-8 py-6 space-y-5">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPIStatCard label="Total Revenue" value={formatCurrency(totalRevenue)} change="+$340 today" trend="up" />
          <KPIStatCard label="Live Offers" value={liveCount.toString()} />
          <KPIStatCard label="Avg Conversion" value={formatPercent(avgConversion)} change="+0.3% vs last week" trend="up" />
          <KPIStatCard label="Total Offers" value={offers.length.toString()} />
        </div>

        {/* Filters + search */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 w-full md:w-auto">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  'px-2.5 py-1.5 text-[12px] font-medium rounded-md transition-colors',
                  filter === status
                    ? 'bg-accent-subtle text-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card-hover'
                )}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search offers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 pr-3 text-[13px] bg-card border border-border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 w-52"
              />
            </div>
            <div className="flex items-center border border-border rounded-md">
              <button
                onClick={() => setView('table')}
                className={cn('p-1.5', view === 'table' ? 'text-foreground bg-card-hover' : 'text-muted')}
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setView('grid')}
                className={cn('p-1.5', view === 'grid' ? 'text-foreground bg-card-hover' : 'text-muted')}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {view === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border">
                  {['Offer', 'Niche', 'Status', 'Price', 'Traffic', 'Conv.', 'Affiliate', 'Revenue', 'Next Move'].map((h) => (
                    <th key={h} className="text-left text-[11px] text-muted uppercase tracking-wider font-medium px-4 py-2.5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((offer) => (
                  <tr key={offer.id} className="border-b border-border last:border-0 hover:bg-card-hover transition-colors">
                    <td className="px-4 py-2.5 text-[13px] font-medium text-foreground max-w-[200px] truncate">
                      {offer.name}
                    </td>
                    <td className="px-4 py-2.5 text-[13px] text-muted-foreground">{offer.niche}</td>
                    <td className="px-4 py-2.5"><StageBadge status={offer.status} /></td>
                    <td className="px-4 py-2.5 text-[13px] font-mono text-foreground">{formatCurrency(offer.price)}</td>
                    <td className="px-4 py-2.5 text-[13px] font-mono text-foreground">{formatNumber(offer.traffic)}</td>
                    <td className="px-4 py-2.5 text-[13px] font-mono text-foreground">{formatPercent(offer.conversionRate)}</td>
                    <td className="px-4 py-2.5 text-[13px] font-mono text-foreground">{formatPercent(offer.affiliateAttachRate)}</td>
                    <td className="px-4 py-2.5 text-[13px] font-mono text-foreground font-medium">{formatCurrency(offer.revenue)}</td>
                    <td className="px-4 py-2.5 text-[12px] text-accent max-w-[180px] truncate">{offer.nextMove}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}
