import { useEffect, useRef, useState } from 'react';
import type { ApiMatchResult, ApiScheduleItem, EventsDict } from '../types/api';
import { buildExportJson, downloadJson } from '../utils/exportMatch';

const STORAGE_KEY = 'match_export';

interface Props {
  match: ApiScheduleItem;
  rawResult: ApiMatchResult | undefined;
  events: EventsDict;
  reloadMatch: (code: string) => Promise<void>;
}

export default function MatchMenu({ match, rawResult, events, reloadMatch }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reloaded, setReloaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

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

  async function handleOpenInTab() {
    const data = buildData();
    if (!data) return;
    await chrome.storage.session.set({ [STORAGE_KEY]: JSON.stringify(data) });
    chrome.tabs.create({ url: chrome.runtime.getURL('viewer.html') });
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

      {copied && <span className="match-menu-toast">URL copied!</span>}
      {reloaded && <span className="match-menu-toast">Reloaded!</span>}

      {open && (
        <div className="match-menu-dropdown">
          <button className="match-menu-item" onClick={async () => {
            setOpen(false);
            await reloadMatch(match.code);
            setReloaded(true);
            setTimeout(() => setReloaded(false), 2000);
          }}>
            Load data
          </button>
          <button className="match-menu-item" onClick={handleExport} disabled={!rawResult}>
            {rawResult ? 'Export JSON' : 'Loading…'}
          </button>
          <button className="match-menu-item" onClick={handleOpenInTab} disabled={!rawResult}>
            {rawResult ? 'Open in new tab' : 'Loading…'}
          </button>
        </div>
      )}
    </div>
  );
}
