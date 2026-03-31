import { useEffect, useRef, useState } from 'react';
import type { ApiMatchResult, ApiScheduleItem, EventsDict } from '../types/api';
import { buildExportJson, downloadJson } from '../utils/exportMatch';

interface Props {
  match: ApiScheduleItem;
  rawResult: ApiMatchResult | undefined;
  events: EventsDict;
}

export default function MatchMenu({ match, rawResult, events }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function handleExport() {
    if (!rawResult) return;
    const data = buildExportJson(match, rawResult, events);
    const home = match.start.find((s) => s.sortOrder === 1)?.participant.organisation.code ?? 'home';
    const away = match.start.find((s) => s.sortOrder === 2)?.participant.organisation.code ?? 'away';
    downloadJson(data, `${home}_vs_${away}.json`);
    setOpen(false);
  }

  return (
    <div className="match-menu" ref={ref}>
      <button
        className="match-menu-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Match options"
      >
        ⋮
      </button>

      {open && (
        <div className="match-menu-dropdown">
          <button
            className="match-menu-item"
            onClick={handleExport}
            disabled={!rawResult}
          >
            {rawResult ? 'Export JSON' : 'Loading…'}
          </button>
        </div>
      )}
    </div>
  );
}
