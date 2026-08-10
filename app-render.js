function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderBlock(b, col, soft) {
  if (b.p) {
    return `<p style="margin:0;font-size:14px;line-height:1.9;color:oklch(0.32 0.02 280);text-wrap:pretty">${esc(b.text)}</p>`;
  }
  if (b.h) {
    return `<div style="display:flex;align-items:center;gap:9px;padding-top:6px">
      <span style="width:7px;height:20px;border-radius:4px;background:${col}"></span>
      <span style="font-size:16px;font-weight:900;letter-spacing:.01em">${esc(b.text)}</span>
    </div>`;
  }
  if (b.note) {
    return `<div style="background:${soft};border-radius:14px;padding:13px 15px;font-size:14.5px;font-weight:700;line-height:1.75;color:oklch(0.30 0.03 280);text-align:center">${esc(b.text)}</div>`;
  }
  if (b.code) {
    return `<div style="display:flex;flex-direction:column;gap:5px">
      <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:600;letter-spacing:.1em;color:${col}">${esc(b.lang)}</span>
      <pre style="margin:0;font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.75;color:oklch(0.93 0.01 85);background:oklch(0.26 0.02 280);border-radius:13px;padding:13px 14px;overflow-x:auto;white-space:pre">${esc(b.text)}</pre>
    </div>`;
  }
  if (b.mono) {
    return `<div style="border-left:4px solid ${col};background:oklch(0.98 0.008 85);border-radius:0 12px 12px 0;padding:11px 14px;font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.85;color:oklch(0.32 0.02 280);white-space:pre-wrap;overflow-x:auto">${esc(b.text)}</div>`;
  }
  if (b.list) {
    return `<div style="display:flex;flex-direction:column;gap:7px">${b.items.map(i => `
      <div style="display:flex;gap:9px;align-items:baseline">
        <span style="flex:0 0 6px;height:6px;border-radius:50%;background:${col};transform:translateY(-2px)"></span>
        <span style="font-size:13.5px;line-height:1.75;color:oklch(0.34 0.02 280)">${esc(i)}</span>
      </div>`).join('')}</div>`;
  }
  if (b.chips) {
    return `<div style="display:flex;flex-wrap:wrap;gap:6px">${b.words.map(w => `
      <span style="font-size:12.5px;font-weight:500;padding:6px 11px;border-radius:999px;background:${soft};color:oklch(0.30 0.03 280);font-family:'JetBrains Mono',monospace">${esc(w)}</span>`).join('')}</div>`;
  }
  if (b.flow) {
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 0">${b.steps.map(s2 => `
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
        <span style="font-size:13.5px;font-weight:700;padding:7px 16px;border-radius:999px;background:#fff;border:2px solid ${col};color:oklch(0.30 0.03 280)">${esc(s2.t)}</span>
        <span class="sc-dash" style="font-size:13px;color:${col}">${esc(s2.a)}</span>
      </div>`).join('')}</div>`;
  }
  if (b.cards) {
    return `<div style="display:flex;flex-direction:column;gap:7px">${b.items.map(c => `
      <div style="background:oklch(0.985 0.008 85);border:1.5px solid oklch(0.92 0.015 85);border-radius:13px;padding:10px 13px;display:flex;flex-direction:column;gap:5px">
        <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
          <span style="font-size:14.5px;font-weight:700;color:oklch(0.24 0.02 280)">${esc(c.t)}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;color:${col};word-break:break-word">${esc(c.e)}</span>
        </div>
        <div style="font-size:12.5px;line-height:1.7;color:oklch(0.46 0.02 280)">${esc(c.d)}</div>
      </div>`).join('')}</div>`;
  }
  if (b.rows) {
    return `<div style="display:flex;flex-direction:column;gap:7px">${b.items.map(r => `
      <div style="background:oklch(0.985 0.008 85);border:1.5px solid oklch(0.92 0.015 85);border-radius:13px;padding:11px 13px;display:flex;flex-direction:column;gap:8px">
        <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
          <span style="font-size:14.5px;font-weight:700;color:${col}">${esc(r.k)}</span>
          <span style="font-size:12.5px;color:oklch(0.48 0.02 280)">${esc(r.s)}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:5px">${r.cells.map(c2 => `
          <div style="display:flex;gap:9px;align-items:baseline">
            <span style="flex:0 0 78px;font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:600;letter-spacing:.06em;color:oklch(0.58 0.02 280);padding-top:2px">${esc(c2.l)}</span>
            <span style="flex:1;font-size:13px;line-height:1.65;color:oklch(0.28 0.02 280);word-break:break-word">${esc(c2.v)}</span>
          </div>`).join('')}</div>
      </div>`).join('')}</div>`;
  }
  if (b.steps2) {
    return `<div style="display:flex;flex-direction:column;gap:7px">${b.items.map(p2 => `
      <div style="display:flex;gap:11px;align-items:flex-start;background:oklch(0.985 0.008 85);border:1.5px solid oklch(0.92 0.015 85);border-radius:13px;padding:10px 13px">
        <span style="flex:0 0 24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:${soft};color:oklch(0.30 0.03 280);font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600">${esc(p2.i)}</span>
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px">
          <div style="display:flex;align-items:baseline;gap:9px;flex-wrap:wrap">
            <span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600;color:${col}">${esc(p2.en)}</span>
            <span style="font-size:13.5px;font-weight:700;color:oklch(0.26 0.02 280)">${esc(p2.t)}</span>
          </div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.75;color:oklch(0.46 0.02 280);white-space:pre-wrap;word-break:break-word">${esc(p2.d)}</div>
        </div>
      </div>`).join('')}</div>`;
  }
  if (b.gloss) {
    return `<div style="display:flex;flex-direction:column;border:1.5px solid oklch(0.92 0.015 85);border-radius:13px;overflow:hidden;background:oklch(0.99 0.005 85)">${b.items.map(g => `
      <div style="display:grid;grid-template-columns:minmax(86px,33%) 1fr;gap:10px;padding:9px 12px;border-top:1px solid oklch(0.95 0.012 85)">
        <span style="font-family:'JetBrains Mono',monospace;font-size:12.5px;font-weight:600;color:${col};word-break:break-word">${esc(g.w)}</span>
        <span style="font-size:12.5px;line-height:1.7;color:oklch(0.32 0.02 280)">${esc(g.m)}</span>
      </div>`).join('')}</div>`;
  }
  if (b.pairs) {
    return `<div style="display:flex;flex-direction:column;gap:7px">${b.items.map(q => `
      <div style="background:#fff;border:2px solid oklch(0.92 0.015 85);border-radius:13px;padding:11px 13px;display:flex;flex-direction:column;gap:5px">
        <div style="font-family:'JetBrains Mono',monospace;font-size:12.5px;font-weight:600;color:oklch(0.26 0.02 280);word-break:break-word">${esc(q.a)}</div>
        <div style="font-size:13px;line-height:1.7;color:${col};font-weight:700">${esc(q.b)}</div>
      </div>`).join('')}</div>`;
  }
  return '';
}

function renderSection(s, col, soft) {
  const body = s.open
    ? `<div style="padding:2px 15px 18px;display:flex;flex-direction:column;gap:13px;animation:fadeUp .35s ease both">${s.blocks.map(b => renderBlock(b, col, soft)).join('')}</div>`
    : '';
  return `<section style="background:#fff;border:2px solid oklch(0.90 0.02 85);border-radius:18px;overflow:hidden;animation:popIn .38s ease both">
    <button data-section-key="${s.key}" class="sc-active-btn" style="width:100%;display:flex;align-items:center;gap:10px;background:none;border:0;padding:14px 15px;cursor:pointer;text-align:left;font-family:'Zen Maru Gothic',sans-serif;color:inherit">
      <span style="flex:0 0 26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:${s.badgeBg};color:${s.badgeFg};font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600">${s.n}</span>
      <span style="flex:1;font-size:15.5px;font-weight:700;line-height:1.45">${esc(s.t)}</span>
      <span style="flex:0 0 22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:oklch(0.95 0.01 85);font-size:11px;color:oklch(0.45 0.02 280);transition:transform .25s ease;transform:${s.rot}">▼</span>
    </button>
    ${body}
  </section>`;
}

function renderApp(vals) {
  return `
  <div style="position:sticky;top:0;z-index:30;background:oklch(0.975 0.012 85 / 0.93);backdrop-filter:blur(12px);border-bottom:2px solid oklch(0.90 0.02 85)">
    <div style="max-width:520px;margin:0 auto;padding:10px 14px 9px;display:flex;flex-direction:column;gap:9px">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;letter-spacing:.1em;background:${vals.col};color:#fff;padding:4px 8px;border-radius:7px">CHEAT</span>
        <span style="font-size:15px;font-weight:900;letter-spacing:.01em">プログラミング用語カンペ</span>
      </div>
      <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:1px">
        ${vals.tabs.map((t, i) => `<button data-tab-index="${i}" class="sc-active-btn" style="flex:0 0 auto;font-family:'Zen Maru Gothic',sans-serif;font-size:12.5px;font-weight:700;padding:7px 13px;border-radius:999px;cursor:pointer;border:2px solid ${t.bd};background:${t.bg};color:${t.fg};transition:transform .15s ease">${esc(t.label)}</button>`).join('')}
      </div>
    </div>
  </div>

  <div style="max-width:520px;margin:0 auto;padding:0 14px">

    <div style="animation:fadeUp .4s ease both;padding:22px 0 6px;display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;align-items:center;gap:9px">
        <span style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;color:${vals.col};letter-spacing:.12em">${vals.chapNo}</span>
        <span style="height:2px;flex:1;background:${vals.col};opacity:.35;border-radius:2px"></span>
      </div>
      <h1 style="margin:0;font-size:27px;font-weight:900;line-height:1.25;letter-spacing:-0.01em">${esc(vals.chapTitle)}</h1>
      <p style="margin:0;font-size:13.5px;line-height:1.8;color:oklch(0.48 0.02 280);text-wrap:pretty">${esc(vals.chapDesc)}</p>
      <div style="display:flex;gap:7px;padding-top:2px">
        <button data-role="openAll" class="sc-active-btn" style="font-family:'Zen Maru Gothic',sans-serif;font-size:12px;font-weight:700;padding:7px 12px;border-radius:999px;cursor:pointer;border:2px solid oklch(0.88 0.02 85);background:#fff;color:oklch(0.35 0.02 280);transition:transform .15s ease">ぜんぶ開く</button>
        <button data-role="closeAll" class="sc-active-btn" style="font-family:'Zen Maru Gothic',sans-serif;font-size:12px;font-weight:700;padding:7px 12px;border-radius:999px;cursor:pointer;border:2px solid oklch(0.88 0.02 85);background:#fff;color:oklch(0.35 0.02 280);transition:transform .15s ease">ぜんぶ閉じる</button>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:10px;padding-top:14px">
      ${vals.sections.map(s => renderSection(s, vals.col, vals.soft)).join('')}
    </div>

    <div style="padding:26px 0 10px;text-align:center;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;color:oklch(0.65 0.02 280)">${vals.chapNo} / 04 — END</div>
  </div>

  <button data-role="toTop" class="sc-active-btn sc-totop" style="position:fixed;right:14px;bottom:18px;z-index:40;width:46px;height:46px;border-radius:50%;border:2px solid oklch(0.90 0.02 85);background:#fff;color:${vals.col};font-size:16px;cursor:pointer;box-shadow:0 4px 14px oklch(0.5 0.02 280 / 0.14);animation:bob 3s ease-in-out infinite">↑</button>
  `;
}

function initApp(rootEl) {
  let currentVals = null;

  function doRender() {
    currentVals = renderVals();
    rootEl.innerHTML = renderApp(currentVals);
  }

  rootEl.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('[data-tab-index]');
    if (tabBtn) {
      currentVals.tabs[Number(tabBtn.dataset.tabIndex)].go();
      return;
    }
    const secBtn = e.target.closest('[data-section-key]');
    if (secBtn) {
      const s = currentVals.sections.find(s => s.key === secBtn.dataset.sectionKey);
      if (s) s.toggle();
      return;
    }
    const roleBtn = e.target.closest('[data-role]');
    if (roleBtn) {
      if (roleBtn.dataset.role === 'openAll') currentVals.openAllFn();
      else if (roleBtn.dataset.role === 'closeAll') currentVals.closeAllFn();
      else if (roleBtn.dataset.role === 'toTop') currentVals.toTop();
    }
  });

  onStateChange(doRender);
  doRender();
}
