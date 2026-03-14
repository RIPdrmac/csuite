import { Card } from '@/components/ui/card';
import { StageBadge } from './stage-badge';
import { Offer } from '@/types';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <Card hover className="overflow-hidden">
      <div className="px-4 py-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-medium text-foreground truncate">{offer.name}</h3>
            <span className="text-[12px] text-muted-foreground">{offer.niche}</span>
          </div>
          <StageBadge status={offer.status} />
        </div>

        <div className="grid grid-cols-4 gap-3 mt-3">
          <div>
            <div className="text-[11px] text-muted uppercase tracking-wider">Price</div>
            <div className="text-sm font-mono text-foreground">{formatCurrency(offer.price)}</div>
          </div>
          <div>
            <div className="text-[11px] text-muted uppercase tracking-wider">Traffic</div>
            <div className="text-sm font-mono text-foreground">{formatNumber(offer.traffic)}</div>
          </div>
          <div>
            <div className="text-[11px] text-muted uppercase tracking-wider">Conv.</div>
            <div className="text-sm font-mono text-foreground">{formatPercent(offer.conversionRate)}</div>
          </div>
          <div>
            <div className="text-[11px] text-muted uppercase tracking-wider">Revenue</div>
            <div className="text-sm font-mono text-foreground">{formatCurrency(offer.revenue)}</div>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-border flex items-center gap-2">
          <div className="text-[11px] text-muted uppercase tracking-wider">Affiliate</div>
          <div className="text-[12px] font-mono text-foreground">{formatPercent(offer.affiliateAttachRate)}</div>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-accent">
          <ArrowRight className="w-3 h-3" />
          <span className="text-[12px]">{offer.nextMove}</span>
        </div>
      </div>
    </Card>
  );
}
