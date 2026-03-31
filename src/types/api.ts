// ---------------------------------------------------------------------------
// SEL_Events — category dictionary (men/women etc.)
// Top-level key: "events"
// ---------------------------------------------------------------------------
export interface ApiEventPhase {
  code: string;
  description: string;
  shortDescription: string;
  type: string;
  order?: string;
}

export interface ApiEvent {
  code: string;
  description: string;
  longDescription: string;
  isTeam: boolean;
  phases: ApiEventPhase[];
}

export interface EventsResponse {
  events: ApiEvent[];
}

// Keyed by trimmed event code (22-char prefix of match code)
export type EventsDict = Record<string, ApiEvent>;

// ---------------------------------------------------------------------------
// SCH_StartList — match schedule
// Top-level key: "schedules"
// ---------------------------------------------------------------------------
export interface ApiParticipant {
  code: string;
  name: string;
  shortName: string;
  organisation: {
    code: string;       // country code, e.g. "ESP"
    description: string;
  };
}

export interface ApiStartEntry {
  sortOrder: number;    // 1 = home, 2 = away
  startOrder: number;
  teamCode: string;
  participant: ApiParticipant;
}

export interface ApiScheduleItem {
  code: string;         // e.g. "FBLWTEAM11------------GPC-000100--"
  startDate: string;    // ISO 8601
  endDate: string;
  status: {
    code: string;       // "FINISHED" | "SCHEDULED" | "RUNNING"
    description: string;
  };
  venue: {
    description: string;
  };
  location: {
    description: string;
  };
  start: ApiStartEntry[];
  result: {
    status: {
      code: string;     // "OFFICIAL" | ...
      description: string;
    };
  };
}

export interface ScheduleResponse {
  schedules: ApiScheduleItem[];
}

// ---------------------------------------------------------------------------
// RES_ByRSC_H2H — match result
// ---------------------------------------------------------------------------
export interface ApiResultItem {
  sortOrder: number;    // 1 = home, 2 = away
  teamCode: string;
  resultData: string;  // final score as string, e.g. "2"
  resultWLT: 'W' | 'L' | 'D';
  participant: { name: string };
}

export interface ApiResultPeriod {
  p_code: string;       // "H1" | "H2" | "TOT"
  home: { score: string };
  away: { score: string };
}

export interface ApiMatchResult {
  items: ApiResultItem[];
  periods: ApiResultPeriod[];
  status: { code: string };
}

export interface ResultResponse {
  results: ApiMatchResult;
}

export interface MatchScore {
  home: string;
  away: string;
}

// Keyed by match code
export type ResultsDict = Record<string, MatchScore>;
