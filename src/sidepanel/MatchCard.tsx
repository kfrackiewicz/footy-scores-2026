import type { ApiScheduleItem, EventsDict } from '../types/api';

interface Props {
  match: ApiScheduleItem;
  events: EventsDict;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getGender(code: string): string {
  if (code.startsWith('FBLM')) return "Men's";
  if (code.startsWith('FBLW')) return "Women's";
  return 'Football';
}

function getPhase(code: string, events: EventsDict): string {
  // Match code prefix (22 chars) maps to event code
  const eventCode = code.slice(0, 22);
  const event = events[eventCode];
  if (!event) return '';

  // Phase is encoded after the 22-char prefix, e.g. "GPA-", "QFNL", "FNL-"
  const phaseCode = code.slice(22, 26).trim().replace(/-/g, '');
  const phase = event.phases.find((p) => p.code.slice(22, 26).trim().replace(/-/g, '') === phaseCode);
  return phase?.shortDescription ?? '';
}

export default function MatchCard({ match, events }: Props) {
  const home = match.start.find((s) => s.sortOrder === 1);
  const away = match.start.find((s) => s.sortOrder === 2);
  const gender = getGender(match.code);
  const phase = getPhase(match.code, events);
  const isFinished = match.status.code === 'FINISHED';

  return (
    <li className="match-card">
      <div className="match-meta">
        <span className="match-category">{gender}{phase ? ` · ${phase}` : ''}</span>
        <span className={`match-status match-status--${match.status.code.toLowerCase()}`}>
          {isFinished ? 'FT' : match.status.description}
        </span>
      </div>

      <div className="match-teams">
        <span className="team">{home?.participant.name ?? '—'}</span>
        <span className="match-score">vs</span>
        <span className="team team--away">{away?.participant.name ?? '—'}</span>
      </div>

      <div className="match-footer">
        <span className="match-date">{formatDate(match.startDate)}</span>
        {match.location && <span className="match-venue">{match.location.description}</span>}
      </div>
    </li>
  );
}
