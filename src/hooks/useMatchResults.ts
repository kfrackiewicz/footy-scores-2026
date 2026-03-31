import { useEffect, useRef, useState } from 'react';
import { API } from '../config/endpoints';
import type { ApiMatchResult, ResultResponse, ResultsDict } from '../types/api';

export type RawResultsDict = Record<string, ApiMatchResult>;

interface State {
  results: ResultsDict;
  rawResults: RawResultsDict;
  reloadingCodes: Set<string>;
  failedCodes: Set<string>;
}

interface Return extends State {
  loadMatch: (code: string) => void;
  reloadMatch: (code: string) => Promise<boolean>;
}

export function useMatchResults(): Return {
  const [state, setState] = useState<State>({
    results: {},
    rawResults: {},
    reloadingCodes: new Set(),
    failedCodes: new Set(),
  });

  // tracks codes that have already been requested to prevent duplicate fetches
  const requestedRef = useRef(new Set<string>());
  // mirrors failedCodes state so the online handler can read it without stale closure
  const failedCodesRef = useRef(new Set<string>());

  useEffect(() => {
    failedCodesRef.current = state.failedCodes;
  }, [state.failedCodes]);

  useEffect(() => {
    function handleOnline() {
      const toRetry = [...failedCodesRef.current];
      if (toRetry.length === 0) return;
      toRetry.forEach((code) => requestedRef.current.delete(code));
      toRetry.forEach((code) => loadMatch(code));
    }
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  function fetchResult(code: string): Promise<boolean> {
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

  function loadMatch(code: string) {
    if (requestedRef.current.has(code)) return;
    requestedRef.current.add(code);
    fetchResult(code);
  }

  function reloadMatch(code: string): Promise<boolean> {
    requestedRef.current.add(code);
    return fetchResult(code);
  }

  return { ...state, loadMatch, reloadMatch };
}
