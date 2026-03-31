import type { ApiScheduleItem, EventsDict, ResultsDict } from '../types/api';
import type { RawResultsDict } from '../hooks/useMatchResults';
import MatchCard from './MatchCard';

interface Props {
  matches: ApiScheduleItem[];
  events: EventsDict;
  results: ResultsDict;
  rawResults: RawResultsDict;
  reloadingCodes: Set<string>;
  failedCodes: Set<string>;
  loadMatch: (code: string) => void;
  reloadMatch: (code: string) => Promise<boolean>;
}

export default function MatchList({ matches, events, results, rawResults, reloadingCodes, failedCodes, loadMatch, reloadMatch }: Props) {
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
          scoreLoading={reloadingCodes.has(match.code)}
          failed={failedCodes.has(match.code)}
          rawResult={rawResults[match.code]}
          loadMatch={loadMatch}
          reloadMatch={reloadMatch}
        />
      ))}
    </ul>
  );
}
