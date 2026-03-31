import { useEffect, useState } from 'react';
import { API } from '../config/endpoints';
import type { ApiUnit, EventsDict, EventsResponse, ScheduleResponse } from '../types/api';

interface State {
  matches: ApiUnit[];
  events: EventsDict;
  loading: boolean;
  error: string | null;
}

export function useOlympicsData() {
  const [state, setState] = useState<State>({
    matches: [],
    events: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const [scheduleRes, eventsRes] = await Promise.all([
          fetch(API.scheduleUrl),
          fetch(API.eventsUrl),
        ]);

        if (!scheduleRes.ok) throw new Error(`Schedule fetch failed: ${scheduleRes.status}`);
        if (!eventsRes.ok)   throw new Error(`Events fetch failed: ${eventsRes.status}`);

        const [schedule, eventsData]: [ScheduleResponse, EventsResponse] = await Promise.all([
          scheduleRes.json(),
          eventsRes.json(),
        ]);

        const eventsDict: EventsDict = Object.fromEntries(
          eventsData.events.map((e) => [e.code, e]),
        );

        const sorted = [...schedule.units].sort(
          (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        );

        if (!cancelled) {
          setState({ matches: sorted, events: eventsDict, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState((prev) => ({ ...prev, loading: false, error: String(err) }));
        }
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return state;
}
