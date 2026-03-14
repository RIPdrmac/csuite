import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AdaptiveInsight } from '@/types';
import { Sparkles } from 'lucide-react';

interface AdaptiveInsightPanelProps {
  insights: AdaptiveInsight[];
}

const biasLabels: Record<string, string> = {
  speed: 'Speed',
  clarity: 'Clarity',
  revenue: 'Revenue',
  repeatability: 'Repeat.',
  focus: 'Focus',
};

export function AdaptiveInsightPanel({ insights }: AdaptiveInsightPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        <CardTitle>Adaptive CSUITE</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 py-3">
        <p className="text-[11px] text-muted uppercase tracking-wider">
          What elite operators would emphasize right now
        </p>
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="py-2 border-t border-border first:border-0 first:pt-0"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-accent/80 uppercase tracking-wider">
                {biasLabels[insight.bias]}
              </span>
              {insight.priority === 'high' && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {insight.message}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
