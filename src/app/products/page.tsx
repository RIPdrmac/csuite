'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KPIStatCard } from '@/components/csuite/kpi-stat-card';
import { products, type ProductStatus, type Product } from '@/data/products';
import { formatCurrency, cn } from '@/lib/utils';
import {
  Plus, CheckCircle2, AlertCircle, Circle, Wrench, Calendar,
  ExternalLink, Globe, Package, Layers,
} from 'lucide-react';

const statusConfig: Record<ProductStatus, { label: string; variant: 'success' | 'accent' | 'caution' | 'info' | 'default' | 'danger'; icon: typeof Circle }> = {
  live: { label: 'Available', variant: 'success', icon: CheckCircle2 },
  staging: { label: 'Created', variant: 'accent', icon: Layers },
  building: { label: 'Building', variant: 'caution', icon: Wrench },
  planned: { label: 'Planned', variant: 'default', icon: Calendar },
  cut: { label: 'Cut', variant: 'danger', icon: AlertCircle },
};

const statusFilters: (ProductStatus | 'all')[] = ['all', 'live', 'staging', 'building', 'planned'];

export default function ProductsPage() {
  const [filter, setFilter] = useState<ProductStatus | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'all' ? products : products.filter(p => p.status === filter);

  const liveCount = products.filter(p => p.status === 'live').length;
  const stagingCount = products.filter(p => p.status === 'staging').length;
  const buildingCount = products.filter(p => p.status === 'building').length;
  const totalTiers = products.reduce((s, p) => s + 3, 0); // 3 tiers each

  return (
    <div className="min-h-screen">
      <PageHeader title="Digital Products" subtitle="SOVD template inventory — your product line">
        <Button size="sm"><Plus className="w-3.5 h-3.5 mr-1.5" />New Template</Button>
      </PageHeader>

      <div className="px-4 md:px-8 py-6 space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPIStatCard label="Total Templates" value={products.length.toString()} />
          <KPIStatCard label="Available (on sale)" value={liveCount.toString()} change="Listed on LemonSqueezy" trend="up" />
          <KPIStatCard label="Created (staging)" value={stagingCount.toString()} change="Ready to list" trend="flat" />
          <KPIStatCard label="Building" value={buildingCount.toString()} />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {statusFilters.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'px-3 py-1.5 text-[12px] font-medium rounded-lg transition-colors whitespace-nowrap',
                filter === s ? 'bg-accent-subtle text-accent' : 'text-muted-foreground hover:text-foreground hover:bg-card-hover'
              )}
            >
              {s === 'all' ? 'All' : statusConfig[s].label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="space-y-3">
          {filtered.map(product => {
            const config = statusConfig[product.status];
            const StatusIcon = config.icon;
            const isExpanded = expanded === product.id;

            return (
              <Card key={product.id} hover className="overflow-hidden">
                <button
                  onClick={() => setExpanded(isExpanded ? null : product.id)}
                  className="w-full text-left px-5 py-4"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3 className="text-[15px] font-semibold text-foreground">{product.name}</h3>
                        <Badge variant={config.variant}>
                          <StatusIcon className="w-3 h-3 mr-1" />{config.label}
                        </Badge>
                      </div>
                      <p className="text-[12px] text-muted-foreground">{product.niche}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[11px] text-muted uppercase">Starter / Pro / Agency</div>
                      <div className="text-[14px] font-mono font-semibold text-foreground">
                        {formatCurrency(product.tiers.starter.price)} / {formatCurrency(product.tiers.pro.price)} / {formatCurrency(product.tiers.agency.price)}
                      </div>
                    </div>
                  </div>

                  {/* Readiness indicators */}
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className={product.logoReady ? 'text-success' : 'text-muted'}>
                      {product.logoReady ? '✓' : '✗'} Logo
                    </span>
                    <span className={product.landingPageReady ? 'text-success' : 'text-muted'}>
                      {product.landingPageReady ? '✓' : '✗'} Landing Page
                    </span>
                    <span className={product.templateCompiles ? 'text-success' : 'text-muted'}>
                      {product.templateCompiles ? '✓' : '✗'} Compiles
                    </span>
                    <span className="text-muted">·</span>
                    <span className="text-muted-foreground">
                      {product.platforms.join(', ')}
                    </span>
                    {product.lastTestedAt && (
                      <>
                        <span className="text-muted">·</span>
                        <span className="text-muted">Tested {product.lastTestedAt}</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-border space-y-4">
                    <p className="text-[13px] text-muted-foreground leading-relaxed pt-3">{product.description}</p>

                    {/* Three tier breakdown */}
                    <div className="grid grid-cols-3 gap-3">
                      {(['starter', 'pro', 'agency'] as const).map(tier => (
                        <div key={tier} className={cn(
                          'p-3 rounded-lg border',
                          tier === 'pro' ? 'border-accent/30 bg-accent-subtle' : 'border-border bg-card-hover'
                        )}>
                          <div className={cn('text-[10px] uppercase tracking-wider mb-1 font-semibold', tier === 'pro' ? 'text-accent' : 'text-muted')}>
                            {tier}
                          </div>
                          <div className="text-lg font-mono font-semibold text-foreground mb-2">
                            {formatCurrency(product.tiers[tier].price)}<span className="text-[11px] text-muted font-normal"></span>
                          </div>
                          <ul className="space-y-1">
                            {product.tiers[tier].features.map((f, i) => (
                              <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                                <span className="text-success mt-0.5">·</span>{f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Affiliate stack */}
                    <div>
                      <div className="text-[11px] text-muted uppercase tracking-wider mb-1.5">Affiliate Stack</div>
                      <div className="flex flex-wrap gap-1.5">
                        {product.affiliateStack.map(a => (
                          <span key={a} className="px-2 py-1 text-[11px] rounded-md bg-card-hover border border-border text-muted-foreground">{a}</span>
                        ))}
                      </div>
                    </div>

                    {/* Target & metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <div className="text-[10px] text-muted uppercase">Target Audience</div>
                        <div className="text-[12px] text-foreground mt-0.5">{product.targetAudience}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted uppercase">Search Volume</div>
                        <div className="text-[12px] text-foreground mt-0.5 capitalize">{product.searchVolume}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted uppercase">Competition</div>
                        <div className="text-[12px] text-foreground mt-0.5 capitalize">{product.competition}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted uppercase">Est. Conversion</div>
                        <div className="text-[12px] text-foreground mt-0.5">{(product.estimatedConversion * 100).toFixed(1)}%</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      {product.status === 'staging' && (
                        <Button size="sm" variant="default">
                          <Globe className="w-3.5 h-3.5 mr-1.5" />List on LemonSqueezy
                        </Button>
                      )}
                      {product.status === 'live' && (
                        <Button size="sm" variant="secondary">
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />View Listing
                        </Button>
                      )}
                      <Button size="sm" variant="secondary">
                        <Package className="w-3.5 h-3.5 mr-1.5" />Edit Template
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
