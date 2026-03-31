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
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Revoke blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  function buildData() {
    if (!rawResult) return null;
    return buildExportJson(match, rawResult, events);
  }

  function handleExport() {
    const data = buildData();
    if (!data) return;
    const home = match.start.find((s) => s.sortOrder === 1)?.participant.organisation.code ?? 'home';
    const away = match.start.find((s) => s.sortOrder === 2)?.participant.organisation.code ?? 'away';
    downloadJson(data, `${home}_vs_${away}.json`);
    setOpen(false);
  }

  async function handleCopyUrl() {
    const data = buildData();
    if (!data) return;

    // Revoke previous blob if any
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    blobUrlRef.current = url;

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setOpen(false);
    setTimeout(() => setCopied(false), 2500);
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

      {copied && <span className="match-menu-toast">URL copied!</span>}

      {open && (
        <div className="match-menu-dropdown">
          <button className="match-menu-item" onClick={handleExport} disabled={!rawResult}>
            {rawResult ? 'Export JSON' : 'Loading…'}
          </button>
          <button className="match-menu-item" onClick={handleCopyUrl} disabled={!rawResult}>
            {rawResult ? 'Copy URL' : 'Loading…'}
          </button>
        </div>
      )}
    </div>
  );
}
