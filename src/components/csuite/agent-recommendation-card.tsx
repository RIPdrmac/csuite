import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentRecommendation, AgentName } from '@/types';
import { ConfidenceBadge } from './confidence-badge';

const agentColors: Record<AgentName, string> = {
  PRODUCT: 'text-blue-400',
  GROWTH: 'text-emerald-400',
  FINANCE: 'text-amber-400',
  PROTOCOL: 'text-violet-400',
  BRAND: 'text-rose-400',
  TALENT: 'text-cyan-400',
};

interface AgentRecommendationCardProps {
  recommendation: AgentRecommendation;
  compact?: boolean;
}

export function AgentRecommendationCard({ recommendation, compact }: AgentRecommendationCardProps) {
  if (compact) {
    return (
      <div className="flex items-start gap-3 py-2.5 px-1">
        <span className={`text-[11px] font-mono font-semibold tracking-wider ${agentColors[recommendation.agent]} w-16 flex-shrink-0 pt-0.5`}>
          {recommendation.agent}
        </span>
        <p className="text-[13px] text-foreground leading-snug flex-1">
          {recommendation.recommendation}
        </p>
        <ConfidenceBadge level={recommendation.confidence} />
      </div>
    );
  }

  return (
    <Card hover className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[11px] font-mono font-semibold tracking-wider ${agentColors[recommendation.agent]}`}>
          {recommendation.agent}
        </span>
        <ConfidenceBadge level={recommendation.confidence} />
      </div>
      <p className="text-[13px] text-foreground leading-relaxed mb-2">
        {recommendation.recommendation}
      </p>
      <p className="text-[12px] text-muted-foreground leading-relaxed">
        {recommendation.rationale}
      </p>
      {recommendation.risk && (
        <p className="text-[12px] text-caution/80 mt-1.5">
          Risk: {recommendation.risk}
        </p>
      )}
    </Card>
  );
}
