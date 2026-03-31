import { useEffect, useState } from 'react';
import { API } from '../config/endpoints';
import type { ApiScheduleItem, MatchScore, ResultResponse, ResultsDict } from '../types/api';

export function useMatchResults(matches: ApiScheduleItem[]) {
  const [results, setResults] = useState<ResultsDict>({});

  useEffect(() => {
    const finished = matches.filter((m) => m.status.code === 'FINISHED');
    if (finished.length === 0) return;

    let cancelled = false;

    async function fetchResults() {
      const settled = await Promise.allSettled(
        finished.map(async (m) => {
          const res = await fetch(API.resultUrl(m.code));
          if (!res.ok) return null;
          const data: ResultResponse = await res.json();
          const home = data.results.items.find((i) => i.sortOrder === 1);
          const away = data.results.items.find((i) => i.sortOrder === 2);
          if (!home || !away) return null;
          return { code: m.code, score: { home: home.resultData, away: away.resultData } };
        }),
      );

      if (cancelled) return;

      const dict: ResultsDict = {};
      for (const r of settled) {
        if (r.status === 'fulfilled' && r.value) {
          dict[r.value.code] = r.value.score as MatchScore;
        }
      }
      setResults(dict);
    }

    fetchResults();
    return () => { cancelled = true; };
  }, [matches]);

  return results;
}
