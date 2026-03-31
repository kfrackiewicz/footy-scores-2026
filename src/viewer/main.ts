const STORAGE_KEY = 'match_export';

chrome.storage.session.get(STORAGE_KEY, (result) => {
  const root = document.getElementById('root')!;
  const raw = result[STORAGE_KEY] as string | undefined;

  if (!raw) {
    root.innerHTML = '<p style="font-family:sans-serif;color:#888;padding:2rem">No match data found.</p>';
    return;
  }

  const data = JSON.parse(raw);

  document.title = `${data.teams?.home ?? '?'} vs ${data.teams?.away ?? '?'} — Footy Scores`;

  root.innerHTML = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #0f0f1a; color: #f0f0f0; font-family: 'Segoe UI', system-ui, sans-serif; }
      .header { background: #1a1a2e; padding: 20px 32px; border-bottom: 2px solid #0085C7; }
      .header h1 { font-size: 1.4rem; }
      .header p { color: #888; font-size: 0.85rem; margin-top: 4px; }
      .content { padding: 24px 32px; }
      pre {
        background: #1a1a2e;
        border-radius: 8px;
        padding: 20px;
        font-size: 0.82rem;
        line-height: 1.6;
        overflow: auto;
        white-space: pre-wrap;
        word-break: break-word;
      }
    </style>
    <div class="header">
      <h1>${data.teams?.home ?? '?'} vs ${data.teams?.away ?? '?'}</h1>
      <p>${data.competition?.round ?? ''} · ${data.competition?.season ?? ''} · ${data.venue?.name ?? ''}</p>
    </div>
    <div class="content">
      <pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>
    </div>
  `;
});

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
