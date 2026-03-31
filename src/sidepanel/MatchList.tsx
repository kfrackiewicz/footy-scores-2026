import type { ApiScheduleItem, EventsDict, ResultsDict } from '../types/api';
import type { RawResultsDict } from '../hooks/useMatchResults';
import MatchCard from './MatchCard';

interface Props {
  matches: ApiScheduleItem[];
  events: EventsDict;
  results: ResultsDict;
  rawResults: RawResultsDict;
  resultsLoading: boolean;
  reloadingCodes: Set<string>;
  reloadMatch: (code: string) => Promise<void>;
}

export default function MatchList({ matches, events, results, rawResults, resultsLoading, reloadingCodes, reloadMatch }: Props) {
  if (matches.length === 0) {
    return <p className="state-msg">No matches found.</p>;
  }

  return (
    <ul className="match-list">
      {matches.map((match) => (
        <MatchCard
          key={match.code}
          match={match}
          events={events}
          score={results[match.code]}
          scoreLoading={(resultsLoading && !results[match.code] && match.status.code === 'FINISHED') || reloadingCodes.has(match.code)}
          rawResult={rawResults[match.code]}
          reloadMatch={reloadMatch}
        />
      ))}
    </ul>
  );
}
