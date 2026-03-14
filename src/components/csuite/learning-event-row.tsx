import { Badge } from '@/components/ui/badge';
import { LearningEvent, LearningEventType } from '@/types';
import { cn } from '@/lib/utils';
import { RotateCcw, Check } from 'lucide-react';

const eventTypeVariant: Record<LearningEventType, 'success' | 'info' | 'danger' | 'caution' | 'accent' | 'default'> = {
  'Launch': 'info',
  'Sale': 'success',
  'Failure': 'danger',
  'Override': 'caution',
  'Pivot': 'accent',
  'Cut': 'danger',
};

interface LearningEventRowProps {
  event: LearningEvent;
}

export function LearningEventRow({ event }: LearningEventRowProps) {
  return (
    <div className="px-4 py-3 border-b border-border last:border-0 hover:bg-card-hover transition-colors">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2">
          <Badge variant={eventTypeVariant[event.eventType]}>{event.eventType}</Badge>
          <h4 className="text-[13px] font-medium text-foreground">{event.title}</h4>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {event.overridden ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-caution">
              <RotateCcw className="w-3 h-3" />
              Overridden
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-success">
              <Check className="w-3 h-3" />
              Followed
            </span>
          )}
          <span className="text-[11px] font-mono text-muted">{event.date}</span>
        </div>
      </div>

      <p className="text-[12px] text-muted-foreground mb-1">{event.result}</p>
      <p className="text-[12px] text-muted">Rec: {event.recommendation}</p>
      <p className="text-[12px] text-accent/80 mt-1.5">
        Lesson: {event.lesson}
      </p>
    </div>
  );
}
