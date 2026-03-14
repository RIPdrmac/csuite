'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KPIStatCard } from '@/components/csuite/kpi-stat-card';
import { contentItems } from '@/data/mock';
import { ContentType, ContentStatus } from '@/types';
import { cn, formatNumber } from '@/lib/utils';
import { Plus, ExternalLink } from 'lucide-react';

const typeFilters: (ContentType | 'All')[] = ['All', 'Hook', 'Landing Page', 'CTA', 'Email', 'Ad', 'Affiliate', 'Outbound'];

const statusVariant: Record<ContentStatus, 'success' | 'caution' | 'default' | 'accent' | 'info' | 'muted'> = {
  'Draft': 'default',
  'Review': 'caution',
  'Active': 'success',
  'Testing': 'accent',
  'Paused': 'muted',
  'Archived': 'muted',
};

export default function ContentPage() {
  const [typeFilter, setTypeFilter] = useState<ContentType | 'All'>('All');

  const filtered = contentItems.filter((item) =>
    typeFilter === 'All' || item.type === typeFilter
  );

  // Group by type for section view
  const grouped = filtered.reduce((acc, item) => {
    const key = item.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof contentItems>);

  const activeCount = contentItems.filter((c) => c.status === 'Active').length;
  const testingCount = contentItems.filter((c) => c.status === 'Testing').length;
  const totalClicks = contentItems.reduce((sum, c) => sum + (c.metrics?.clicks || 0), 0);
  const totalConversions = contentItems.reduce((sum, c) => sum + (c.metrics?.conversions || 0), 0);

  return (
    <div className="min-h-screen">
      <PageHeader title="Content & GTM" subtitle="Operational marketing workspace">
        <Button size="sm">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          New Content
        </Button>
      </PageHeader>

      <div className="px-4 md:px-8 py-6 space-y-5">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPIStatCard label="Active Content" value={activeCount.toString()} />
          <KPIStatCard label="In Testing" value={testingCount.toString()} />
          <KPIStatCard label="Total Clicks" value={formatNumber(totalClicks)} change="+89 today" trend="up" />
          <KPIStatCard label="Conversions" value={totalConversions.toString()} />
        </div>

        {/* Type filters */}
        <div className="flex items-center gap-1">
          {typeFilters.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={cn(
                'px-2.5 py-1.5 text-[12px] font-medium rounded-md transition-colors',
                typeFilter === type
                  ? 'bg-accent-subtle text-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card-hover'
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Grouped sections */}
        {Object.entries(grouped).map(([type, items]) => (
          <Card key={type}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{type}s</CardTitle>
              <span className="text-[11px] font-mono text-muted">{items.length} items</span>
            </CardHeader>
            <CardContent className="p-0">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className={cn(
                    'px-4 py-3 hover:bg-card-hover transition-colors',
                    i !== items.length - 1 && 'border-b border-border'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-[13px] font-medium text-foreground truncate">
                          {item.title}
                        </h4>
                        <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                      </div>
                      {item.offerName && (
                        <span className="text-[12px] text-muted-foreground">{item.offerName}</span>
                      )}
                      <p className="text-[12px] text-muted mt-1">{item.content}</p>
                    </div>
                    {item.metrics && (
                      <div className="flex items-center gap-4 flex-shrink-0">
                        {item.metrics.impressions !== undefined && (
                          <div className="text-right">
                            <div className="text-[10px] text-muted uppercase">Impr.</div>
                            <div className="text-[12px] font-mono text-foreground">
                              {formatNumber(item.metrics.impressions)}
                            </div>
                          </div>
                        )}
                        {item.metrics.clicks !== undefined && (
                          <div className="text-right">
                            <div className="text-[10px] text-muted uppercase">Clicks</div>
                            <div className="text-[12px] font-mono text-foreground">
                              {formatNumber(item.metrics.clicks)}
                            </div>
                          </div>
                        )}
                        {item.metrics.conversions !== undefined && (
                          <div className="text-right">
                            <div className="text-[10px] text-muted uppercase">Conv.</div>
                            <div className="text-[12px] font-mono text-foreground">
                              {item.metrics.conversions}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
