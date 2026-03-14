import { Badge } from '@/components/ui/badge';
import { ConfidenceLevel } from '@/types';

const confidenceConfig: Record<ConfidenceLevel, { variant: 'success' | 'accent' | 'info' | 'caution' | 'danger' | 'muted' }> = {
  'Mastery': { variant: 'success' },
  'High': { variant: 'accent' },
  'Solid': { variant: 'info' },
  'Moderate': { variant: 'caution' },
  'Low': { variant: 'danger' },
  'Insufficient': { variant: 'muted' },
};

export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const config = confidenceConfig[level];
  return <Badge variant={config.variant}>{level}</Badge>;
}
