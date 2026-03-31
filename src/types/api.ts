// ---------------------------------------------------------------------------
// SEL_Events — słownik kategorii (men/women itp.)
// Dostosuj nazwy pól do rzeczywistej odpowiedzi API
// ---------------------------------------------------------------------------
export interface ApiEvent {
  code: string;         // np. "FBL-M-TEAM-TEM"
  gender: string;       // np. "M" | "W"
  description: string;  // np. "Men's Football"
}

export interface EventsResponse {
  events: ApiEvent[];
}

// Słownik code → ApiEvent, budowany po zaciągnięciu eventsUrl
export type EventsDict = Record<string, ApiEvent>;

// ---------------------------------------------------------------------------
// SCH_StartList — terminarz meczów
// Dostosuj nazwy pól do rzeczywistej odpowiedzi API
// ---------------------------------------------------------------------------
export interface ApiCompetitor {
  noc: string;          // kod kraju, np. "FRA"
  name: string;         // np. "France"
  order: number;        // 1 = home, 2 = away
  results?: {
    score?: string;
  };
}

export interface ApiUnit {
  code: string;                // unikalny kod meczu
  eventCode: string;           // klucz do EventsDict
  startDate: string;           // ISO 8601
  venue?: { description: string };
  status?: { code: string };   // np. "FINISHED" | "SCHEDULED" | "RUNNING"
  competitors: ApiCompetitor[];
}

export interface ScheduleResponse {
  units: ApiUnit[];
}
