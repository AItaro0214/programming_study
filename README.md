# programming_study

スマホで読みやすいプログラミング用語カンペ。全15章・158セクションを、一語ずつ意味付きでまとめたチートシートです。

Java / JavaScript / TypeScript / Python / Dart(Flutter) / Swift / Kotlin / C / C++ / SQL・NoSQL、および各言語の主要フレームワーク(React・Next.js / Flask・Django・FastAPI / Spring Boot・Quarkus・Micronaut)を扱っています。

- **全文検索** — 全章を横断して検索し、一致した語まで飛んでハイライトします
- **スマホ / ワイド表示** — 画面幅で自動的に切り替わり、右上のボタンで手動切り替えもできます(選択はブラウザに保存されます)。ワイド表示では段組みで用語を画面いっぱいに敷き詰めます

## 公開ページを見る (GitHub Pages)

1. このリポジトリの **Settings → Pages** を開く
2. **Source** を `Deploy from a branch` にし、ブランチを `main` / フォルダを `/ (root)` に設定して Save
3. 数分後に `https://aitaro0214.github.io/programming_study/` で閲覧できます

## 構成

- `index.html` — ページ本体
- `style.css` — 共通スタイル・アニメーション・表示幅の定義
- `app-data.js` — 状態管理と、素材になる本文(言語の地図 / 動詞大全 / 単語の正体 / SQL・NoSQL)
- `app-chapters.js` — 章の組み替え(概念章の①と、言語別の Java / JavaScript・Node.js / Python を素材から構成)
- `app-langs.js` — TypeScript / モバイル3種 / C・C++ / 依存とパッケージ / 基本文法早見
- `app-frameworks.js` — React・Next.js / Flask・Django・FastAPI / Spring・Quarkus
- `app-agents.js` — AIエージェント(ハーネス / ツール / MCP / Skills / AGENTS.md / ベクトルストア)。2026年8月時点の情報
- `app-search.js` — 全文検索インデックス
- `app-render.js` — レンダリングと操作(タブ切り替え・アコーディオン・検索ジャンプ・表示幅切り替え)

ビルド不要の静的サイトです。ローカルで確認する場合は `index.html` をブラウザで開くか、このフォルダで `python3 -m http.server` を実行してください。
