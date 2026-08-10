function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escAttr(s) {
  return esc(s).replace(/"/g, '&quot;');
}

// 本文をエスケープしつつ、検索語に一致した部分を <mark> で囲む
function hlt(s, hl) {
  const e = esc(s);
  if (!hl) return e;
  const eh = esc(hl).trim();
  if (!eh) return e;
  const re = new RegExp(eh.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  return e.replace(re, m => `<mark class="sc-hl">${m}</mark>`);
}

function renderBlock(b, col, soft, hl) {
  const T = (s) => hlt(s, hl);
  if (b.p) {
    return `<p style="margin:0;font-size:14px;line-height:1.9;color:oklch(0.32 0.02 280);text-wrap:pretty">${T(b.text)}</p>`;
  }
  if (b.h) {
    return `<div style="display:flex;align-items:center;gap:9px;padding-top:6px">
      <span style="width:7px;height:20px;border-radius:4px;background:${col}"></span>
      <span style="font-size:16px;font-weight:900;letter-spacing:.01em">${T(b.text)}</span>
    </div>`;
  }
  if (b.note) {
    return `<div style="background:${soft};border-radius:14px;padding:13px 15px;font-size:14.5px;font-weight:700;line-height:1.75;color:oklch(0.30 0.03 280);text-align:center;white-space:pre-line">${T(b.text)}</div>`;
  }
  if (b.code) {
    return `<div style="display:flex;flex-direction:column;gap:5px">
      <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:600;letter-spacing:.1em;color:${col}">${T(b.lang)}</span>
      <pre style="margin:0;font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.75;color:oklch(0.93 0.01 85);background:oklch(0.26 0.02 280);border-radius:13px;padding:13px 14px;overflow-x:auto;white-space:pre">${T(b.text)}</pre>
    </div>`;
  }
  if (b.mono) {
    return `<div style="border-left:4px solid ${col};background:oklch(0.98 0.008 85);border-radius:0 12px 12px 0;padding:11px 14px;font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.85;color:oklch(0.32 0.02 280);white-space:pre-wrap;overflow-x:auto">${T(b.text)}</div>`;
  }
  if (b.list) {
    return `<div style="display:flex;flex-direction:column;gap:7px">${b.items.map(i => `
      <div style="display:flex;gap:9px;align-items:baseline">
        <span style="flex:0 0 6px;height:6px;border-radius:50%;background:${col};transform:translateY(-2px)"></span>
        <span style="font-size:13.5px;line-height:1.75;color:oklch(0.34 0.02 280)">${T(i)}</span>
      </div>`).join('')}</div>`;
  }
  if (b.chips) {
    return `<div style="display:flex;flex-wrap:wrap;gap:6px">${b.words.map(w => `
      <span style="font-size:12.5px;font-weight:500;padding:6px 11px;border-radius:999px;background:${soft};color:oklch(0.30 0.03 280);font-family:'JetBrains Mono',monospace">${T(w)}</span>`).join('')}</div>`;
  }
  if (b.flow) {
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;padding:4px 0">${b.steps.map(s2 => `
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
        <span style="font-size:13.5px;font-weight:700;padding:7px 16px;border-radius:999px;background:#fff;border:2px solid ${col};color:oklch(0.30 0.03 280)">${T(s2.t)}</span>
        <span class="sc-dash" style="font-size:13px;color:${col}">${esc(s2.a)}</span>
      </div>`).join('')}</div>`;
  }
  if (b.cards) {
    return `<div style="display:flex;flex-direction:column;gap:7px">${b.items.map(c => `
      <div style="background:oklch(0.985 0.008 85);border:1.5px solid oklch(0.92 0.015 85);border-radius:13px;padding:10px 13px;display:flex;flex-direction:column;gap:5px">
        <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
          <span style="font-size:14.5px;font-weight:700;color:oklch(0.24 0.02 280)">${T(c.t)}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:600;color:${col};word-break:break-word">${T(c.e)}</span>
        </div>
        <div style="font-size:12.5px;line-height:1.7;color:oklch(0.46 0.02 280)">${T(c.d)}</div>
      </div>`).join('')}</div>`;
  }
  if (b.rows) {
    return `<div style="display:flex;flex-direction:column;gap:7px">${b.items.map(r => `
      <div style="background:oklch(0.985 0.008 85);border:1.5px solid oklch(0.92 0.015 85);border-radius:13px;padding:11px 13px;display:flex;flex-direction:column;gap:8px">
        <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
          <span style="font-size:14.5px;font-weight:700;color:${col}">${T(r.k)}</span>
          <span style="font-size:12.5px;color:oklch(0.48 0.02 280)">${T(r.s)}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:5px">${r.cells.map(c2 => `
          <div style="display:flex;gap:9px;align-items:baseline">
            <span style="flex:0 0 78px;font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:600;letter-spacing:.06em;color:oklch(0.58 0.02 280);padding-top:2px">${esc(c2.l)}</span>
            <span style="flex:1;font-size:13px;line-height:1.65;color:oklch(0.28 0.02 280);word-break:break-word">${T(c2.v)}</span>
          </div>`).join('')}</div>
      </div>`).join('')}</div>`;
  }
  if (b.steps2) {
    return `<div style="display:flex;flex-direction:column;gap:7px">${b.items.map(p2 => `
      <div style="display:flex;gap:11px;align-items:flex-start;background:oklch(0.985 0.008 85);border:1.5px solid oklch(0.92 0.015 85);border-radius:13px;padding:10px 13px">
        <span style="flex:0 0 24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:${soft};color:oklch(0.30 0.03 280);font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600">${esc(p2.i)}</span>
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px">
          <div style="display:flex;align-items:baseline;gap:9px;flex-wrap:wrap">
            <span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:600;color:${col}">${T(p2.en)}</span>
            <span style="font-size:13.5px;font-weight:700;color:oklch(0.26 0.02 280)">${T(p2.t)}</span>
          </div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.75;color:oklch(0.46 0.02 280);white-space:pre-wrap;word-break:break-word">${T(p2.d)}</div>
        </div>
      </div>`).join('')}</div>`;
  }
  if (b.gloss) {
    return `<div style="display:flex;flex-direction:column;border:1.5px solid oklch(0.92 0.015 85);border-radius:13px;overflow:hidden;background:oklch(0.99 0.005 85)">${b.items.map(g => `
      <div style="display:grid;grid-template-columns:minmax(86px,33%) 1fr;gap:10px;padding:9px 12px;border-top:1px solid oklch(0.95 0.012 85)">
        <span style="font-family:'JetBrains Mono',monospace;font-size:12.5px;font-weight:600;color:${col};word-break:break-word">${T(g.w)}</span>
        <span style="font-size:12.5px;line-height:1.7;color:oklch(0.32 0.02 280)">${T(g.m)}</span>
      </div>`).join('')}</div>`;
  }
  if (b.pairs) {
    return `<div style="display:flex;flex-direction:column;gap:7px">${b.items.map(q => `
      <div style="background:#fff;border:2px solid oklch(0.92 0.015 85);border-radius:13px;padding:11px 13px;display:flex;flex-direction:column;gap:5px">
        <div style="font-family:'JetBrains Mono',monospace;font-size:12.5px;font-weight:600;color:oklch(0.26 0.02 280);word-break:break-word">${T(q.a)}</div>
        <div style="font-size:13px;line-height:1.7;color:${col};font-weight:700">${T(q.b)}</div>
      </div>`).join('')}</div>`;
  }
  return '';
}

function renderSection(s, col, soft, hl) {
  const body = s.open
    ? `<div style="padding:2px 15px 18px;display:flex;flex-direction:column;gap:13px;animation:fadeUp .35s ease both">${s.blocks.map(b => renderBlock(b, col, soft, hl)).join('')}</div>`
    : '';
  return `<section data-anchor="${escAttr(s.key)}" style="background:#fff;border:2px solid oklch(0.90 0.02 85);border-radius:18px;overflow:hidden;animation:popIn .38s ease both">
    <button data-section-key="${escAttr(s.key)}" class="sc-active-btn" style="width:100%;display:flex;align-items:center;gap:10px;background:none;border:0;padding:14px 15px;cursor:pointer;text-align:left;font-family:'Zen Maru Gothic',sans-serif;color:inherit">
      <span style="flex:0 0 26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:${s.badgeBg};color:${s.badgeFg};font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600">${s.n}</span>
      <span style="flex:1;font-size:15.5px;font-weight:700;line-height:1.45">${hlt(s.t, hl)}</span>
      <span style="flex:0 0 22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:oklch(0.95 0.01 85);font-size:11px;color:oklch(0.45 0.02 280);transition:transform .25s ease;transform:${s.rot}">▼</span>
    </button>
    ${body}
  </section>`;
}

function renderResults(results, term) {
  if (!results.length) {
    return `<div style="padding:34px 4px;text-align:center;display:flex;flex-direction:column;gap:8px">
      <div style="font-size:30px">🔍</div>
      <div style="font-size:15px;font-weight:700;color:oklch(0.34 0.02 280)">「${esc(term)}」は見つかりませんでした</div>
      <div style="font-size:12.5px;color:oklch(0.55 0.02 280);line-height:1.8">別の言い方や、英単語（int、SELECT など）でも試してみてください。</div>
    </div>`;
  }

  const totalHits = results.reduce((a, r) => a + r.hits, 0);
  const groups = [];
  results.forEach(r => {
    let g = groups.find(g => g.ci === r.ci);
    if (!g) { g = { ci: r.ci, chapTab: r.chapTab, col: r.col, soft: r.soft, items: [] }; groups.push(g); }
    g.items.push(r);
  });

  return `<div style="padding:18px 0 6px;display:flex;flex-direction:column;gap:14px">
    <div style="font-size:12.5px;color:oklch(0.48 0.02 280);font-weight:700">
      「${esc(term)}」— ${results.length}セクション / ${totalHits}件ヒット
    </div>
    ${groups.map(g => `
      <div style="display:flex;flex-direction:column;gap:7px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px;background:${g.col};color:#fff">${esc(g.chapTab)}</span>
          <span style="height:2px;flex:1;background:${g.col};opacity:.25;border-radius:2px"></span>
        </div>
        ${g.items.map(r => `
          <button data-jump-ci="${r.ci}" data-jump-si="${r.si}" class="sc-active-btn sc-result" style="width:100%;text-align:left;display:flex;flex-direction:column;gap:6px;background:#fff;border:2px solid oklch(0.92 0.015 85);border-radius:14px;padding:11px 13px;cursor:pointer;font-family:'Zen Maru Gothic',sans-serif;transition:transform .15s ease,border-color .15s ease">
            <div style="display:flex;align-items:baseline;gap:8px">
              <span style="flex:0 0 auto;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;color:${g.col};padding-top:2px">${r.n}</span>
              <span style="flex:1;font-size:14px;font-weight:700;line-height:1.5;color:oklch(0.24 0.02 280)">${hlt(r.secTitle, term)}</span>
              <span style="flex:0 0 auto;font-size:10px;font-weight:700;color:#fff;background:${g.col};border-radius:999px;padding:2px 7px">${r.hits}</span>
            </div>
            ${r.snippet ? `<div style="font-size:12px;line-height:1.7;color:oklch(0.48 0.02 280);word-break:break-word">${hlt(r.snippet, term)}</div>` : ''}
          </button>`).join('')}
      </div>`).join('')}
  </div>`;
}

function renderApp(vals) {
  const q = state.q || '';
  const searching = q.trim().length > 0;
  return `
  <div data-header style="position:sticky;top:0;z-index:30;background:oklch(0.975 0.012 85 / 0.93);backdrop-filter:blur(12px);border-bottom:2px solid oklch(0.90 0.02 85)">
    <div style="max-width:520px;margin:0 auto;padding:10px 14px 9px;display:flex;flex-direction:column;gap:9px">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;letter-spacing:.1em;background:${vals.col};color:#fff;padding:4px 8px;border-radius:7px">CHEAT</span>
        <span style="font-size:15px;font-weight:900;letter-spacing:.01em">プログラミング用語カンペ</span>
      </div>

      <div style="display:flex;align-items:center;gap:8px;background:#fff;border:2px solid ${searching ? vals.col : 'oklch(0.90 0.02 85)'};border-radius:999px;padding:0 12px;transition:border-color .2s ease">
        <span style="flex:0 0 auto;font-size:13px;opacity:.6">🔍</span>
        <input data-search type="search" inputmode="search" autocomplete="off" placeholder="ぜんぶ検索（例: int、非同期、SELECT）"
          value="${escAttr(q)}"
          style="flex:1;min-width:0;border:0;outline:none;background:none;font-family:'Zen Maru Gothic',sans-serif;font-size:13.5px;padding:9px 0;color:oklch(0.26 0.02 280)">
        <button data-role="clearSearch" class="sc-active-btn" style="flex:0 0 auto;display:${searching ? 'flex' : 'none'};align-items:center;justify-content:center;width:20px;height:20px;border:0;border-radius:50%;background:oklch(0.90 0.02 85);color:oklch(0.40 0.02 280);font-size:12px;cursor:pointer;padding:0">✕</button>
      </div>

      <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:1px">
        ${vals.tabs.map((t, i) => `<button data-tab-index="${i}" class="sc-active-btn" style="flex:0 0 auto;font-family:'Zen Maru Gothic',sans-serif;font-size:12.5px;font-weight:700;padding:7px 13px;border-radius:999px;cursor:pointer;border:2px solid ${t.bd};background:${t.bg};color:${t.fg};transition:transform .15s ease">${esc(t.label)}</button>`).join('')}
      </div>
    </div>
  </div>

  <div style="max-width:520px;margin:0 auto;padding:0 14px">

    <div data-results style="display:${searching ? 'block' : 'none'}">${searching ? renderResults(searchSections(q), q.trim()) : ''}</div>

    <div data-content style="display:${searching ? 'none' : 'block'}">
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
        ${vals.sections.map(s => renderSection(s, vals.col, vals.soft, state.hl)).join('')}
      </div>

      <div style="padding:26px 0 10px;text-align:center;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;color:oklch(0.65 0.02 280)">${vals.chapNo} / 04 — END</div>
    </div>
  </div>

  <button data-role="toTop" class="sc-active-btn sc-totop" style="position:fixed;right:14px;bottom:18px;z-index:40;width:46px;height:46px;border-radius:50%;border:2px solid oklch(0.90 0.02 85);background:#fff;color:${vals.col};font-size:16px;cursor:pointer;box-shadow:0 4px 14px oklch(0.5 0.02 280 / 0.14);animation:bob 3s ease-in-out infinite">↑</button>
  `;
}

function initApp(rootEl) {
  let currentVals = null;

  function scrollToKey(key) {
    const el = rootEl.querySelector(`[data-anchor="${CSS.escape(key)}"]`);
    if (!el) return;
    const header = rootEl.querySelector('[data-header]');
    const offset = (header ? header.offsetHeight : 0) + 10;
    const secTop = el.getBoundingClientRect().top + window.scrollY - offset;

    // セクション先頭に飛ぶのが基本。ただし最初のヒットが画面外まで下にある場合は、
    // その語のところまで送る（見出しの分だけ上に余白を残す）。
    let top = secTop;
    const mark = el.querySelector('mark.sc-hl');
    if (mark) {
      const markTop = mark.getBoundingClientRect().top + window.scrollY - offset;
      if (markTop - secTop > window.innerHeight * 0.6) top = markTop - 90;
    }

    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    el.classList.add('sc-flash');
    setTimeout(() => el.classList.remove('sc-flash'), 1300);
  }

  function doRender() {
    currentVals = renderVals();
    rootEl.innerHTML = renderApp(currentVals);
    if (state.scrollKey) {
      const key = state.scrollKey;
      state.scrollKey = null;
      requestAnimationFrame(() => scrollToKey(key));
    }
  }

  // 入力中は検索結果だけを差し替える（全体を再描画すると入力欄のフォーカスが飛ぶため）
  function refreshResults() {
    const q = state.q || '';
    const searching = q.trim().length > 0;
    const resultsEl = rootEl.querySelector('[data-results]');
    const contentEl = rootEl.querySelector('[data-content]');
    const clearBtn = rootEl.querySelector('[data-role="clearSearch"]');
    if (!resultsEl || !contentEl) return;
    resultsEl.innerHTML = searching ? renderResults(searchSections(q), q.trim()) : '';
    resultsEl.style.display = searching ? 'block' : 'none';
    contentEl.style.display = searching ? 'none' : 'block';
    if (clearBtn) clearBtn.style.display = searching ? 'flex' : 'none';
    const box = rootEl.querySelector('[data-search]');
    if (box && box.parentElement) {
      box.parentElement.style.borderColor = searching ? currentVals.col : 'oklch(0.90 0.02 85)';
    }
  }

  rootEl.addEventListener('input', (e) => {
    const box = e.target.closest('[data-search]');
    if (!box) return;
    state.q = box.value;
    refreshResults();
  });

  rootEl.addEventListener('keydown', (e) => {
    if (!e.target.closest('[data-search]')) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      const first = rootEl.querySelector('[data-jump-ci]');
      if (first) first.click();
    } else if (e.key === 'Escape') {
      state.q = '';
      const box = rootEl.querySelector('[data-search]');
      if (box) box.value = '';
      refreshResults();
    }
  });

  rootEl.addEventListener('click', (e) => {
    const jump = e.target.closest('[data-jump-ci]');
    if (jump) {
      const ci = Number(jump.dataset.jumpCi);
      const si = Number(jump.dataset.jumpSi);
      const key = ci + ':' + si;
      const term = (state.q || '').trim();
      state.q = '';
      setState(st => ({
        chap: ci,
        open: Object.assign({}, st.open, { [key]: true }),
        hl: term,
        scrollKey: key
      }));
      return;
    }

    if (e.target.closest('[data-role="clearSearch"]')) {
      state.q = '';
      const box = rootEl.querySelector('[data-search]');
      if (box) box.value = '';
      refreshResults();
      return;
    }

    const tabBtn = e.target.closest('[data-tab-index]');
    if (tabBtn) {
      state.hl = '';
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
