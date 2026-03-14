import { Badge } from '@/components/ui/badge';
import { OfferStatus } from '@/types';

const stageConfig: Record<OfferStatus, { variant: 'default' | 'accent' | 'success' | 'caution' | 'info' | 'danger' }> = {
  'Idea': { variant: 'default' },
  'Building': { variant: 'accent' },
  'Live': { variant: 'success' },
  'Testing': { variant: 'caution' },
  'Scaling': { variant: 'info' },
  'Cut': { variant: 'danger' },
};

export function StageBadge({ status }: { status: OfferStatus }) {
  return <Badge variant={stageConfig[status].variant}>{status}</Badge>;
}
