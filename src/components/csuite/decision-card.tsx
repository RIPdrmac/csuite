'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModeBadge } from './mode-badge';
import { ConfidenceBadge } from './confidence-badge';
import { Decision, ConsequenceClass } from '@/types';
import { Check, X, Edit3, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

const consequenceColors: Record<ConsequenceClass, string> = {
  'Critical': 'text-danger',
  'High': 'text-caution',
  'Medium': 'text-info',
  'Low': 'text-muted',
};

const statusVariant: Record<string, 'default' | 'accent' | 'success' | 'caution' | 'danger' | 'info'> = {
  'Drafting': 'default',
  'Deliberating': 'caution',
  'Awaiting approval': 'accent',
  'Approved': 'success',
  'Overridden': 'danger',
  'Executed': 'info',
  'Logged': 'default',
  'Outcome recorded': 'success',
};

interface DecisionCardProps {
  decision: Decision;
  expanded?: boolean;
}

export function DecisionCard({ decision, expanded }: DecisionCardProps) {
  return (
    <Card hover className="overflow-hidden">
      <div className="px-4 py-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-medium text-foreground truncate">
              {decision.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[12px] text-muted-foreground">{decision.offerName}</span>
              <span className="text-muted">·</span>
              <span className="text-[12px] text-muted-foreground">{decision.decisionType}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <ModeBadge mode={decision.mode} />
            {decision.vetoed && (
              <Badge variant="danger">
                <Flag className="w-3 h-3 mr-1" />
                VETOED
              </Badge>
            )}
          </div>
        </div>

        {/* Status & Confidence row */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={statusVariant[decision.status] || 'default'}>
            {decision.status}
          </Badge>
          <ConfidenceBadge level={decision.confidence} />
          <span className={cn('text-[11px] font-mono', consequenceColors[decision.consequenceClass])}>
            {decision.consequenceClass}
          </span>
        </div>

        {/* Recommendation */}
        {expanded && (
          <>
            <div className="mb-3">
              <div className="text-[11px] text-muted uppercase tracking-wider mb-1">
                Lead Recommendation
              </div>
              <p className="text-[13px] text-foreground leading-relaxed">
                {decision.leadRecommendation}
              </p>
            </div>

            {decision.dissentSummary && decision.dissentSummary !== 'None.' && (
              <div className="mb-3">
                <div className="text-[11px] text-caution/80 uppercase tracking-wider mb-1">
                  Dissent
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {decision.dissentSummary}
                </p>
              </div>
            )}

            {/* Confidence bar placeholder */}
            <div className="mb-3">
              <div className="text-[11px] text-muted uppercase tracking-wider mb-1.5">
                ACS / TCS
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '72%' }} />
                  </div>
                  <span className="text-[10px] text-muted mt-0.5 block">ACS 72%</span>
                </div>
                <div className="flex-1">
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-info rounded-full" style={{ width: '58%' }} />
                  </div>
                  <span className="text-[10px] text-muted mt-0.5 block">TCS 58%</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Button size="sm" variant="default">
                <Check className="w-3 h-3 mr-1" />
                Approve
              </Button>
              <Button size="sm" variant="secondary">
                <Edit3 className="w-3 h-3 mr-1" />
                Modify
              </Button>
              <Button size="sm" variant="danger">
                <X className="w-3 h-3 mr-1" />
                Override
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
