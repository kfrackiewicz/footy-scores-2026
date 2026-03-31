import { useState } from 'react';
import { useOlympicsData } from '../hooks/useOlympicsData';
import { useMatchResults } from '../hooks/useMatchResults';
import { DEFAULT_FILTERS } from '../constants';
import type { Filters } from '../types/filters';
import { getGender, getPhase } from '../utils/matchCode';
import FootballIcon from './FootballIcon';
import FiltersBar from './Filters';
import MatchList from './MatchList';

export default function App() {
  const { matches, events, loading, error, retry } = useOlympicsData();
  const { results, rawResults, loading: resultsLoading, reloadingCodes, failedCodes, reloadMatch } = useMatchResults(matches);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filtered = matches.filter((m) => {
    const gender = getGender(m.code);
    const phase  = getPhase(m.code);
    return (
      filters.genders.includes(gender) &&
      (phase === null || filters.phases.includes(phase))
    );
  });

  return (
    <div className="app">
      <header className="header">
        <FootballIcon size={48} />
        <div className="header-text">
          <h1 className="title">Footy Scores</h1>
          <span className="subtitle">Paris 2024 &amp; Beyond</span>
        </div>
      </header>

      <FiltersBar filters={filters} onChange={setFilters} />

      <main className="main">
        {loading && <span className="main-spinner" aria-label="Loading matches" />}
        {error && (
          <div className="state-error">
            <p className="state-msg state-msg--error">{error}</p>
            <button className="retry-btn" onClick={retry}>Retry</button>
          </div>
        )}
        {!loading && !error && (
          <MatchList matches={filtered} events={events} results={results} rawResults={rawResults} resultsLoading={resultsLoading} reloadingCodes={reloadingCodes} failedCodes={failedCodes} reloadMatch={reloadMatch} />
        )}
      </main>
    </div>
  );
}
