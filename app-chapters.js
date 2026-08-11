// 章の組み替え。
// 旧「言語の地図」(srcMap) と旧「単語の正体」(srcWords) を素材として、
// 概念の章と、言語ごとの章に振り分ける。本文は書き換えず、置き場所だけ変えている。
//
//   srcMap.sections            srcWords.sections
//   0 全体像                   0 まず6種類に分類する
//   1 名詞系の用語              1 Javaの場合
//   2 動詞系の処理一覧          2 JavaScriptの場合
//   3 言語別の動詞 → 各言語章   3 Node.jsの場合
//   4 表示する出力先            4 Pythonの場合
//   5 予約語・型・関数の違い     5 3言語を横並び → 基本文法早見
//   6 4言語の特徴比較           6 代表的な数の感覚
//   7 同じ処理を言語別 → 早見   7 名詞・動詞で見ると
//   8 品詞で覚えると強い
//   9 実務アプリを動詞で分解
//  10 学習の優先順位
//  11 まとめ

// srcMap.sections[3] は H('Java') 〜 H('Python') で言語ごとに区切られている。
// 見出しの位置で切り出して、各言語の章に配る。
function langVerbBlocks(name) {
  const blocks = srcMap().sections[3].b;
  const heads = [];
  blocks.forEach((b, i) => { if (b.h) heads.push({ name: b.text, i }); });
  const at = heads.findIndex(h => h.name === name);
  if (at === -1) return [];
  const start = heads[at].i + 1;                                   // 見出し自体は落とす
  const end = at + 1 < heads.length ? heads[at + 1].i : blocks.length;
  return blocks.slice(start, end);
}

function chMap() {
  const m = srcMap();
  const w = srcWords();
  return {
    tab: '言語の地図', col: m.col, soft: m.soft,
    title: 'コードは品詞でできている',
    desc: '名詞・動詞・形容詞。どの言語にも共通する「用語の見取り図」。個別の言語は次の章から。',
    sections: [
      m.sections[0],   // 全体像 — コードは品詞でできている
      m.sections[1],   // よく出る「名詞系」の用語
      m.sections[2],   // 「動詞系」の処理一覧
      m.sections[4],   // 「表示する」の出力先
      m.sections[5],   // 予約語・型・関数・メソッド・APIの違い
      w.sections[0],   // まず6種類に分類する
      m.sections[6],   // 4言語の特徴比較
      m.sections[8],   // 用語を「品詞」で覚えると強い
      w.sections[7],   // 「名詞・動詞」で見るとかなり分かりやすい
      m.sections[9],   // 実務アプリを動詞で分解する
      w.sections[6],   // 代表的な数の感覚
      m.sections[10],  // 学習時にまず覚えるべき優先順位
      m.sections[11]   // まとめ
    ]
  };
}

function chJava() {
  return {
    tab: 'Java', col: 'oklch(0.52 0.15 45)', soft: 'oklch(0.94 0.045 45)',
    title: 'Java — 型とクラスで固める',
    desc: '型を明示し、すべてをクラスに収める言語。業務システムの定番で、KotlinやSpringの土台にもなる。',
    sections: [
      { t: 'よく使う動詞と名前の付け方', b: langVerbBlocks('Java') },
      srcWords().sections[1],   // Javaの場合（キーワードを一語ずつ）
      { t: '関連する章', b: [
        P('Javaの知識がそのまま効く章です。'),
        CARDS([
          ['⑬ Spring / Quarkus', 'フレームワーク', 'Javaで業務システムを作るときの標準。DIとアノテーションが中心'],
          ['⑦ モバイル3種', 'Kotlin', 'KotlinはJavaと100%共存できる。Androidの純正言語'],
          ['⑨ 依存とパッケージ', 'Maven / Gradle', 'ライブラリの入れ方と import の書き方'],
          ['⑩ 基本文法早見', '横断比較', '他の8言語と同じお題で並べた早見表']
        ])
      ]}
    ]
  };
}

function chJs() {
  return {
    tab: 'JavaScript / Node.js', col: 'oklch(0.48 0.13 210)', soft: 'oklch(0.93 0.04 210)',
    title: 'JavaScript / Node.js',
    desc: 'ブラウザで画面を動かす言語と、それをサーバー側で動かす環境。同じ言語だが、出てくる用語が変わる。',
    sections: [
      { t: 'JavaScript — よく使う動詞', b: langVerbBlocks('JavaScript') },
      srcWords().sections[2],   // JavaScriptの場合（キーワードを一語ずつ）
      { t: 'Node.js — よく使う動詞', b: langVerbBlocks('Node.js') },
      srcWords().sections[3],   // Node.jsの場合
      { t: '関連する章', b: [
        P('JavaScriptから広がる章です。'),
        CARDS([
          ['⑤ TypeScript', '型を足す', 'JavaScriptに型注釈を付けた言語。書き方はほぼ同じ'],
          ['⑪ React / Next.js', 'フレームワーク', '画面を部品に分けて作る。今のWeb開発の主流'],
          ['⑨ 依存とパッケージ', 'npm', 'package.json と node_modules の仕組み'],
          ['① 言語の地図', '出力先', 'console.log と実画面の違いはこちら']
        ])
      ]}
    ]
  };
}

function chPython() {
  return {
    tab: 'Python', col: 'oklch(0.46 0.12 95)', soft: 'oklch(0.93 0.045 95)',
    title: 'Python — 短く読みやすく',
    desc: 'インデントで構造を表す言語。データ処理・自動化・AIに強く、Web側もフレームワークが充実している。',
    sections: [
      { t: 'よく使う動詞', b: langVerbBlocks('Python') },
      srcWords().sections[4],   // Pythonの場合（キーワードを一語ずつ）
      { t: '関連する章', b: [
        P('Pythonから広がる章です。'),
        CARDS([
          ['⑫ Flask / Django / FastAPI', 'フレームワーク', '小さく始める・全部入り・型と自動ドキュメント'],
          ['⑨ 依存とパッケージ', 'pip / venv', '仮想環境を作らずに入れると干渉する話も'],
          ['⑩ 基本文法早見', '横断比較', 'インデント構文を他言語と並べて見る'],
          ['⑭ SQL / NoSQL', 'データ処理', 'Pythonから触ることが多いデータベースの用語']
        ])
      ]}
    ]
  };
}
