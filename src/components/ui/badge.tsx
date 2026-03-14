import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase',
  {
    variants: {
      variant: {
        default: 'bg-card text-muted-foreground border border-border',
        accent: 'bg-accent-subtle text-accent border border-accent/20',
        success: 'bg-success/10 text-success border border-success/20',
        caution: 'bg-caution/10 text-caution border border-caution/20',
        danger: 'bg-danger/10 text-danger border border-danger/20',
        info: 'bg-info/10 text-info border border-info/20',
        muted: 'bg-card text-muted border border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
