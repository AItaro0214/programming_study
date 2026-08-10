// 全章横断の検索インデックス。chapters() の中身を一度だけ走査して作る。

function blockTexts(b) {
  if (b.p || b.h || b.note || b.mono) return [b.text];
  if (b.code) return [b.lang, b.text];
  if (b.list) return b.items;
  if (b.chips) return b.words;
  if (b.flow) return b.steps.map(s => s.t);
  if (b.cards) return b.items.reduce((a, c) => a.concat([c.t, c.e, c.d]), []);
  if (b.rows) return b.items.reduce((a, r) => a.concat([r.k, r.s], r.cells.map(c => c.v)), []);
  if (b.steps2) return b.items.reduce((a, p) => a.concat([p.en, p.t, p.d]), []);
  if (b.gloss) return b.items.reduce((a, g) => a.concat([g.w, g.m]), []);
  if (b.pairs) return b.items.reduce((a, q) => a.concat([q.a, q.b]), []);
  return [];
}

let _index = null;

function buildIndex() {
  if (_index) return _index;
  const out = [];
  chapters().forEach((ch, ci) => {
    ch.sections.forEach((s, si) => {
      const texts = [];
      s.b.forEach(b => {
        blockTexts(b).forEach(t => { if (t) texts.push(String(t)); });
      });
      out.push({
        ci, si,
        key: ci + ':' + si,
        chapTab: ch.tab,
        col: ch.col,
        soft: ch.soft,
        secTitle: s.t,
        n: String(si + 1).padStart(2, '0'),
        texts,
        hay: (s.t + '\n' + texts.join('\n')).toLowerCase()
      });
    });
  });
  _index = out;
  return out;
}

function countHits(hay, term) {
  let n = 0, i = 0;
  while ((i = hay.indexOf(term, i)) !== -1) { n++; i += term.length; }
  return n;
}

function makeSnippet(e, term) {
  for (const t of e.texts) {
    const i = t.toLowerCase().indexOf(term);
    if (i >= 0) {
      const start = Math.max(0, i - 22);
      const end = Math.min(t.length, i + term.length + 42);
      return (start > 0 ? '…' : '') +
        t.slice(start, end).replace(/\s+/g, ' ') +
        (end < t.length ? '…' : '');
    }
  }
  return '';
}

function searchSections(q) {
  const term = String(q || '').trim().toLowerCase();
  if (!term) return [];
  return buildIndex()
    .filter(e => e.hay.indexOf(term) !== -1)
    .map(e => ({
      ci: e.ci,
      si: e.si,
      key: e.key,
      chapTab: e.chapTab,
      col: e.col,
      soft: e.soft,
      secTitle: e.secTitle,
      n: e.n,
      hits: countHits(e.hay, term),
      titleMatch: e.secTitle.toLowerCase().indexOf(term) !== -1,
      snippet: makeSnippet(e, term)
    }));
}
