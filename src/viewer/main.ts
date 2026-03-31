const STORAGE_KEY = 'match_export';
const isRaw = new URLSearchParams(location.search).get('raw') === 'true';

chrome.storage.session.get(STORAGE_KEY, (result) => {
  const root = document.getElementById('root')!;
  const raw = result[STORAGE_KEY] as string | undefined;

  if (!raw) {
    root.innerHTML = '<p style="font-family:sans-serif;color:#888;padding:2rem">No match data found.</p>';
    return;
  }

  if (isRaw) {
    renderRaw(raw);
  } else {
    renderViewer(raw);
  }
});

function renderRaw(raw: string) {
  document.open();
  document.write(raw);
  document.close();
}

function renderViewer(raw: string) {
  const data = JSON.parse(raw);
  const home = data.teams?.home ?? '?';
  const away = data.teams?.away ?? '?';
  document.title = `${home} vs ${away} — Footy Scores`;

  document.getElementById('root')!.innerHTML = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #0f0f1a; color: #f0f0f0; font-family: 'Segoe UI', system-ui, sans-serif; }
      .header {
        background: #1a1a2e;
        padding: 16px 32px;
        border-bottom: 2px solid #0085C7;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }
      .header-info h1 { font-size: 1.3rem; }
      .header-info p { color: #888; font-size: 0.82rem; margin-top: 3px; }
      .header-actions { display: flex; gap: 8px; flex-shrink: 0; }
      .btn {
        padding: 7px 14px;
        border-radius: 6px;
        border: 1px solid #3a3a6e;
        background: #2a2a4e;
        color: #f0f0f0;
        font-size: 0.82rem;
        cursor: pointer;
        white-space: nowrap;
        transition: background 0.15s;
      }
      .btn:hover { background: #3a3a6e; }
      .btn--green { border-color: #009F3D; background: #0a2a12; color: #4cff7c; }
      .btn--green:hover { background: #0d3d1a; }
      .toast {
        position: fixed; bottom: 24px; right: 24px;
        background: #009F3D; color: #fff;
        font-size: 0.82rem; font-weight: 600;
        padding: 8px 16px; border-radius: 8px;
        animation: fadeInOut 2.5s ease forwards; z-index: 999;
      }
      @keyframes fadeInOut {
        0%   { opacity: 0; transform: translateY(8px); }
        10%  { opacity: 1; transform: translateY(0); }
        80%  { opacity: 1; }
        100% { opacity: 0; }
      }
      .content { padding: 24px 32px; }
      pre {
        background: #1a1a2e; border-radius: 8px; padding: 20px;
        font-size: 0.82rem; line-height: 1.6;
        overflow: auto; white-space: pre-wrap; word-break: break-word;
      }
    </style>

    <div class="header">
      <div class="header-info">
        <h1>${escapeHtml(home)} vs ${escapeHtml(away)}</h1>
        <p>${escapeHtml(data.competition?.round ?? '')} · ${escapeHtml(data.competition?.season ?? '')} · ${escapeHtml(data.venue?.name ?? '')}</p>
      </div>
      <div class="header-actions">
        <button class="btn" id="btn-export">Export JSON</button>
        <button class="btn" id="btn-copy-json">Copy JSON</button>
      </div>
    </div>

    <div class="content">
      <pre>${escapeHtml(JSON.stringify(JSON.parse(raw), null, 2))}</pre>
    </div>
  `;

  document.getElementById('btn-export')!.addEventListener('click', () => {
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${home}_vs_${away}.json`.replace(/\s+/g, '_');
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btn-copy-json')!.addEventListener('click', async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    showToast('JSON copied!');
  });

}

function showToast(msg: string) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
