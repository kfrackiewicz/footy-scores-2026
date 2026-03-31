import { useEffect, useState } from 'react';
import { API } from '../config/endpoints';
import type { ApiScheduleItem, MatchScore, ResultResponse, ResultsDict } from '../types/api';

interface State {
  results: ResultsDict;
  loading: boolean;
}

export function useMatchResults(matches: ApiScheduleItem[]): State {
  const [state, setState] = useState<State>({ results: {}, loading: false });

  useEffect(() => {
    const finished = matches.filter((m) => m.status.code === 'FINISHED');
    if (finished.length === 0) return;

    let cancelled = false;
    let pending = finished.length;

    setState({ results: {}, loading: true });

    for (const m of finished) {
      fetch(API.resultUrl(m.code))
        .then((res) => (res.ok ? res.json() : null))
        .then((data: ResultResponse | null) => {
          if (cancelled) return;

          pending -= 1;

          if (data) {
            const home = data.results.items.find((i) => i.sortOrder === 1);
            const away = data.results.items.find((i) => i.sortOrder === 2);
            if (home && away) {
              const score: MatchScore = { home: home.resultData, away: away.resultData };
              setState((prev) => ({
                results: { ...prev.results, [m.code]: score },
                loading: pending > 0,
              }));
              return;
            }
          }

          setState((prev) => ({ ...prev, loading: pending > 0 }));
        })
        .catch(() => {
          if (cancelled) return;
          pending -= 1;
          setState((prev) => ({ ...prev, loading: pending > 0 }));
        });
    }

    return () => { cancelled = true; };
  }, [matches]);

  return state;
}
