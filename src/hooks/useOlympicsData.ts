import { useEffect, useState } from 'react';
import { API } from '../config/endpoints';
import type { ApiScheduleItem, EventsDict, EventsResponse, ScheduleResponse } from '../types/api';

interface State {
  matches: ApiScheduleItem[];
  events: EventsDict;
  loading: boolean;
  error: string | null;
}

export function useOlympicsData() {
  const [retryCount, setRetryCount] = useState(0);
  const [state, setState] = useState<State>({
    matches: [],
    events: {},
    loading: true,
    error: null,
  });

  function retry() {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setRetryCount((n) => n + 1);
  }

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

        // Key events by their 22-char code (matches the prefix of schedule item codes)
        const eventsDict: EventsDict = Object.fromEntries(
          eventsData.events.map((e) => [e.code, e]),
        );

        const sorted = schedule.schedules.filter((m) => m.start?.length >= 2).sort(
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
  }, [retryCount]);

  return { ...state, retry };
}
