import { Badge } from '@/components/ui/badge';
import { DecisionMode } from '@/types';

const modeConfig: Record<DecisionMode, { variant: 'success' | 'caution' | 'danger' }> = {
  'AUTO': { variant: 'success' },
  'HOLD': { variant: 'caution' },
  'OVER': { variant: 'danger' },
};

export function ModeBadge({ mode }: { mode: DecisionMode }) {
  return <Badge variant={modeConfig[mode].variant}>{mode}</Badge>;
}
