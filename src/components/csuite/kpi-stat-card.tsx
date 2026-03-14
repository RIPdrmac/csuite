import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPIStatCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'flat';
  className?: string;
}

export function KPIStatCard({ label, value, change, trend, className }: KPIStatCardProps) {
  return (
    <Card className={cn('px-4 py-3', className)}>
      <div className="text-[11px] text-muted uppercase tracking-wider font-medium">
        {label}
      </div>
      <div className="text-xl font-mono font-semibold text-foreground mt-1">
        {value}
      </div>
      {change && (
        <div
          className={cn(
            'text-[11px] font-mono mt-1',
            trend === 'up' && 'text-success',
            trend === 'down' && 'text-danger',
            trend === 'flat' && 'text-muted'
          )}
        >
          {change}
        </div>
      )}
    </Card>
  );
}
