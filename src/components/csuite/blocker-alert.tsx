import { AlertTriangle, AlertCircle } from 'lucide-react';
import { Blocker } from '@/types';
import { cn } from '@/lib/utils';

interface BlockerAlertProps {
  blocker: Blocker;
}

export function BlockerAlert({ blocker }: BlockerAlertProps) {
  const isCritical = blocker.severity === 'critical';
  const Icon = isCritical ? AlertCircle : AlertTriangle;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border px-4 py-3',
        isCritical
          ? 'border-danger/30 bg-danger/5'
          : 'border-caution/30 bg-caution/5'
      )}
    >
      <Icon
        className={cn(
          'w-4 h-4 flex-shrink-0 mt-0.5',
          isCritical ? 'text-danger' : 'text-caution'
        )}
      />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-foreground">{blocker.title}</div>
        <div className="text-[12px] text-muted-foreground mt-0.5">{blocker.description}</div>
        <div className="text-[12px] text-accent mt-1">{blocker.suggestedAction}</div>
      </div>
    </div>
  );
}
