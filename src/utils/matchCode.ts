import type { Gender, Phase } from '../types/filters';

export function getGender(code: string): Gender {
  return code.startsWith('FBLM') ? 'M' : 'W';
}

// Phase is encoded at chars 22–26 of the match code, e.g.:
// "FBLMTEAM11------------GPA-000100--" → "GPA"
// "FBLMTEAM11------------QFNL000100--" → "QFNL"
// "FBLMTEAM11------------FNL-000100--" → "FNL"
export function getPhase(code: string): Phase | null {
  const raw = code.slice(22, 26).replace(/-/g, '');
  if (!raw) return null;

  const map: Record<string, Phase> = {
    GPA: 'GPA', GPB: 'GPB', GPC: 'GPC', GPD: 'GPD',
    QFNL: 'QFNL', SFNL: 'SFNL', FNL: 'FNL',
  };

  // "GP" prefix covers GPA/GPB/GPC/GPD
  for (const key of Object.keys(map)) {
    if (raw.startsWith(key)) return map[key];
  }
  return null;
}
