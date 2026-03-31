import { useEffect, useState } from 'react';
import { API } from '../config/endpoints';
import type { ApiMatchResult, ApiScheduleItem, MatchScore, ResultResponse, ResultsDict } from '../types/api';

export type RawResultsDict = Record<string, ApiMatchResult>;

interface State {
  results: ResultsDict;
  rawResults: RawResultsDict;
  loading: boolean;
  reloadingCodes: Set<string>;
  failedCodes: Set<string>;
}

interface Return extends State {
  reloadMatch: (code: string) => Promise<boolean>;
}

export function useMatchResults(matches: ApiScheduleItem[]): Return {
  const [state, setState] = useState<State>({
    results: {},
    rawResults: {},
    loading: false,
    reloadingCodes: new Set(),
    failedCodes: new Set(),
  });

  useEffect(() => {
    const finished = matches.filter((m) => m.status.code === 'FINISHED');
    if (finished.length === 0) return;

    let cancelled = false;
    let pending = finished.length;

    setState((prev) => ({ ...prev, results: {}, rawResults: {}, loading: true }));

    for (const m of finished) {
      fetch(API.resultUrl(m.code))
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`${res.status}`))))
        .then((data: ResultResponse) => {
          if (cancelled) return;
          pending -= 1;

          const home = data.results.items.find((i) => i.sortOrder === 1);
          const away = data.results.items.find((i) => i.sortOrder === 2);
          if (home && away) {
            const score: MatchScore = { home: home.resultData, away: away.resultData };
            setState((prev) => ({
              ...prev,
              results: { ...prev.results, [m.code]: score },
              rawResults: { ...prev.rawResults, [m.code]: data.results },
              failedCodes: new Set([...prev.failedCodes].filter((c) => c !== m.code)),
              loading: pending > 0,
            }));
          } else {
            setState((prev) => ({ ...prev, loading: pending > 0 }));
          }
        })
        .catch(() => {
          if (cancelled) return;
          pending -= 1;
          setState((prev) => ({
            ...prev,
            failedCodes: new Set([...prev.failedCodes, m.code]),
            loading: pending > 0,
          }));
        });
    }

    return () => { cancelled = true; };
  }, [matches]);

  function reloadMatch(code: string): Promise<boolean> {
    setState((prev) => ({ ...prev, reloadingCodes: new Set([...prev.reloadingCodes, code]) }));

    return fetch(API.resultUrl(code))
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`${res.status}`))))
      .then((data: ResultResponse) => {
        const home = data.results.items.find((i) => i.sortOrder === 1);
        const away = data.results.items.find((i) => i.sortOrder === 2);
        if (home && away) {
          setState((prev) => ({
            ...prev,
            results: { ...prev.results, [code]: { home: home.resultData, away: away.resultData } },
            rawResults: { ...prev.rawResults, [code]: data.results },
            reloadingCodes: new Set([...prev.reloadingCodes].filter((c) => c !== code)),
            failedCodes: new Set([...prev.failedCodes].filter((c) => c !== code)),
          }));
          return true;
        }
        setState((prev) => ({ ...prev, reloadingCodes: new Set([...prev.reloadingCodes].filter((c) => c !== code)) }));
        return false;
      })
      .catch(() => {
        setState((prev) => ({
          ...prev,
          reloadingCodes: new Set([...prev.reloadingCodes].filter((c) => c !== code)),
          failedCodes: new Set([...prev.failedCodes, code]),
        }));
        return false;
      });
  }

  return { ...state, reloadMatch };
}
