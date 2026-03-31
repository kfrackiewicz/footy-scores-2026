import type { Phase, Filters } from './types/filters';

export const PHASE_LABELS: Record<Phase, string> = {
  GPA:  'Group A',
  GPB:  'Group B',
  GPC:  'Group C',
  GPD:  'Group D',
  QFNL: 'Quarter-finals',
  SFNL: 'Semi-finals',
  FNL:  'Final',
};

export const DEFAULT_FILTERS: Filters = {
  genders: ['M', 'W'],
  phases: ['GPA', 'GPB', 'GPC', 'GPD', 'QFNL', 'SFNL', 'FNL'],
};
