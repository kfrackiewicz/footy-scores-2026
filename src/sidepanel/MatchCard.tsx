import type { ApiEvent, ApiUnit } from '../types/api';

interface Props {
  match: ApiUnit;
  event: ApiEvent | undefined;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MatchCard({ match, event }: Props) {
  const home = match.competitors.find((c) => c.order === 1);
  const away = match.competitors.find((c) => c.order === 2);

  return (
    <li className="match-card">
      <div className="match-meta">
        <span className="match-category">{event?.description ?? match.eventCode}</span>
        <span className="match-date">{formatDate(match.startDate)}</span>
      </div>

      <div className="match-teams">
        <span className="team">{home?.name ?? '—'}</span>
        <span className="match-score">
          {home?.results?.score ?? '-'} : {away?.results?.score ?? '-'}
        </span>
        <span className="team team--away">{away?.name ?? '—'}</span>
      </div>

      {match.venue && (
        <div className="match-venue">{match.venue.description}</div>
      )}
    </li>
  );
}
