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
          const isOffline = !navigator.onLine || err instanceof TypeError;
          const message = isOffline
            ? "Looks like you're offline... check your connection and try again."
            : `Hmm, something went wrong on our end. (${String(err)})`;
          setState((prev) => ({ ...prev, loading: false, error: message }));
        }
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [retryCount]);

  useEffect(() => {
    function handleOnline() {
      setState((prev) => {
        if (prev.error === null) return prev;
        return { ...prev, loading: true, error: null };
      });
      setRetryCount((n) => n + 1);
    }
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return { ...state, retry };
}
