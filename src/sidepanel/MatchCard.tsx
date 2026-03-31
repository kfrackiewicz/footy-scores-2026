import type { ApiMatchResult, ApiScheduleItem, EventsDict, MatchScore } from '../types/api';
import { getGender, getPhase } from '../utils/matchCode';
import { PHASE_LABELS } from '../constants';
import { formatDate, getPhaseLabelFromEvents } from '../utils/helpers';
import MatchMenu from './MatchMenu';

interface Props {
  match: ApiScheduleItem;
  events: EventsDict;
  score: MatchScore | undefined;
  scoreLoading: boolean;
  failed: boolean;
  rawResult: ApiMatchResult | undefined;
  reloadMatch: (code: string) => Promise<boolean>;
}

export default function MatchCard({ match, events, score, scoreLoading, failed, rawResult, reloadMatch }: Props) {
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
    : failed
    ? '⚠'
    : isFinished
    ? '– –'
    : 'vs';

  return (
    <li className="match-card">
      <div className="match-meta">
        <span className="match-category">{gender}{phaseLabel ? ` · ${phaseLabel}` : ''}</span>
        <MatchMenu match={match} rawResult={rawResult} events={events} reloadMatch={reloadMatch} />
      </div>

      <div className="match-teams">
        <span className="team">{home?.participant.name ?? '—'}</span>
        {scoreLoading
          ? <span className="match-score-spinner" aria-label="Loading score" />
          : <span className={`match-score${score ? ' match-score--result' : ''}${failed ? ' match-score--error' : ''}`}>{scoreDisplay}</span>
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
