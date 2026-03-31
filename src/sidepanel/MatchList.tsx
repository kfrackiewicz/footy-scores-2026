import type { ApiScheduleItem, EventsDict } from '../types/api';
import MatchCard from './MatchCard';

interface Props {
  matches: ApiScheduleItem[];
  events: EventsDict;
}

export default function MatchList({ matches, events }: Props) {
  if (matches.length === 0) {
    return <p className="state-msg">No matches found.</p>;
  }

  return (
    <ul className="match-list">
      {matches.map((match) => (
        <MatchCard key={match.code} match={match} events={events} />
      ))}
    </ul>
  );
}
