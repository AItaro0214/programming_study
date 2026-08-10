# programming_study

スマホで読みやすいプログラミング用語カンペ。Java / JavaScript(Node.js) / Python / SQL・NoSQL の用語を、品詞・動詞・単語ごとに一つずつ意味付きでまとめたチートシートです。

## 公開ページを見る (GitHub Pages)

1. このリポジトリの **Settings → Pages** を開く
2. **Source** を `Deploy from a branch` にし、ブランチを `main` / フォルダを `/ (root)` に設定して Save
3. 数分後に `https://aitaro0214.github.io/programming_study/` で閲覧できます

## 構成

- `index.html` — ページ本体
- `style.css` — 共通スタイル・アニメーション定義
- `app-data.js` — 4章分のカンペ本文データ(言語の地図 / 動詞大全 / 単語の正体 / SQL・NoSQL)
- `app-render.js` — 状態管理とレンダリング(タブ切り替え・アコーディオン開閉・トップへ戻る)

ビルド不要の静的サイトです。ローカルで確認する場合は `index.html` をブラウザで開くか、このフォルダで `python3 -m http.server` を実行してください。
