import { useEffect, useRef, useState } from 'react';
import type { ApiMatchResult, ApiScheduleItem, EventsDict } from '../types/api';
import { buildExportJson, downloadJson } from '../utils/exportMatch';

const STORAGE_KEY = 'match_export';

interface Props {
  match: ApiScheduleItem;
  rawResult: ApiMatchResult | undefined;
  events: EventsDict;
  reloadMatch: (code: string) => Promise<boolean>;
}

export default function MatchMenu({ match, rawResult, events, reloadMatch }: Props) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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

      {toast && <span className={`match-menu-toast${toast === 'Failed to load' ? ' match-menu-toast--error' : ''}`}>{toast}</span>}
      {copied && <span className="match-menu-toast">Copied!</span>}

      {open && (
        <div className="match-menu-dropdown">
          <button className="match-menu-item" onClick={async () => {
            setOpen(false);
            const ok = await reloadMatch(match.code);
            setToast(ok ? 'Reloaded!' : 'Failed to load');
            setTimeout(() => setToast(null), 2000);
          }}>
            Reload data
          </button>
          {rawResult && (
            <>
              <button className="match-menu-item" onClick={handleExport}>
                Export JSON
              </button>
              <button className="match-menu-item" onClick={async () => {
                const data = buildData();
                if (!data) return;
                await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                setOpen(false);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}>
                Copy JSON
              </button>
              <button className="match-menu-item" onClick={handleOpenInTab}>
                Open in new tab
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
