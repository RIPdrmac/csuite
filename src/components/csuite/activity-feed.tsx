import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ActivityEvent } from '@/types';
import { Package, GitBranch, BookOpen, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeConfig: Record<string, { icon: typeof Package; color: string }> = {
  offer: { icon: Package, color: 'text-blue-400' },
  decision: { icon: GitBranch, color: 'text-violet-400' },
  learning: { icon: BookOpen, color: 'text-emerald-400' },
  system: { icon: Zap, color: 'text-amber-400' },
};

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {events.map((event, i) => {
          const config = typeConfig[event.type];
          const Icon = config.icon;
          return (
            <div
              key={event.id}
              className={cn(
                'flex items-start gap-3 px-4 py-2.5',
                i !== events.length - 1 && 'border-b border-border'
              )}
            >
              <Icon className={cn('w-3.5 h-3.5 mt-0.5 flex-shrink-0', config.color)} />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-foreground">{event.title}</div>
                <div className="text-[12px] text-muted-foreground">{event.description}</div>
              </div>
              <span className="text-[11px] text-muted font-mono flex-shrink-0">
                {formatRelativeTime(event.timestamp)}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffHours = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));
  if (diffHours < 1) return 'now';
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.floor(diffHours / 24)}d`;
}
