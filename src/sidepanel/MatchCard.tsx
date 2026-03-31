import type { ApiScheduleItem, EventsDict, MatchScore } from '../types/api';
import { getGender, getPhase } from '../utils/matchCode';
import { PHASE_LABELS } from '../types/filters';

interface Props {
  match: ApiScheduleItem;
  events: EventsDict;
  score: MatchScore | undefined;
  scoreLoading: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getPhaseLabelFromEvents(code: string, events: EventsDict): string {
  const eventCode = code.slice(0, 22);
  const event = events[eventCode];
  if (!event) return '';
  const phaseCode = code.slice(22, 26).trim().replace(/-/g, '');
  const phase = event.phases.find((p) => p.code.slice(22, 26).trim().replace(/-/g, '') === phaseCode);
  return phase?.shortDescription ?? '';
}

export default function MatchCard({ match, events, score, scoreLoading }: Props) {
  const home = match.start.find((s) => s.sortOrder === 1);
  const away = match.start.find((s) => s.sortOrder === 2);
  const gender = getGender(match.code) === 'M' ? "Men's" : "Women's";
  const phase = getPhase(match.code);
  const phaseLabel = phase ? (PHASE_LABELS[phase] ?? getPhaseLabelFromEvents(match.code, events)) : '';
  const isFinished = match.status.code === 'FINISHED';

  const scoreDisplay = score
    ? `${score.home} – ${score.away}`
    : scoreLoading
    ? null
    : isFinished
    ? '– –'
    : 'vs';

  return (
    <li className="match-card">
      <div className="match-meta">
        <span className="match-category">{gender}{phaseLabel ? ` · ${phaseLabel}` : ''}</span>
        <span className={`match-status match-status--${match.status.code.toLowerCase()}`}>
          {isFinished ? 'FT' : match.status.description}
        </span>
      </div>

      <div className="match-teams">
        <span className="team">{home?.participant.name ?? '—'}</span>
        {scoreLoading
          ? <span className="match-score-spinner" aria-label="Loading score" />
          : <span className={`match-score${score ? ' match-score--result' : ''}`}>{scoreDisplay}</span>
        }
        <span className="team team--away">{away?.participant.name ?? '—'}</span>
      </div>

      <div className="match-footer">
        <span className="match-date">{formatDate(match.startDate)}</span>
        {match.location && <span className="match-venue">{match.location.description}</span>}
      </div>
    </li>
  );
}
