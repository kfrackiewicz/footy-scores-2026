export type Gender = 'M' | 'W';

export type Phase =
  | 'GPA'
  | 'GPB'
  | 'GPC'
  | 'GPD'
  | 'QFNL'
  | 'SFNL'
  | 'FNL';

export const PHASE_LABELS: Record<Phase, string> = {
  GPA:  'Group A',
  GPB:  'Group B',
  GPC:  'Group C',
  GPD:  'Group D',
  QFNL: 'Quarter-finals',
  SFNL: 'Semi-finals',
  FNL:  'Final',
};

export interface Filters {
  genders: Gender[];
  phases: Phase[];
}

export const DEFAULT_FILTERS: Filters = {
  genders: ['M', 'W'],
  phases: ['GPA', 'GPB', 'GPC', 'GPD', 'QFNL', 'SFNL', 'FNL'],
};
