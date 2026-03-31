import { useEffect, useState } from 'react';
import { API } from '../config/endpoints';
import type { ApiEvent, ApiUnit, EventsDict } from '../types/api';

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

        const [schedule, eventsData] = await Promise.all([
          scheduleRes.json(),
          eventsRes.json(),
        ]);

        console.log('RAW schedule:', schedule);
        console.log('RAW events:', eventsData);

        // TODO: zaktualizuj po zobaczeniu RAW logów w konsoli
        const eventsDict: EventsDict = Object.fromEntries(
          (eventsData.events ?? []).map((e: ApiEvent) => [e.code, e]),
        );

        const units: ApiUnit[] = schedule.units ?? [];
        const sorted = [...units].sort(
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
