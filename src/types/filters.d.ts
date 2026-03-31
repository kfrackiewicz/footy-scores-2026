export type Gender = 'M' | 'W';

export type Phase =
  | 'GPA'
  | 'GPB'
  | 'GPC'
  | 'GPD'
  | 'QFNL'
  | 'SFNL'
  | 'FNL';

export interface Filters {
  genders: Gender[];
  phases: Phase[];
}
