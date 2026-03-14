import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, children, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between px-4 md:px-8 py-4 md:py-5 border-b border-border', className)}>
      <div>
        <h1 className="text-lg font-semibold text-foreground tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
