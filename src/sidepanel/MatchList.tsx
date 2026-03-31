import type { ApiScheduleItem, EventsDict, ResultsDict } from '../types/api';
import MatchCard from './MatchCard';

interface Props {
  matches: ApiScheduleItem[];
  events: EventsDict;
  results: ResultsDict;
}

export default function MatchList({ matches, events, results }: Props) {
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
        />
      ))}
    </ul>
  );
}
