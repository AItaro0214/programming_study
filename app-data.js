const P = (text) => ({ p: 1, text });
const H = (text) => ({ h: 1, text });
const NOTE = (text) => ({ note: 1, text });
const CODE = (lang, text) => ({ code: 1, lang, text });
const MONO = (text) => ({ mono: 1, text });
const LIST = (items) => ({ list: 1, items });
const CHIPS = (words) => ({ chips: 1, words });
const FLOW = (steps) => ({ flow: 1, steps: steps.map((t, i) => ({ t, a: i === steps.length - 1 ? '' : '↓' })) });
const CARDS = (items) => ({ cards: 1, items: items.map(r => ({ t: r[0], e: r[1] || '', d: r[2] || '' })) });
const ROWS = (labels, items) => ({ rows: 1, items: items.map(r => ({ k: r[0], s: r[1] || '', cells: labels.map((l, i) => ({ l, v: r[2 + i] })) })) });
const STEPS = (items) => ({ steps2: 1, items: items.map((r, i) => ({ i: String(i + 1).padStart(2, '0'), en: r[0], t: r[1] || '', d: r[2] || '' })) });
const PAIRS = (items) => ({ pairs: 1, items: items.map(r => ({ a: r[0], b: r[1] })) });
const GLOSS = (items) => ({ gloss: 1, items: items.map(r => ({ w: r[0], m: r[1] })) });

let state = { chap: null, open: {}, q: '', hl: '', scrollKey: null, wide: false, wideManual: false };
let startChapter = '1';
let listeners = [];
function setState(update) {
  const patch = typeof update === 'function' ? update(state) : update;
  state = Object.assign({}, state, patch);
  listeners.forEach(fn => fn());
}
function onStateChange(fn) { listeners.push(fn); }

function isOpen(k) {
  const v = state.open[k];
  // ワイド表示では、明示的に閉じたもの以外は開いた状態で敷き詰める
  return v === undefined ? !!state.wide : v;
}

function chapters() {
  return [c1(), c2(), c3(), c4(), c5(), c6(), c7(), c8(), c9(), c10(), c11(), c12()];
}

function renderVals() {
  const chaps = chapters();
  const start = parseInt(startChapter || '1', 10) - 1;
  const ci = Math.min(state.chap === null ? (start || 0) : state.chap, chaps.length - 1);
  const ch = chaps[ci];

  const tabs = chaps.map((c, i) => ({
    label: c.tab,
    go: () => { setState({ chap: i }); if (typeof window !== 'undefined') window.scrollTo({ top: 0 }); },
    bg: i === ci ? c.col : '#fff',
    fg: i === ci ? '#fff' : 'oklch(0.42 0.02 280)',
    bd: i === ci ? c.col : 'oklch(0.90 0.02 85)'
  }));

  const sections = ch.sections.map((s, i) => {
    const key = ci + ':' + i;
    const open = isOpen(key);
    return {
      key,
      n: String(i + 1).padStart(2, '0'),
      t: s.t,
      blocks: s.b,
      open,
      rot: open ? 'rotate(180deg)' : 'rotate(0deg)',
      badgeBg: open ? ch.col : ch.soft,
      badgeFg: open ? '#fff' : 'oklch(0.35 0.03 280)',
      toggle: () => setState(st => ({ open: Object.assign({}, st.open, { [key]: !open }) }))
    };
  });

  const setAll = (v) => () => {
    const o = Object.assign({}, state.open);
    ch.sections.forEach((s, i) => { o[ci + ':' + i] = v; });
    setState({ open: o });
  };

  return {
    tabs, sections,
    col: ch.col, soft: ch.soft,
    chapNo: String(ci + 1).padStart(2, '0'),
    chapTotal: String(chaps.length).padStart(2, '0'),
    chapTitle: ch.title,
    chapDesc: ch.desc,
    openAllFn: setAll(true),
    closeAllFn: setAll(false),
    toTop: () => { if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };
}

function c1() {
    const langCells = ['Java', 'JS / Node', 'Python'];
    return {
      tab: '① 言語の地図', col: 'oklch(0.55 0.17 255)', soft: 'oklch(0.94 0.035 255)',
      title: '4言語をまたぐ用語マップ',
      desc: 'Java / JavaScript / Node.js / Python。同じ意味の言葉が、言語ごとにどう姿を変えるか。',
      sections: [
        { t: '全体像 — コードは品詞でできている', b: [
          P('はい。前の「動詞リスト」に、用語の種類とJava / JavaScript / Node.js / Python の特徴を合体させると、かなり全体像が見えます。'),
          P('プログラミングは、ざっくり言うとこうです。'),
          CARDS([
            ['名詞', '', 'データ、型、クラス、オブジェクト'],
            ['動詞', '', '処理、関数、メソッド'],
            ['形容詞・制御語', '', 'public, private, static, async など'],
            ['接続詞・構文', '', 'if, for, while, try, import など'],
            ['環境語', '', 'System, console, process, fs, print など']
          ])
        ]},
        { t: 'よく出る「名詞系」の用語', b: [
          ROWS(langCells, [
            ['変数', '値を入れる箱', 'int age', 'let age', 'age'],
            ['型', 'データの種類', 'int, String', 'Number, String', 'int, str'],
            ['値', '実際の中身', '20, "Taro"', '20, "Taro"', '20, "Taro"'],
            ['クラス', '設計図', 'class User', 'class User', 'class User'],
            ['オブジェクト', '実体', 'new User()', 'new User() / {}', 'User() / {}'],
            ['フィールド', 'クラス内のデータ', 'private String name', 'this.name', 'self.name'],
            ['メソッド', 'クラス内の処理', 'changeEmail()', 'changeEmail()', 'change_email()'],
            ['関数', '独立した処理', 'メソッド中心', 'function, =>', 'def'],
            ['配列 / リスト', '複数データ', 'Array, List', 'Array', 'list'],
            ['辞書 / Map', 'キーと値', 'Map', 'Object, Map', 'dict'],
            ['null系', '値がない', 'null', 'null, undefined', 'None'],
            ['真偽値', 'true/false', 'boolean', 'boolean', 'bool']
          ]),
          P('ポイントは、同じ「文字列」でも言語によって名前が違うことです。'),
          MONO('Java       → String\nJavaScript → String\nPython     → str\n\nJava       → int\nJavaScript → Number\nPython     → int')
        ]},
        { t: '「動詞系」の処理一覧', b: [
          P('前に挙げたものに加えて、実務でよく出る動詞をまとめるとこうです。'),
          CARDS([
            ['作る', 'create, make, new', '新しいデータやオブジェクトを作る'],
            ['取得する', 'get, fetch, read, load', 'データを取る'],
            ['更新する', 'update, change, modify, set', '既存データを変える'],
            ['削除する', 'delete, remove, clear', 'データを消す'],
            ['追加する', 'add, append, push', '要素を増やす'],
            ['探す', 'find, search, lookup', '条件に合うデータを探す'],
            ['絞り込む', 'filter', '条件に合うものだけ残す'],
            ['選ぶ', 'select, pick', '必要な項目を選ぶ'],
            ['抽出する', 'extract', '一部だけ取り出す'],
            ['変換する', 'convert, transform, map', '形や型を変える'],
            ['整形する', 'format', '表示しやすい形にする'],
            ['解析する', 'parse', '文字列を構造化データにする'],
            ['文字列化する', 'stringify, serialize', 'データを文字列にする'],
            ['検証する', 'validate, verify, check', '正しいか確認する'],
            ['比較する', 'compare', '値を比べる'],
            ['判定する', 'is, has, can, should', 'true/falseを返す'],
            ['並べ替える', 'sort', '順番を変える'],
            ['グループ化する', 'group', '共通条件でまとめる'],
            ['集計する', 'aggregate, sum, count', '合計・件数などを出す'],
            ['保存する', 'save, persist, write', 'DBやファイルに残す'],
            ['表示する', 'print, log, show, render', 'print / log はコンソールへ、show / render は実画面へ。出力先が別物'],
            ['送信する', 'send, post, emit', '外部へ送る'],
            ['受信する', 'receive, listen, subscribe', '外部から受け取る'],
            ['接続する', 'connect', 'DBやサーバーにつなぐ'],
            ['切断する', 'disconnect, close', '接続を閉じる'],
            ['認証する', 'authenticate, login', '本人確認する'],
            ['認可する', 'authorize', '権限確認する'],
            ['暗号化する', 'encrypt', '読めない形にする'],
            ['復号する', 'decrypt', '元に戻す'],
            ['ハッシュ化する', 'hash', '不可逆変換する'],
            ['エラーを投げる', 'throw, raise', 'エラーを発生させる'],
            ['エラーを捕まえる', 'catch, except', 'エラーを処理する'],
            ['再試行する', 'retry', '失敗後にやり直す'],
            ['巻き戻す', 'rollback', '処理を取り消す'],
            ['通知する', 'notify', 'メール・Slackなどで知らせる']
          ]),
          P('実務では、四則演算よりもむしろ、'),
          CHIPS(['受け取る', '探す', '抽出する', '変換する', '検証する', '保存する', '返す']),
          P('の方が圧倒的に多いです。')
        ]},
        { t: '言語別に見る「よく使う動詞」', b: [
          H('Java'),
          P('Javaは、型とクラスを明確にして、大規模に保守しやすく作る言語です。'),
          CARDS([
            ['作る', 'new, create'], ['取得する', 'getName(), findById()'], ['設定する', 'setName()'],
            ['更新する', 'updateUser()'], ['保存する', 'save()'], ['削除する', 'delete()'],
            ['検証する', 'validate()'], ['判定する', 'isAdult(), hasRole()'], ['コンソールに出す', 'System.out.println()', 'ターミナルに出る。ユーザーの画面ではない'],
            ['例外を投げる', 'throw new Exception()'], ['例外を捕まえる', 'try, catch']
          ]),
          P('Javaではこういう名前が多いです。'),
          CODE('JAVA', 'user.getName();\nuser.setEmail("new@example.com");\nuser.isAdult();\nuserRepository.findById(id);\nuserRepository.save(user);'),
          P('Javaの特徴は、名詞と動詞がクラスに整理されやすいことです。'),
          MONO('User             → 名詞、ユーザー\nchangeEmail()    → 動詞、メールを変える\nisAdult()        → 判定、成人かどうか\nUserRepository   → ユーザーをDBから扱う係\nUserService      → ユーザー関連の業務処理をする係'),
          P('Javaは「誰が何を担当するか」を明確にしやすいです。'),
          H('JavaScript'),
          P('JavaScriptは、Web画面・イベント・非同期処理に強い言語です。'),
          CARDS([
            ['コンソールに出す', 'console.log()', '開発者ツールに出る。ユーザーの画面には出ない'],
            ['実画面に出す', 'textContent, innerHTML', 'ページそのものを書き換える。ユーザーに見える'],
            ['取得する', 'fetch()'], ['変換する', 'map()'],
            ['絞り込む', 'filter()'], ['探す', 'find()'], ['追加する', 'push()'],
            ['削除する', 'splice(), delete'], ['文字列化する', 'JSON.stringify()'], ['解析する', 'JSON.parse()'],
            ['クリックに反応する', 'addEventListener()'], ['非同期で待つ', 'await']
          ]),
          P('JavaScriptでは配列操作がとてもよく出ます。'),
          CODE('JAVASCRIPT', 'const adults = users.filter(user => user.age >= 18);\nconst names  = users.map(user => user.name);\nconst user   = users.find(user => user.id === "U001");'),
          P('これは日本語にすると、'),
          LIST(['users から', '18歳以上だけ filter して', 'name だけ map して', 'id が U001 の user を find する']),
          P('です。JavaScriptは、データの一覧を加工する処理が非常に書きやすいです。'),
          H('Node.js'),
          P('Node.jsは、JavaScriptをサーバー側で動かす環境です。言語はJavaScriptですが、出てくる用語が少し変わります。'),
          CARDS([
            ['ファイルを読む', 'fs.readFile()'], ['ファイルに書く', 'fs.writeFile()'], ['パスを扱う', 'path.join()'],
            ['HTTPサーバーを作る', 'http.createServer()'], ['APIを作る', 'app.get(), app.post()'], ['環境変数を読む', 'process.env'],
            ['モジュールを読む', 'require(), import'], ['外部に公開する', 'module.exports, export'], ['ログを出す', 'console.log()', 'ターミナルに出る。サーバー側なので画面はない'],
            ['非同期で待つ', 'async, await']
          ]),
          P('Node.jsだと、たとえばこうです。'),
          CODE('NODE.JS', 'const fs = require("fs");\n\nfs.readFile("data.txt", "utf-8", (err, data) => {\n  console.log(data);\n});'),
          P('意味は、'),
          LIST(['fsを読み込む', 'data.txtを読む', '読めたらdataを受け取る', 'consoleに表示する']),
          P('Node.jsは特に、'),
          CHIPS(['受信する', '読む', '書く', '送信する', '接続する', '待つ', '返す']),
          P('が多いです。'),
          H('Python'),
          P('Pythonは、読みやすく、データ処理・自動化・AI・スクリプトに強い言語です。'),
          CARDS([
            ['コンソールに出す', 'print()', 'ターミナルに出る。ユーザーの画面ではない'], ['入力する', 'input()'], ['長さを調べる', 'len()'],
            ['型を変える', 'int(), str(), float()'], ['追加する', 'append()'], ['削除する', 'remove(), pop()'],
            ['並べ替える', 'sort(), sorted()'], ['開く', 'open()'], ['読む', 'read()'], ['書く', 'write()'],
            ['例外を投げる', 'raise'], ['例外を捕まえる', 'try, except'], ['関数を作る', 'def'], ['クラスを作る', 'class']
          ]),
          P('Pythonはこういう感じです。'),
          CODE('PYTHON', 'adults = [user for user in users if user["age"] >= 18]'),
          P('意味は、'),
          LIST(['users の中から', 'age が18以上の user だけを集めて', 'adults に入れる']),
          P('Pythonは、データを読む、加工する、出力する流れが短く書けます。')
        ]},
        { t: '「表示する」の出力先 — コンソールと実画面は別物', b: [
          P('「表示する」には行き先が2つあります。ここを混ぜると「ちゃんと動いてるのに画面に何も出ない」で必ずハマります。'),
          NOTE('コンソール ＝ 開発者だけが見る裏側\n実画面（UI）＝ ユーザーが実際に見るところ'),
          CARDS([
            ['コンソール出力', 'console.log() / print() / System.out.println()', '開発者ツールやターミナルに出る。ユーザーには見えない。動作確認・デバッグ用'],
            ['実画面（UI）出力', 'textContent / innerHTML / render()', 'ページやアプリの画面そのものに出る。ユーザーが見るのはこっち']
          ]),
          H('JavaScript（ブラウザ）で見ると'),
          ROWS(['書き方', '出る場所', '見る人'], [
            ['コンソールに出す', '', 'console.log("Hello");', 'F12 → Console タブ', '開発者だけ'],
            ['実画面に出す', '', 'document.getElementById("out").textContent = "Hello";', 'ページ上のその要素', 'ユーザー'],
            ['ダイアログで出す', '', 'alert("Hello");', '画面中央のポップアップ', 'ユーザー']
          ]),
          P('実画面に出すには、HTML側に「置き場所」が要ります。'),
          CODE('HTML', '<p id="out"></p>'),
          CODE('JAVASCRIPT', '// コンソールにしか出ない（ユーザーには見えない）\nconsole.log("Hello");\n\n// 実画面に出る（ユーザーに見える）\ndocument.getElementById("out").textContent = "Hello";'),
          H('置き場所を作らずに出すなら'),
          P('HTMLに <p id="out"></p> を用意するのが面倒なら、body に直接入れても画面には出ます。ただし body の中身が丸ごと消えます。'),
          ROWS(['書き方', 'どうなるか'], [
            ['一部だけ変える', '', 'document.getElementById("out").textContent = "Hello";', '見出しやボタンはそのまま残り、指定した要素だけ変わる'],
            ['body ごと変える', '', 'document.body.textContent = "Hello";', 'ページの中身が全部消えて「Hello」だけになる']
          ]),
          NOTE('document.body.textContent は動作確認には手軽。\nただしページの中身を全部消すので、実際のアプリでは要素を指定して書き換える。'),
          H('実画面に書くための言葉'),
          GLOSS([
            ['document', '今開いているページ全体を表すオブジェクト'],
            ['document.body', 'ページの<body>そのもの。ここに入れると画面全体が対象になる'],
            ['getElementById', 'id を手がかりに、ページ上の要素を1つ取ってくる'],
            ['querySelector', 'CSSと同じ書き方で要素を探す。document.querySelector(".box")'],
            ['textContent', '要素の中身を「ただの文字」として入れ替える。安全なのでまずこれ'],
            ['innerHTML', '要素の中身を「HTML」として入れ替える。タグが効く反面、外から来た文字をそのまま入れると危険'],
            ['createElement', '新しい要素を作る'],
            ['appendChild', '作った要素をページにぶら下げて、実際に見えるようにする'],
            ['alert', 'ポップアップを出す。手軽だが操作を止めるので実務ではあまり使わない'],
            ['render', '画面を描画する。React などのフレームワークで使う言葉']
          ]),
          H('言語ごとの出力先'),
          ROWS(['コンソール / ターミナル', '実画面（UI）'], [
            ['JavaScript', 'ブラウザ', 'console.log()', 'textContent, innerHTML, appendChild'],
            ['Node.js', 'サーバー', 'console.log()', '自分では画面を持たない。HTMLやJSONを返してブラウザに描かせる'],
            ['Java', '', 'System.out.println()', 'Swing / JavaFX、Webなら画面用テンプレート'],
            ['Python', '', 'print()', 'Tkinter / PyQt、Webなら Django・Flask のテンプレート']
          ]),
          P('Node.js・Java・Python のサーバー側は、そもそも自分で画面を持ちません。データやHTMLを返して、それをブラウザが描きます。'),
          H('開発者向けの流れ'),
          FLOW(['サーバーやJSで print / log', 'ターミナル・コンソールに出る', '開発者が確認する']),
          H('ユーザー向けの流れ'),
          FLOW(['HTML・JSONを返す / 要素を書き換える', 'ブラウザが受け取る', '実画面に描かれる', 'ユーザーが見る']),
          NOTE('print も console.log も「ユーザーに見せる手段」ではない。\n見せたいなら、画面の要素を書き換えるか、画面用のHTMLを返す。')
        ]},
        { t: '予約語・型・関数・メソッド・APIの違い', b: [
          P('ここを分けると混乱しにくいです。'),
          CARDS([
            ['予約語 / キーワード', 'class, if, for, return, def', '言語の文法として決まっている単語'],
            ['型', 'int, String, boolean, str, list', 'データの種類'],
            ['クラス', 'User, String, ArrayList, Date', 'オブジェクトの設計図'],
            ['関数', 'print(), len(), parseInt()', '何かをする処理'],
            ['メソッド', 'user.changeEmail(), list.append()', 'オブジェクトに属する処理'],
            ['プロパティ / フィールド', 'user.name, user.email', 'オブジェクトが持つデータ'],
            ['API', 'fetch(), fs.readFile(), System.out', '他の機能を使うための窓口']
          ]),
          P('たとえば：'),
          CODE('JAVA', 'System.out.println("Hello");'),
          MONO('System  → Java標準クラス\nout     → 出力先フィールド\nprintln → 出力メソッド'),
          CODE('PYTHON', 'print("Hello")'),
          MONO('print → Python組み込み関数'),
          CODE('JAVASCRIPT', 'console.log("Hello");'),
          MONO('console → コンソール用オブジェクト\nlog     → 表示メソッド'),
          P('同じ「表示する」でも、言語ごとに形が違います。')
        ]},
        { t: '4言語の特徴比較', b: [
          ROWS(['Java', 'JavaScript', 'Node.js', 'Python'], [
            ['主な用途', '', '大規模業務、Android、バックエンド', 'Webフロント、ブラウザ', 'サーバー、API、CLI', '自動化、AI、データ処理、Web'],
            ['型付け', '', '静的型付け', '動的型付け', '動的型付け', '動的型付け'],
            ['実行方式', '', 'コンパイル + JVM', '主にインタプリタ/JIT', 'V8上で実行', 'インタプリタ中心'],
            ['構造', '', 'クラス中心', '関数・オブジェクト中心', 'JS + サーバーAPI', '関数・クラス両方'],
            ['書き味', '', '厳格、明示的', '柔軟、イベント駆動', '非同期I/Oに強い', '簡潔、読みやすい'],
            ['保守性', '', '高い。型と構造が強い', '素のJSは柔軟すぎる面あり', '構成次第。TypeScriptと相性良い', '小〜中規模は速い。大規模は型設計が重要'],
            ['よく見る単語', '', 'public, class, private, String, int', 'let, const, function, map, filter', 'require, process, fs, http', 'def, class, print, list, dict']
          ])
        ]},
        { t: '同じ処理を言語別に見る', b: [
          H('文字を表示する'),
          CODE('3言語', 'System.out.println("Hello");   // Java\nconsole.log("Hello");          // JavaScript\nprint("Hello")                 # Python'),
          P('同じ「表示する」でも、言語ごとに使う単語が違います。'),
          H('18歳以上か判定する'),
          CODE('JAVA', 'public boolean isAdult() {\n    return age >= 18;\n}'),
          CODE('JAVASCRIPT', 'function isAdult(user) {\n  return user.age >= 18;\n}'),
          CODE('PYTHON', 'def is_adult(user):\n    return user["age"] >= 18'),
          P('共通しているのは、'),
          LIST(['age を見る', '18以上か比較する', 'true / false を返す']),
          P('です。違うのは文法です。'),
          H('一覧から18歳以上だけ抽出する'),
          CODE('JAVA', 'List<User> adults = users.stream()\n    .filter(user -> user.getAge() >= 18)\n    .toList();'),
          CODE('JAVASCRIPT', 'const adults = users.filter(user => user.age >= 18);'),
          CODE('PYTHON', 'adults = [user for user in users if user["age"] >= 18]'),
          P('ここでの中心動詞は filter です。'),
          NOTE('filter = 条件に合うものだけ残す'),
          H('JSONを解析する'),
          CODE('JAVASCRIPT / NODE.JS', 'const data = JSON.parse(jsonText);'),
          CODE('PYTHON', 'import json\ndata = json.loads(json_text)'),
          CODE('JAVA', 'ObjectMapper mapper = new ObjectMapper();\nUser user = mapper.readValue(jsonText, User.class);'),
          P('同じ「JSONを読む」でも、Javaは型に合わせて変換する傾向が強いです。PythonとJavaScriptは辞書・オブジェクトとして柔軟に扱うことが多いです。')
        ]},
        { t: '用語を「品詞」で覚えると強い', b: [
          H('名詞っぽいもの'),
          GLOSS([
            ['User', '利用者を表すデータ・クラス'],
            ['Product', '商品を表すデータ・クラス'],
            ['Order', '注文を表すデータ・クラス'],
            ['Payment', '支払いを表すデータ・クラス'],
            ['String', '文字列型。"Taro" のような文字の並び'],
            ['int', '整数型。20, -3 のような小数点なしの数'],
            ['List', '順番付きの集合。並び順を持つ複数データ'],
            ['Map', 'キーと値の組。名前で値を引く入れ物'],
            ['Array', '配列。番号で取り出す複数データ'],
            ['dict', 'Pythonの辞書。キーと値の組'],
            ['email', 'メールアドレスを入れる項目'],
            ['age', '年齢を入れる項目'],
            ['price', '価格を入れる項目']
          ]),
          P('これは「データ」「型」「もの」です。'),
          H('動詞っぽいもの'),
          GLOSS([
            ['get', '取得する。値を取り出す'],
            ['set', '設定する。値を入れる'],
            ['create', '作る。新しいデータを生む'],
            ['update', '更新する。既存の値を変える'],
            ['delete', '削除する。データを消す'],
            ['find', '探す。条件に合う1件を見つける'],
            ['search', '検索する。キーワードで探す'],
            ['filter', '絞り込む。条件に合うものだけ残す'],
            ['map', '変換して対応づける。1件ずつ別の形にする'],
            ['reduce', '畳み込む。合計など1つの値にまとめる'],
            ['parse', '解析する。文字列を構造化データにする'],
            ['format', '整形する。表示しやすい形にする'],
            ['validate', '検証する。正しい値か確認する'],
            ['save', '保存する。DBやファイルに残す'],
            ['send', '送る。外部にデータを渡す'],
            ['receive', '受け取る。外部からデータをもらう'],
            ['render', '描画する。画面に組み立てて出す'],
            ['print', '表示する。文字を出力する'],
            ['log', '記録する。ログに残す']
          ]),
          P('これは「処理」です。'),
          H('形容詞・状態っぽいもの'),
          GLOSS([
            ['public', '公開されている。どこからでも使える'],
            ['private', '内部専用。そのクラスの中だけ'],
            ['static', 'インスタンスを作らなくても使える'],
            ['final', '変更不可、継承不可など文脈で変わる'],
            ['async', '非同期。完了を待たずに次へ進める'],
            ['readonly', '読み取り専用。あとから書き換えない'],
            ['const', '再代入しない。名前の中身を差し替えない'],
            ['abstract', '中身は未実装。継承して実装させる前提']
          ]),
          P('これは「性質」です。'),
          H('接続詞・制御っぽいもの'),
          GLOSS([
            ['if', 'もし〜なら。条件で処理を分ける'],
            ['else', 'そうでなければ。条件に合わないときの処理'],
            ['for', '決まった回数・要素の数だけくり返す'],
            ['while', '条件が成り立つ間くり返す'],
            ['try', '失敗するかもしれない処理を試す'],
            ['catch', 'エラーを捕まえる（Java / JavaScript）'],
            ['except', 'エラーを捕まえる（Python）'],
            ['return', '結果を返して、その処理を終える'],
            ['import', '他のモジュールやクラスを取り込む'],
            ['from', 'どこから取り込むかを指定する'],
            ['export', '外部から使えるように公開する']
          ]),
          P('これは「処理の流れ」を作ります。')
        ]},
        { t: '実務アプリを動詞で分解する', b: [
          P('たとえば「ユーザーが商品を注文する」は、内部ではこうです。'),
          STEPS([
            ['receive', 'リクエストを受け取る'], ['parse', 'JSONを解析する'], ['validate', '入力値を検証する'],
            ['auth', 'ログイン状態を確認する'], ['find', 'ユーザーを探す'], ['lookup', '商品を参照する'],
            ['check', '在庫を確認する'], ['calculate', '金額を計算する'], ['create', '注文データを作る'],
            ['save', 'DBに保存する'], ['request', '決済APIに要求する'], ['send', 'メールを送る'],
            ['respond', '結果を返す'], ['log', '処理履歴を記録する']
          ]),
          P('つまり、プログラミングは本当に、'),
          NOTE('名詞に対して、動詞を実行していく'),
          P('という見方ができます。'),
          MONO('User changes email.\nOrder calculates total.\nRepository saves user.\nController receives request.\nService validates input.\nClient sends data.\nServer responds result.'),
          P('これは英語の文にかなり近いです。')
        ]},
        { t: '学習時にまず覚えるべき優先順位', b: [
          P('最初から全部覚える必要はありません。優先順位はこれです。'),
          STEPS([
            ['', '変数・型', 'int, String, boolean\nlet, const\nstr, list, dict'],
            ['', '条件分岐', 'if, else, switch, elif'],
            ['', '繰り返し', 'for, while'],
            ['', '関数・メソッド', 'def, function, return\npublic, void'],
            ['', 'データ操作', 'get, set, add, remove, find, filter, map, sort'],
            ['', '入出力', 'print, console.log, System.out.println\nread, write, fetch'],
            ['', 'オブジェクト指向', 'class, object, field, method, private, public, constructor'],
            ['', 'エラー処理', 'try, catch, except, throw, raise'],
            ['', '外部連携', 'import, require, export, API, JSON, HTTP, SQL']
          ])
        ]},
        { t: 'まとめ', b: [
          P('まとめると、前に出てきた String、int、def、print、public、class、private、return などは、プログラミングの中でそれぞれ役割が違います。'),
          PAIRS([
            ['String / int / list / dict', '→ データの種類、名詞系'],
            ['print / log / fetch / save / filter', '→ 処理、動詞系'],
            ['public / private / static / const', '→ 性質、形容詞系'],
            ['if / for / while / try / return', '→ 流れを作る構文'],
            ['Java / JavaScript / Node.js / Python', '→ 同じ目的でも、使う単語と設計思想が違う']
          ]),
          NOTE('コードは「謎の記号」ではなく、名詞・動詞・性質・流れで構成された指示文として見えるようになります。')
        ]}
      ]
    };
  }

function c2() {
    return {
      tab: '② 動詞大全', col: 'oklch(0.60 0.19 22)', soft: 'oklch(0.94 0.035 22)',
      title: '実務で使う動詞、ぜんぶ',
      desc: 'プログラミングは突き詰めると「データに対して何かをする動詞の集まり」です。15分類 + 実務頻出リスト。',
      sections: [
        { t: 'プログラムがやっていること', b: [
          P('かなり良い視点です。プログラミングは突き詰めると「データに対して何かをする動詞の集まり」です。'),
          P('四則演算、削除、表示、送信以外にも、実務では大量の「動詞」があります。'),
          P('まず大枠で言うと、プログラムがやっていることはだいたいこれです。'),
          FLOW(['受け取る', '確認する', '探す', '取り出す', '変換する', '判断する', '保存する', '返す / 表示する / 送る']),
          P('なので、「受信したものから一定のデータを抽出して成形する」は、かなりプログラミングの中心です。検索ももちろん中心的な処理です。')
        ]},
        { t: '受け取る系', b: [
          P('外からデータを入れる処理です。'),
          CARDS([
            ['受け取る', 'receive', 'APIリクエストを受け取る'],
            ['入力する', 'input', 'フォーム入力を受け取る'],
            ['読み込む', 'read / load', 'ファイルを読み込む'],
            ['取得する', 'get / fetch', 'DBやAPIからデータを取る'],
            ['購読する', 'subscribe', 'イベントやメッセージを待つ'],
            ['監視する', 'watch / listen', '変更やイベントを検知する']
          ]),
          P('例：'),
          LIST(['ユーザーがフォームに入力する', 'APIがリクエストを受け取る', 'ファイルからCSVを読み込む', 'DBからユーザー情報を取得する']),
          P('fetch、get、read、load はかなり頻出です。')
        ]},
        { t: '探す・選ぶ系', b: [
          P('大量のデータから必要なものを見つける処理です。'),
          CARDS([
            ['検索する', 'search', 'キーワードで探す'],
            ['探す', 'find', '条件に合う1件を探す'],
            ['絞り込む', 'filter', '条件に合うものだけ残す'],
            ['選択する', 'select', '必要な列や項目を選ぶ'],
            ['抽出する', 'extract', '文章やJSONから一部を取り出す'],
            ['一致させる', 'match', 'パターンに合うか見る'],
            ['参照する', 'lookup', 'IDから対応データを探す']
          ]),
          P('たとえば、'),
          LIST(['ユーザー一覧から年齢18歳以上だけ抽出する', '注文一覧から未発送だけ絞り込む', '文章からメールアドレスだけ取り出す', '商品IDから商品名を探す']),
          P('これは全部「検索・抽出・絞り込み」です。プログラミングではかなり重要です。')
        ]},
        { t: '変換・成形系', b: [
          P('データの形を変える処理です。実務では超頻出です。'),
          CARDS([
            ['変換する', 'convert', '文字列を数値に変換'],
            ['整形する', 'format', '日付を見やすく整える'],
            ['加工する', 'transform', 'APIレスポンスを画面用に変える'],
            ['解析する', 'parse', 'JSON文字列をオブジェクトにする'],
            ['文字列化する', 'stringify / serialize', 'オブジェクトをJSONにする'],
            ['正規化する', 'normalize', '表記ゆれをそろえる'],
            ['分割する', 'split', '文字列を区切る'],
            ['結合する', 'join / merge', '複数データをまとめる'],
            ['丸める', 'round', '小数を丸める'],
            ['補完する', 'fill / populate', '足りない値を入れる']
          ]),
          P('例：'),
          LIST(['"2026-08-10T10:00:00" を "2026年8月10日" にする', '"1,200円" を 1200 にする', 'APIから来たJSONを画面表示用の形に変える', '姓と名を結合してフルネームにする']),
          P('「受信したものから一定のデータを抽出して成形する」は、'),
          NOTE('receive → parse → extract → filter → transform → format'),
          P('みたいな流れです。')
        ]},
        { t: '判定・検証系', b: [
          P('データが正しいか、条件に合うかを見る処理です。'),
          CARDS([
            ['判定する', 'check / judge', '成人かどうか判定'],
            ['比較する', 'compare', '価格を比較'],
            ['検証する', 'validate', 'メール形式が正しいか確認'],
            ['確認する', 'verify', 'パスワードが合っているか確認'],
            ['認証する', 'authenticate', '本人か確認'],
            ['認可する', 'authorize', '操作権限があるか確認'],
            ['許可する', 'allow / permit', '処理を許す'],
            ['拒否する', 'reject / deny', '処理を止める']
          ]),
          P('例：'),
          LIST(['メールアドレスが空でないか確認する', '年齢が18歳以上か判定する', 'ログイン中のユーザーか確認する', '管理者だけ削除できるようにする']),
          P('if 文はこのためにあります。'),
          MONO('もし条件を満たすなら A\nそうでなければ B')
        ]},
        { t: '作る・追加する・更新する系', b: [
          P('データや状態を作ったり変えたりする処理です。'),
          CARDS([
            ['作成する', 'create', 'ユーザーを作る'],
            ['追加する', 'add / append', 'リストに商品を追加'],
            ['登録する', 'register', '会員登録する'],
            ['更新する', 'update', 'メールアドレスを更新'],
            ['変更する', 'change / modify', '設定を変更'],
            ['置き換える', 'replace', '文字列を置換'],
            ['初期化する', 'initialize', '最初の状態を作る'],
            ['複製する', 'copy / clone', 'データをコピー']
          ]),
          P('これはCRUDの中心です。'),
          MONO('Create  → 作成\nRead    → 読み取り\nUpdate  → 更新\nDelete  → 削除'),
          P('多くの業務アプリは、かなりの部分がCRUDです。'),
          LIST(['顧客を登録する', '顧客情報を見る', '顧客情報を変更する', '顧客を削除する'])
        ]},
        { t: '保存・記録系', b: [
          P('データを残す処理です。'),
          CARDS([
            ['保存する', 'save', 'DBに保存'],
            ['永続化する', 'persist', 'メモリ上のデータをDBに残す'],
            ['記録する', 'record / log', '操作履歴を残す'],
            ['書き込む', 'write', 'ファイルに書く'],
            ['追記する', 'append', 'ログに追加'],
            ['コミットする', 'commit', 'DB変更を確定'],
            ['ロールバックする', 'rollback', 'DB変更を取り消す'],
            ['バックアップする', 'backup', '複製を保存']
          ]),
          P('例：'),
          LIST(['注文情報をDBに保存する', 'エラー内容をログに記録する', 'ユーザー操作履歴を残す', '失敗したら変更を取り消す'])
        ]},
        { t: '並べ替え・集計系', b: [
          P('一覧データを扱うときによく出ます。'),
          CARDS([
            ['並べ替える', 'sort', '価格順に並べる'],
            ['グループ化する', 'group', '月別にまとめる'],
            ['集計する', 'aggregate', '合計、平均、件数を出す'],
            ['数える', 'count', '件数を数える'],
            ['合計する', 'sum', '売上合計を出す'],
            ['平均する', 'average', '平均点を出す'],
            ['最大・最小を取る', 'max / min', '最高価格を出す'],
            ['ランキングする', 'rank', '上位順に並べる']
          ]),
          P('例：'),
          LIST(['売上を月別に集計する', '商品を価格の安い順に並べる', 'ユーザー数を数える', 'カテゴリごとの平均価格を出す']),
          P('SQLでよくやる処理です。'),
          CODE('SQL', 'SELECT category, COUNT(*)\nFROM products\nGROUP BY category;'),
          P('これは、「商品をカテゴリごとにグループ化して、件数を数える」という処理です。')
        ]},
        { t: '流れを制御する系', b: [
          P('処理の順番や分岐をコントロールします。'),
          CARDS([
            ['分岐する', 'branch', '条件で処理を分ける'],
            ['繰り返す', 'loop / iterate', 'リストを1件ずつ処理'],
            ['中断する', 'break', 'ループを止める'],
            ['続行する', 'continue', '次のループへ進む'],
            ['待つ', 'wait', '処理完了を待つ'],
            ['遅延させる', 'delay', '3秒後に実行'],
            ['再試行する', 'retry', '失敗した通信をやり直す'],
            ['スキップする', 'skip', '条件に合わないものを飛ばす']
          ]),
          P('プログラムは「上から順に実行」だけではありません。'),
          CHIPS(['条件で分かれる', '繰り返す', '途中で止める', '待つ', 'やり直す']),
          P('こういう制御がかなりあります。')
        ]},
        { t: '通信・連携系', b: [
          P('外部システムとやり取りする処理です。'),
          CARDS([
            ['送信する', 'send', 'データを送る'],
            ['受信する', 'receive', 'データを受け取る'],
            ['要求する', 'request', 'APIにリクエストする'],
            ['応答する', 'respond', 'APIがレスポンスを返す'],
            ['接続する', 'connect', 'DBやサーバーに接続'],
            ['切断する', 'disconnect', '接続を切る'],
            ['同期する', 'sync', 'データを同期'],
            ['通知する', 'notify', 'メールやSlack通知'],
            ['発行する', 'publish', 'メッセージを流す'],
            ['購読する', 'subscribe', 'メッセージを受け取る']
          ]),
          P('例：'),
          LIST(['外部APIに天気情報を要求する', 'Slackに通知する', 'DBに接続する', 'キューにメッセージを流す'])
        ]},
        { t: '画面・表示系', b: [
          P('ただの print だけではなく、UIではもっと多いです。'),
          CARDS([
            ['表示する', 'display / show / render', '画面に表示'],
            ['非表示にする', 'hide', 'モーダルを閉じる'],
            ['描画する', 'render / draw', 'HTMLやグラフを描く'],
            ['更新する', 'refresh / update', '表示を更新'],
            ['遷移する', 'navigate / redirect', '別ページに移動'],
            ['選択する', 'select', 'チェックボックスを選ぶ'],
            ['入力する', 'input / enter', 'フォームに入力'],
            ['無効化する', 'disable', 'ボタンを押せなくする'],
            ['有効化する', 'enable', 'ボタンを押せるようにする']
          ]),
          P('Webアプリなら、'),
          LIST(['ボタンを表示する', 'ローディングを出す', '結果一覧を描画する', '詳細ページへ遷移する', 'エラーを表示する']),
          P('などが多いです。')
        ]},
        { t: 'エラー対応系', b: [
          P('現実のプログラムでは、失敗への対応が非常に重要です。'),
          CARDS([
            ['失敗する', 'fail', '通信失敗'],
            ['捕まえる', 'catch', 'エラーを捕捉'],
            ['投げる', 'throw / raise', 'エラーを発生させる'],
            ['処理する', 'handle', 'エラー対応する'],
            ['通知する', 'notify', '管理者に通知'],
            ['復旧する', 'recover', '正常状態に戻す'],
            ['再試行する', 'retry', 'もう一度試す'],
            ['無視する', 'ignore', '軽微なエラーを無視']
          ]),
          P('例：'),
          LIST(['API通信に失敗したら3回まで再試行する', 'ファイルが存在しなければエラーを返す', 'DB保存に失敗したらロールバックする'])
        ]},
        { t: 'セキュリティ系', b: [
          P('実務ではかなり重要です。'),
          CARDS([
            ['暗号化する', 'encrypt', 'データを読めない形にする'],
            ['復号する', 'decrypt', '元に戻す'],
            ['ハッシュ化する', 'hash', 'パスワードを不可逆変換'],
            ['署名する', 'sign', '改ざん検知用の署名'],
            ['検証する', 'verify', 'トークンが正しいか確認'],
            ['認証する', 'authenticate', '誰か確認'],
            ['認可する', 'authorize', '何ができるか確認'],
            ['サニタイズする', 'sanitize', '危険な入力を無害化']
          ]),
          P('例：'),
          LIST(['パスワードをハッシュ化して保存する', 'JWTトークンを検証する', '管理者だけ削除を許可する', 'SQLインジェクションを防ぐ'])
        ]},
        { t: '状態管理系', b: [
          P('アプリは「今どういう状態か」を持ちます。'),
          CARDS([
            ['保持する', 'keep / hold', 'ログイン状態を保持'],
            ['設定する', 'set', '値をセット'],
            ['取得する', 'get', '値を取り出す'],
            ['切り替える', 'toggle', 'ON/OFF切り替え'],
            ['リセットする', 'reset', '初期状態に戻す'],
            ['キャッシュする', 'cache', '一時保存して高速化'],
            ['無効化する', 'invalidate', 'キャッシュを破棄'],
            ['ロックする', 'lock', '同時更新を防ぐ'],
            ['解放する', 'release', 'ロックを解除']
          ]),
          P('例：'),
          LIST(['ログイン状態を保持する', '検索条件を保存する', 'キャッシュを使って高速化する', '同時更新されないようにロックする'])
        ]},
        { t: 'ファイル操作系', b: [
          CARDS([
            ['開く', 'open', 'ファイルを開く'],
            ['閉じる', 'close', 'ファイルを閉じる'],
            ['読む', 'read', '内容を読む'],
            ['書く', 'write', '内容を書く'],
            ['追記する', 'append', '末尾に追加'],
            ['コピーする', 'copy', '複製する'],
            ['移動する', 'move', '場所を変える'],
            ['名前変更する', 'rename', 'ファイル名を変える'],
            ['圧縮する', 'compress', 'zip化'],
            ['展開する', 'extract / unzip', 'zipを解凍']
          ])
        ]},
        { t: 'AI・データ処理っぽい動詞', b: [
          P('最近のLLMやデータ処理ではこのあたりも頻出です。'),
          CARDS([
            ['埋め込む', 'embed', 'テキストをベクトル化'],
            ['類似検索する', 'similarity search', '近い文章を探す'],
            ['分類する', 'classify', '問い合わせ種別を判定'],
            ['要約する', 'summarize', '長文を短くする'],
            ['抽出する', 'extract', '名前・日付・金額を抜き出す'],
            ['生成する', 'generate', '文章や画像を作る'],
            ['推論する', 'infer', 'モデルで予測'],
            ['再ランキングする', 'rerank', '検索結果を並び替える'],
            ['チャンク化する', 'chunk', '長文を分割'],
            ['トークン化する', 'tokenize', 'テキストをトークンに分ける']
          ]),
          P('例：'),
          FLOW(['PDFを読み込む', '文章をチャンク化する', 'ベクトル化する', '類似検索する', '関連部分を抽出する', 'LLMに渡す', '回答を生成する']),
          P('RAGなどはまさにこの流れです。')
        ]},
        { t: '代表的な「動詞」をまとめると', b: [
          P('かなり多いですが、実務頻出の動詞だけ並べるとこうです。'),
          MONO('create   作る\nread     読む\nupdate   更新する\ndelete   削除する\nget      取得する\nset      設定する\nadd      追加する\nremove   取り除く\nfind     探す\nsearch   検索する\nfilter   絞り込む\nselect   選ぶ\nsort     並べ替える\ngroup    グループ化する\ncount    数える\nsum      合計する\nparse    解析する\nformat   整形する\nconvert  変換する\nmap      変換して対応づける\nreduce   畳み込む / 集約する\nmerge    結合する\nsplit    分割する\njoin     結合する\nextract  抽出する\nvalidate 検証する\ncheck    確認する\ncompare  比較する\nmatch    一致判定する\nsend     送る\nreceive  受け取る\nfetch    取りに行く\nrequest  要求する\nrespond  応答する\nconnect  接続する\nsync     同期する\nnotify   通知する\nrender   描画する\nshow     表示する\nhide     隠す\nredirect 転送する / 遷移する\nsave     保存する\nload     読み込む\nwrite    書き込む\nlog      記録する\ncache    キャッシュする\nthrow    エラーを投げる\ncatch    エラーを捕まえる\nretry    再試行する\nrecover  復旧する\nrollback 巻き戻す\nencrypt  暗号化する\ndecrypt  復号する\nhash     ハッシュ化する\nauth     認証・認可する\nschedule 予約実行する\nqueue    キューに入れる\npublish  発行する\nsubscribe 購読する')
        ]},
        { t: 'プログラムの本質は「動詞の連鎖」', b: [
          P('たとえば「注文処理」は、分解するとこうです。'),
          FLOW(['受け取る', '検証する', 'ユーザーを取得する', '商品を検索する', '在庫を確認する', '金額を計算する', '注文を作成する', '支払いを要求する', 'DBに保存する', 'メールを送信する', '結果を返す']),
          P('つまり、見かけ上は「注文する」という1つの処理でも、中身はたくさんの動詞です。'),
          MONO('order\n= receive + validate + fetch + check\n  + calculate + create + pay + save\n  + notify + respond'),
          P('かなり重要な見方です。')
        ]},
        { t: 'プログラムは「名詞」と「動詞」で設計できる', b: [
          P('オブジェクト指向っぽく見ると、'),
          ROWS(['持つデータ', '動詞'], [
            ['User', '', 'name, email, age', 'register, login, changeEmail'],
            ['Product', '', 'name, price, stock', 'updatePrice, reduceStock'],
            ['Cart', '', 'items', 'addItem, removeItem, calculateTotal'],
            ['Order', '', 'user, products, total', 'create, cancel, complete'],
            ['Payment', '', 'amount, method', 'authorize, capture, refund']
          ]),
          P('こう見ると、プログラミングはかなり自然言語に近いです。'),
          MONO('User changes email.\nCart adds item.\nOrder calculates total.\nPayment captures amount.\nSystem sends notification.'),
          P('英語の文みたいに、'),
          MONO('主語   = オブジェクト / データ\n動詞   = メソッド / 関数\n目的語 = 引数'),
          P('として見られます。例：'),
          CODE('JAVASCRIPT', 'user.changeEmail("new@example.com");'),
          P('これはほぼ、「user が email を new@example.com に change する」です。')
        ]},
        { t: '結論', b: [
          P('プログラミングには「計算する」「削除する」「表示する」「送信する」以外に、受け取る、探す、抽出する、検証する、変換する、整形する、保存する、集計する、同期する、通知する、認証する、描画する、再試行する、巻き戻す など、大量の動詞があります。'),
          NOTE('実務プログラムの多くは、四則演算よりも データを受け取って、探して、整えて、判断して、保存して、返す 処理の方が中心です。')
        ]}
      ]
    };
  }

function c3() {
    return {
      tab: '③ 単語の正体', col: 'oklch(0.55 0.18 305)', soft: 'oklch(0.94 0.035 305)',
      title: 'String / print / def の正体',
      desc: '全部「意味のある単語」ですが、同じ種類の単語ではありません。予約語・型・関数・API・自分で決めた名前を分けて見る。',
      sections: [
        { t: 'まず6種類に分類する', b: [
          P('はい。String や print や def や int は、全部「意味のある単語」ですが、同じ種類の単語ではありません。まず分類すると分かりやすいです。'),
          CARDS([
            ['予約語 / キーワード', 'class, public, if, return, def', '言語そのものの文法。変数名などには使えないことが多い'],
            ['型 / クラス名', 'int, String, Number, list, dict', 'データの種類や設計図'],
            ['関数 / メソッド名', 'print, println, log, append', '処理を実行する名前'],
            ['リテラル', 'true, false, null, None', '値そのものを表す特別な書き方'],
            ['実行環境のAPI名', 'console, process, require, System', '言語や実行環境が用意している道具'],
            ['自分で決める名前', 'User, changeEmail, age', '開発者が命名する変数・関数・クラス']
          ]),
          P('たとえば String は「文字列型・文字列クラス」に近い名詞、print は「出力する」という動詞、def は「関数を定義する」という文法上の合図です。')
        ]},
        { t: 'Javaの場合', b: [
          P('Javaでは、public、class、private、int、return などは言語のキーワードです。OracleのJavaチュートリアルでは、abstract、class、public、private、int、void、return などのキーワードが列挙されており、これらは識別子として使えません。true、false、null はキーワードのように見えますが、Javaではリテラルとして扱われます。'),
          H('代表的なキーワード'),
          CARDS([
            ['クラス定義', 'class, interface, enum', 'クラス、インターフェース、列挙型を作る'],
            ['アクセス制御', 'public, private, protected', 'どこから使えるかを決める'],
            ['型', 'int, long, double, float, boolean, char, byte, short, void', 'データ型、戻り値なし'],
            ['条件分岐', 'if, else, switch, case, default', '条件によって処理を分ける'],
            ['繰り返し', 'for, while, do, break, continue', 'ループ処理'],
            ['例外処理', 'try, catch, finally, throw, throws', 'エラー処理'],
            ['オブジェクト指向', 'new, this, super, extends, implements, instanceof', 'オブジェクト生成、継承、実装、型判定'],
            ['修飾', 'static, final, abstract, synchronized, volatile, transient, native, strictfp', 'クラス・変数・メソッドの性質を指定'],
            ['パッケージ', 'package, import', 'ファイルやライブラリの整理'],
            ['戻り値', 'return', 'メソッドの結果を返す']
          ]),
          H('キーワードを一語ずつ'),
          GLOSS([
            ['class', 'クラスを作る。データと処理の設計図'],
            ['interface', '実装の約束だけを決める。中身は書かない'],
            ['enum', '決まった値の集まりを作る（曜日、区分など）'],
            ['public', 'どこからでも使える'],
            ['private', 'そのクラスの中だけで使える'],
            ['protected', '同じパッケージと継承先から使える'],
            ['int', '整数。20, -3 など'],
            ['long', '大きな整数'],
            ['double', '小数。倍精度'],
            ['float', '小数。単精度'],
            ['boolean', 'true / false の真偽値'],
            ['char', '1文字'],
            ['byte', '1バイトの小さな整数'],
            ['short', '小さめの整数'],
            ['void', '戻り値なし。何も返さない'],
            ['if', 'もし〜なら'],
            ['else', 'そうでなければ'],
            ['switch', '値によって処理を分ける'],
            ['case', 'switchの分岐先'],
            ['default', 'どの case にも当てはまらないとき'],
            ['for', '決まった回数・要素分くり返す'],
            ['while', '条件が成り立つ間くり返す'],
            ['do', '先に1回実行してから条件を見る'],
            ['break', 'ループを途中で抜ける'],
            ['continue', '残りを飛ばして次のくり返しへ'],
            ['try', '失敗するかもしれない処理を試す'],
            ['catch', 'エラーを捕まえて処理する'],
            ['finally', '成功・失敗どちらでも最後に実行する'],
            ['throw', 'エラーを発生させる'],
            ['throws', 'このメソッドは例外を出すと宣言する'],
            ['new', 'オブジェクトを新しく作る'],
            ['this', '自分自身のオブジェクト'],
            ['super', '親クラス'],
            ['extends', 'クラスを継承する'],
            ['implements', 'インターフェースを実装する'],
            ['instanceof', 'その型かどうか判定する'],
            ['static', 'インスタンスを作らなくても使える'],
            ['final', '変更不可・継承不可にする'],
            ['abstract', '中身を書かず、継承先に実装させる'],
            ['synchronized', '同時に実行されないよう制御する'],
            ['volatile', '常に最新の値を読むようにする'],
            ['transient', '保存（直列化）の対象から外す'],
            ['native', '別の言語で実装された処理'],
            ['strictfp', '小数計算の結果を環境によらずそろえる'],
            ['package', 'このファイルの所属を宣言する'],
            ['import', '他のクラスを取り込む'],
            ['return', '結果を返してメソッドを終える']
          ]),
          H('よく見る「型・クラス名」'),
          CARDS([
            ['String', 'クラス', '文字列'],
            ['Integer', 'クラス', '整数をオブジェクトとして扱う'],
            ['Double', 'クラス', '小数をオブジェクトとして扱う'],
            ['Boolean', 'クラス', '真偽値をオブジェクトとして扱う'],
            ['Object', 'クラス', 'すべてのクラスの元になる基本クラス'],
            ['List', 'インターフェース', '順番付きの集合'],
            ['ArrayList', 'クラス', 'よく使う可変長リスト'],
            ['Map', 'インターフェース', 'キーと値の組'],
            ['HashMap', 'クラス', 'よく使う辞書型データ'],
            ['LocalDate', 'クラス', '日付'],
            ['LocalDateTime', 'クラス', '日時']
          ]),
          NOTE('int はJavaのキーワードだが、String はキーワードではなく標準ライブラリのクラス名'),
          CODE('JAVA', 'int age = 20;\nString name = "Taro";'),
          MONO('int    → 言語に組み込まれたプリミティブ型\nString → 文字列を扱うためのクラス'),
          H('よく見る「処理系の名前」'),
          CARDS([
            ['System', 'クラス', '標準入出力などを扱う'],
            ['out', 'フィールド', '標準出力'],
            ['println', 'メソッド', '改行付きで出力'],
            ['print', 'メソッド', '改行なしで出力'],
            ['main', 'メソッド名', 'Javaプログラムの入口としてよく使う'],
            ['args', '変数名', 'コマンドライン引数としてよく使う']
          ]),
          P('たとえばこれです。'),
          CODE('JAVA', 'System.out.println("Hello");'),
          P('分解すると、'),
          MONO('System  → 標準機能を持つクラス\nout     → 出力先\nprintln → 表示する処理\n"Hello" → 表示する文字列'),
          P('つまり println は「機械への命令語」というより、Javaの標準クラスに用意されているメソッド名です。')
        ]},
        { t: 'JavaScriptの場合', b: [
          P('JavaScriptでは、function、let、const、class、return、if、for などがキーワード・予約語です。MDNでは、JavaScriptのキーワードは識別子のように見えるが特別な意味を持つトークンであり、await や let のように文脈によって予約される語もあると説明されています。'),
          H('代表的なキーワード'),
          CARDS([
            ['変数宣言', 'let, const, var', '変数を作る'],
            ['関数', 'function, return, async, await', '関数定義、戻り値、非同期処理'],
            ['クラス', 'class, constructor, extends, super, this', 'クラス、継承、自分自身'],
            ['条件分岐', 'if, else, switch, case, default', '条件で処理を分ける'],
            ['繰り返し', 'for, while, do, break, continue', 'ループ'],
            ['例外処理', 'try, catch, finally, throw', 'エラー処理'],
            ['モジュール', 'import, export, from, as', '他ファイルとの接続'],
            ['判定・演算', 'typeof, instanceof, in, delete, void', '型確認、存在確認、削除など'],
            ['値', 'true, false, null, undefined', '真偽値、空、未定義']
          ]),
          P('※ undefined は予約語というより、標準的に存在する特別な値として理解するとよいです。'),
          H('キーワードを一語ずつ'),
          GLOSS([
            ['let', '再代入できる変数を作る'],
            ['const', '再代入しない変数を作る'],
            ['var', '古い書き方の変数宣言。今はほぼ let / const'],
            ['function', '関数を作る'],
            ['return', '結果を返して関数を終える'],
            ['async', 'その関数を非同期にする'],
            ['await', '非同期処理の完了を待つ'],
            ['class', 'クラスを作る'],
            ['constructor', '生成時に一度だけ走る初期化処理'],
            ['extends', 'クラスを継承する'],
            ['super', '親クラス'],
            ['this', '自分自身のオブジェクト'],
            ['if', 'もし〜なら'],
            ['else', 'そうでなければ'],
            ['switch', '値によって処理を分ける'],
            ['case', 'switchの分岐先'],
            ['default', 'どの case にも当てはまらないとき'],
            ['for', '要素や回数の分だけくり返す'],
            ['while', '条件が成り立つ間くり返す'],
            ['do', '先に1回実行してから条件を見る'],
            ['break', 'ループを抜ける'],
            ['continue', '次のくり返しへ進む'],
            ['try', '失敗するかもしれない処理を試す'],
            ['catch', 'エラーを捕まえる'],
            ['finally', '最後に必ず実行する'],
            ['throw', 'エラーを発生させる'],
            ['import', '他のファイルから取り込む'],
            ['export', '外部から使えるように公開する'],
            ['from', 'どこから取り込むかを指定する'],
            ['as', '別名をつける'],
            ['typeof', '値の型を調べる'],
            ['instanceof', 'そのクラスから作られたか判定する'],
            ['in', 'そのプロパティを持っているか調べる'],
            ['delete', 'オブジェクトのプロパティを消す'],
            ['void', '値を捨てて undefined にする'],
            ['true', '真'],
            ['false', '偽'],
            ['null', '「値が無い」と明示した状態'],
            ['undefined', 'まだ値が入っていない状態']
          ]),
          H('型・クラス・組み込みオブジェクト'),
          CARDS([
            ['String', '組み込みオブジェクト', '文字列を扱う'],
            ['Number', '組み込みオブジェクト', '数値を扱う'],
            ['BigInt', '組み込みオブジェクト', '大きな整数'],
            ['Boolean', '組み込みオブジェクト', '真偽値'],
            ['Array', '組み込みオブジェクト', '配列'],
            ['Object', '組み込みオブジェクト', 'オブジェクト'],
            ['Map', '組み込みオブジェクト', 'キーと値の集合'],
            ['Set', '組み込みオブジェクト', '重複なし集合'],
            ['Date', '組み込みオブジェクト', '日付'],
            ['Promise', '組み込みオブジェクト', '非同期処理の結果'],
            ['JSON', '組み込みオブジェクト', 'JSONの変換'],
            ['Math', '組み込みオブジェクト', '数学処理']
          ]),
          P('JavaScriptでは、Javaと違ってこう書きます。'),
          CODE('JAVASCRIPT', 'let name = "Taro";\nlet age = 20;'),
          P('Javaのように、'),
          CODE('JAVA', 'String name = "Taro";\nint age = 20;'),
          P('とは書きません。JavaScriptは動的型付けなので、変数宣言時に String や Number を書かないのが普通です。'),
          H('よく見る関数・メソッド'),
          CARDS([
            ['console.log', 'メソッド', 'コンソールに表示'],
            ['alert', 'ブラウザAPI', '画面にアラート表示'],
            ['parseInt', '関数', '文字列を整数に変換'],
            ['parseFloat', '関数', '文字列を小数に変換'],
            ['isNaN', '関数', '数値でないか判定'],
            ['setTimeout', '関数', '一定時間後に実行'],
            ['setInterval', '関数', '一定間隔で実行'],
            ['fetch', 'API', 'HTTP通信'],
            ['JSON.parse', 'メソッド', 'JSON文字列をオブジェクトへ'],
            ['JSON.stringify', 'メソッド', 'オブジェクトをJSON文字列へ']
          ]),
          P('JavaScriptでの出力はよくこうです。'),
          CODE('JAVASCRIPT', 'console.log("Hello");'),
          P('分解すると、'),
          MONO('console → コンソール操作用のオブジェクト\nlog     → ログとして表示するメソッド')
        ]},
        { t: 'Node.jsの場合', b: [
          P('Node.jsは「JavaScript言語そのもの」ではなく、JavaScriptをサーバー側やローカル環境で動かす実行環境です。なので、JavaScriptのキーワードに加えて、Node.js特有の名前が出てきます。Node.js公式ドキュメントでは、process、Buffer、console、fetch、global などのグローバル関連APIが説明されています。また、Node.jsではトップレベルスコープがブラウザのグローバルスコープとは異なり、モジュール内の var はそのモジュール内に閉じます。'),
          H('よく見る名前'),
          CARDS([
            ['process', 'グローバルオブジェクト', '実行中のNode.jsプロセス情報'],
            ['Buffer', 'クラス', 'バイナリデータを扱う'],
            ['console', 'グローバルオブジェクト', 'ログ出力'],
            ['global', 'グローバルオブジェクト', 'Node.jsのグローバル空間'],
            ['globalThis', 'グローバル参照', 'JS標準のグローバル参照'],
            ['require', 'CommonJS関数', 'モジュール読み込み'],
            ['module', 'CommonJSオブジェクト', '現在のモジュール情報'],
            ['exports', 'CommonJSオブジェクト', '外部に公開する値'],
            ['__dirname', 'CommonJS変数', '現在ファイルのディレクトリ'],
            ['__filename', 'CommonJS変数', '現在ファイルのパス'],
            ['setTimeout', '関数', '一定時間後に実行'],
            ['setInterval', '関数', '一定間隔で実行'],
            ['fetch', '関数', 'HTTP通信']
          ]),
          H('よく見る標準モジュール名'),
          CARDS([
            ['fs', 'モジュール', 'ファイル操作'],
            ['path', 'モジュール', 'パス操作'],
            ['http', 'モジュール', 'HTTPサーバー・通信'],
            ['https', 'モジュール', 'HTTPS通信'],
            ['url', 'モジュール', 'URL処理'],
            ['os', 'モジュール', 'OS情報'],
            ['crypto', 'モジュール', '暗号・ハッシュ'],
            ['events', 'モジュール', 'イベント処理'],
            ['stream', 'モジュール', 'ストリーム処理'],
            ['child_process', 'モジュール', '子プロセス実行']
          ]),
          P('例：'),
          CODE('NODE.JS', 'const fs = require("fs");'),
          P('分解すると、'),
          MONO('const   → 変数を作るキーワード\nfs      → 変数名。慣習的にfile systemの略\nrequire → モジュールを読み込む関数\n"fs"    → Node.js標準のファイル操作モジュール名'),
          P('Node.jsでは、require や module.exports はかなり重要です。最近は import / export もよく使われます。')
        ]},
        { t: 'Pythonの場合', b: [
          P('Pythonでは、def、class、if、for、return などがキーワードです。Python公式ドキュメントでは、False、None、True、def、class、if、for、return などが予約語として列挙され、通常の識別子としては使えないと説明されています。Python 3.10以降には、特定の文脈だけで予約されるソフトキーワードもあります。'),
          H('代表的なキーワード'),
          CARDS([
            ['関数・クラス', 'def, class, return, lambda', '関数定義、クラス定義、戻り値'],
            ['条件分岐', 'if, elif, else', '条件で処理を分ける'],
            ['繰り返し', 'for, while, break, continue', 'ループ'],
            ['例外処理', 'try, except, finally, raise, assert', 'エラー処理'],
            ['import', 'import, from, as', 'モジュール読み込み'],
            ['論理', 'and, or, not, is, in', '論理演算、同一性、含有判定'],
            ['スコープ', 'global, nonlocal', '変数のスコープ指定'],
            ['非同期', 'async, await', '非同期処理'],
            ['値', 'True, False, None', '真、偽、値なし'],
            ['その他', 'pass, del, with, yield', '何もしない、削除、リソース管理、ジェネレータ'],
            ['ソフトキーワード', 'match, case, type, _', '特定文脈でだけ特別な意味']
          ]),
          H('キーワードを一語ずつ'),
          GLOSS([
            ['def', '関数を作る'],
            ['class', 'クラスを作る'],
            ['return', '結果を返して関数を終える'],
            ['lambda', '名前のない小さな関数を作る'],
            ['if', 'もし〜なら'],
            ['elif', 'そうでなくて、もし〜なら'],
            ['else', 'そうでなければ'],
            ['for', '要素を順番にくり返す'],
            ['while', '条件が成り立つ間くり返す'],
            ['break', 'ループを抜ける'],
            ['continue', '次のくり返しへ進む'],
            ['try', '失敗するかもしれない処理を試す'],
            ['except', 'エラーを捕まえる'],
            ['finally', '最後に必ず実行する'],
            ['raise', 'エラーを発生させる'],
            ['assert', '条件が真であることを確認する'],
            ['import', 'モジュールを取り込む'],
            ['from', 'どのモジュールから取り込むか指定する'],
            ['as', '別名をつける'],
            ['and', 'かつ。両方が真なら真'],
            ['or', 'または。どちらかが真なら真'],
            ['not', '否定。真偽を反転する'],
            ['is', '同じ物（同一オブジェクト）か判定する'],
            ['in', '含まれているか判定する'],
            ['global', '関数の外にある変数を使う'],
            ['nonlocal', '一つ外側の関数の変数を使う'],
            ['async', '非同期の関数にする'],
            ['await', '非同期処理の完了を待つ'],
            ['True', '真'],
            ['False', '偽'],
            ['None', '値なし。Java/JSの null にあたる'],
            ['pass', '何もしない。中身を空にしておく'],
            ['del', '変数や要素を削除する'],
            ['with', '開いたら必ず閉じる、の後始末を自動でやる'],
            ['yield', '値を1つずつ返す（ジェネレータ）'],
            ['match', '値の形によって分岐する'],
            ['case', 'match の分岐先'],
            ['type', '型を調べる。型エイリアスの宣言にも使う'],
            ['_', '使わない値の受け皿としてよく使う名前']
          ]),
          H('組み込み関数・型'),
          P('Pythonには、print()、int()、str()、list()、dict() など、いつでも使える組み込み関数・型があります。Python公式ドキュメントでは、インタプリタに組み込まれ、常に利用可能な関数・型として abs()、bool()、dict()、float()、input()、int()、len()、list()、open()、print()、range()、str() などが列挙されています。'),
          CARDS([
            ['print', '組み込み関数', '表示する'],
            ['input', '組み込み関数', '入力を受け取る'],
            ['len', '組み込み関数', '長さを調べる'],
            ['range', '組み込み関数/型', '連番を作る'],
            ['type', '組み込み関数/型', '型を調べる、型を作る'],
            ['isinstance', '組み込み関数', '型を判定する'],
            ['int', '組み込み型', '整数'],
            ['float', '組み込み型', '小数'],
            ['str', '組み込み型', '文字列'],
            ['bool', '組み込み型', '真偽値'],
            ['list', '組み込み型', 'リスト'],
            ['tuple', '組み込み型', 'タプル'],
            ['dict', '組み込み型', '辞書'],
            ['set', '組み込み型', '集合'],
            ['object', '組み込み型', 'すべての基本'],
            ['Exception', '組み込み例外', 'エラーの基本クラス']
          ]),
          P('例：'),
          CODE('PYTHON', 'def greet(name):\n    print("Hello", name)'),
          P('分解すると、'),
          MONO('def    → 関数を定義するキーワード\ngreet  → 自分で決めた関数名\nname   → 自分で決めた引数名\nprint  → Pythonが用意している組み込み関数'),
          P('def は文法。print は関数。greet と name は自分で決めた名前です。')
        ]},
        { t: '3言語を横並びにするとこう', b: [
          H('「関数を作る」'),
          ROWS(['書き方', '重要な単語'], [
            ['Java', '', 'public void greet() {}', 'public, void'],
            ['JavaScript', '', 'function greet() {}', 'function'],
            ['Python', '', 'def greet():', 'def']
          ]),
          H('「文字列」'),
          ROWS(['書き方', 'ポイント'], [
            ['Java', '', 'String name = "Taro";', 'Stringを書く'],
            ['JavaScript', '', 'let name = "Taro";', '型名は普通書かない'],
            ['Python', '', 'name = "Taro"', '型名は普通書かない']
          ]),
          H('「整数」'),
          ROWS(['書き方', 'ポイント'], [
            ['Java', '', 'int age = 20;', 'intはキーワード'],
            ['JavaScript', '', 'let age = 20;', '内部的には主に Number'],
            ['Python', '', 'age = 20', '値が int 型になる']
          ]),
          H('「表示する」（コンソールへ）'),
          P('下の4つはすべて、開発者が見るコンソール・ターミナルへの出力です。ユーザーの画面には出ません。'),
          ROWS(['書き方', '分解'], [
            ['Java', '', 'System.out.println("Hi");', 'System → out → println'],
            ['JavaScript', '', 'console.log("Hi");', 'console → log'],
            ['Node.js', '', 'console.log("Hi");', 'JavaScriptと同じ'],
            ['Python', '', 'print("Hi")', 'print 関数']
          ]),
          H('「表示する」（実画面へ）'),
          P('ユーザーに見せたいときは、こちらです。'),
          ROWS(['書き方', '分解'], [
            ['JavaScript', 'ブラウザ', 'el.textContent = "Hi";', '要素の中身を文字として差し替える'],
            ['JavaScript', 'ブラウザ', 'el.innerHTML = "<b>Hi</b>";', 'HTMLとして差し替える。外部の文字はそのまま入れない'],
            ['React', '', 'return <p>Hi</p>;', '返した内容がそのまま画面になる']
          ])
        ]},
        { t: '代表的な数の感覚', b: [
          P('厳密に言うと、「意味のある単語」はどこまで含めるかで数が変わります。'),
          ROWS(['言語のキーワード', '標準の型・関数・クラス', '実務で最初に覚える量'], [
            ['Java', '', '伝統的キーワードは約50個。近年は文脈依存キーワードもある', '標準ライブラリは膨大', '最初は50〜100語程度'],
            ['JavaScript', '', '予約語は30個台＋文脈依存語＋将来予約語', '組み込みオブジェクト/API多数', '最初は50〜100語程度'],
            ['Node.js', '', 'JavaScriptの語彙＋Node専用API', '標準モジュール多数', '最初は70〜150語程度'],
            ['Python', '', 'キーワードは35個前後＋ソフトキーワード', '組み込み関数・型が約70個規模', '最初は50〜100語程度']
          ]),
          P('学習上は、全部丸暗記する必要はありません。最初に見るべきなのは次のグループです。'),
          STEPS([
            ['', '変数を作る言葉', 'Java       → 型名 + 変数名\nJavaScript → let, const\nPython     → そのまま代入'],
            ['', '関数を作る言葉', 'Java       → public, void, 戻り値型\nJavaScript → function, =>\nPython     → def'],
            ['', '条件分岐', 'if, else, switch, elif'],
            ['', '繰り返し', 'for, while, break, continue'],
            ['', '型・データ', 'int, String, boolean\nNumber, String, Array, Object\nint, str, list, dict, bool'],
            ['', '出力', 'System.out.println\nconsole.log\nprint'],
            ['', '取り込み', 'import\nrequire\nfrom']
          ])
        ]},
        { t: '「名詞・動詞」で見るとかなり分かりやすい', b: [
          P('プログラミング言語の単語は、英語っぽく見ると理解しやすいです。'),
          H('名詞っぽいもの'),
          GLOSS([
            ['User', '利用者を表すクラス・データ'],
            ['String', '文字列型。文字の並び'],
            ['int', '整数。小数点のない数'],
            ['Array', '配列。番号で取り出す複数データ'],
            ['Object', 'オブジェクト。キーと値の集まり'],
            ['List', '順番付きの集合'],
            ['Map', 'キーと値の組'],
            ['dict', 'Pythonの辞書。キーと値の組'],
            ['name', '名前を入れる項目'],
            ['email', 'メールアドレスを入れる項目'],
            ['age', '年齢を入れる項目']
          ]),
          P('これは「もの」「データ」「型」「設計図」を表します。'),
          H('動詞っぽいもの'),
          GLOSS([
            ['print', '表示する'],
            ['println', '改行付きで表示する（Java）'],
            ['log', 'ログとして表示・記録する'],
            ['return', '結果を返す'],
            ['import', '他のモジュールを取り込む'],
            ['changeEmail', 'メールアドレスを変える（自作メソッド）'],
            ['getName', '名前を取得する（自作メソッド）'],
            ['setAge', '年齢を設定する（自作メソッド）'],
            ['append', '末尾に追加する'],
            ['remove', '取り除く'],
            ['parse', '解析して構造化データにする'],
            ['fetch', '通信してデータを取りに行く']
          ]),
          P('これは「何かをする処理」を表します。'),
          H('文法の接着剤っぽいもの'),
          GLOSS([
            ['public', 'どこからでも使えると示す'],
            ['private', '内部専用だと示す'],
            ['class', 'ここからクラスだと示す'],
            ['def', 'ここから関数だと示す（Python）'],
            ['function', 'ここから関数だと示す（JavaScript）'],
            ['if', 'ここから条件分岐だと示す'],
            ['else', '条件に合わなかった側の処理'],
            ['for', 'ここからくり返しだと示す'],
            ['while', '条件付きのくり返し'],
            ['try', 'ここから失敗しうる処理だと示す'],
            ['catch', 'エラーを受け止める場所（Java / JS）'],
            ['except', 'エラーを受け止める場所（Python）']
          ]),
          P('これは自然言語でいう助詞や構文ルールに近いです。機械に対して「ここからクラスです」「ここから関数です」「条件分岐です」と構造を伝えます。'),
          NOTE('String や print は単なる英単語ではなく、その言語や実行環境の中で特別な意味を割り当てられた識別子・キーワード・API名'),
          P('Java、JavaScript、Pythonで似た英単語が出てきても、「予約語なのか」「型なのか」「関数なのか」「標準ライブラリなのか」は別々に見る必要があります。')
        ]}
      ]
    };
  }

function c4() {
    return {
      tab: '④ SQL / NoSQL', col: 'oklch(0.50 0.13 160)', soft: 'oklch(0.93 0.04 160)',
      title: 'データベースも名詞と動詞',
      desc: '「名詞＝データの構造」「動詞＝データに対する操作」「文法＝条件や並べ方」で見るとかなり理解しやすい。',
      sections: [
        { t: 'SQL / NoSQLの基本イメージ', b: [
          P('いいですね。SQL / NoSQL編でも、同じように「名詞＝データの構造」「動詞＝データに対する操作」「文法＝条件や並べ方」で見るとかなり理解しやすいです。'),
          P('まず表記は、一般的には NonSQL ではなく NoSQL と呼びます。意味は「SQLを使わない」だけではなく、現在では Not only SQL = SQLだけではないデータベース というニュアンスで使われることが多いです。'),
          MONO('SQL系\n= 表形式でデータを管理する\n= テーブル、行、列、主キー、外部キー\n= SQLという言語で操作する\n\nNoSQL系\n= 表以外の形でもデータを管理する\n= JSON風、キーと値、グラフ、時系列など\n= DBごとに操作方法が違う'),
          P('たとえるなら、'),
          PAIRS([
            ['SQL', '→ Excelの表を超厳密にしたもの'],
            ['NoSQL', '→ JSONの束、巨大な辞書、関係図、ログ置き場など']
          ])
        ]},
        { t: 'SQL編：名詞系の用語', b: [
          P('SQLでは、まずこの名詞を押さえると強いです。'),
          CARDS([
            ['データベース', 'database', 'テーブルなどを入れる大きな箱'],
            ['テーブル', 'table', '表。データを種類ごとに入れる場所'],
            ['カラム / 列', 'column', '項目名。name, email, price など'],
            ['レコード / 行', 'row / record', '1件分のデータ'],
            ['フィールド', 'field', '行の中の1つの値を指すことが多い'],
            ['値', 'value', '実際の中身'],
            ['主キー', 'primary key', '1件を一意に識別するID'],
            ['外部キー', 'foreign key', '別テーブルとの関連を示すID'],
            ['インデックス', 'index', '検索を速くするための索引'],
            ['スキーマ', 'schema', 'テーブル構造の定義'],
            ['クエリ', 'query', 'DBへの問い合わせ文'],
            ['トランザクション', 'transaction', '複数処理を1セットで成功/失敗させる仕組み']
          ]),
          P('例：'),
          CODE('TABLE: users', 'id | name | email              | age\n1  | 佐藤 | sato@example.com   | 28\n2  | 鈴木 | suzuki@example.com | 35'),
          P('この場合、'),
          MONO('users\n→ テーブル\n\nid, name, email, age\n→ カラム\n\n1, 佐藤, sato@example.com, 28\n→ 1行 / 1レコード\n\n1\n→ idカラムの値\n\nid\n→ 主キーになりやすい')
        ]},
        { t: 'SQL編：動詞系の用語', b: [
          P('SQLは、かなり動詞がはっきりしています。'),
          CARDS([
            ['SELECT', '選ぶ / 取得する', 'データを読む'],
            ['INSERT', '挿入する / 追加する', '新しいデータを入れる'],
            ['UPDATE', '更新する', '既存データを変える'],
            ['DELETE', '削除する', 'データを消す'],
            ['CREATE', '作る', 'テーブルやDBを作る'],
            ['ALTER', '変更する', 'テーブル構造を変える'],
            ['DROP', '捨てる / 削除する', 'テーブル自体を消す'],
            ['JOIN', '結合する', '複数テーブルをつなぐ'],
            ['WHERE', '絞り込む', '条件に合う行だけ対象にする'],
            ['ORDER BY', '並べ替える', '昇順・降順にする'],
            ['GROUP BY', 'グループ化する', '共通項目ごとにまとめる'],
            ['COUNT', '数える', '件数を数える'],
            ['SUM', '合計する', '合計値を出す'],
            ['AVG', '平均する', '平均値を出す'],
            ['MAX / MIN', '最大・最小を取る', '最大値・最小値を出す']
          ]),
          P('SQLの中心は、CRUDです。'),
          MONO('Create → INSERT\nRead   → SELECT\nUpdate → UPDATE\nDelete → DELETE')
        ]},
        { t: 'SQLは「英語の命令文」っぽい', b: [
          P('たとえばこれ。'),
          CODE('SQL', 'SELECT name, email\nFROM users\nWHERE age >= 18\nORDER BY age DESC;'),
          P('日本語にすると、'),
          LIST(['usersテーブルから', 'ageが18以上の行だけを対象にして', 'nameとemailを選び', 'ageの大きい順に並べる']),
          P('分解すると、'),
          MONO('SELECT name, email\n→ nameとemailを選べ\n\nFROM users\n→ usersテーブルから\n\nWHERE age >= 18\n→ ageが18以上のものだけ\n\nORDER BY age DESC\n→ ageの降順で並べろ'),
          NOTE('SQLはかなり「動詞 + 条件 + 対象」の形')
        ]},
        { t: 'SQLの処理を動詞で見る', b: [
          H('データを取得する'),
          CODE('SQL', 'SELECT * FROM users;'),
          P('usersから全部取得する'),
          H('条件で絞る'),
          CODE('SQL', 'SELECT * FROM users\nWHERE age >= 18;'),
          P('18歳以上だけ絞り込む'),
          H('追加する'),
          CODE('SQL', "INSERT INTO users (name, email, age)\nVALUES ('佐藤', 'sato@example.com', 28);"),
          P('usersに新しいユーザーを追加する'),
          H('更新する'),
          CODE('SQL', "UPDATE users\nSET email = 'new@example.com'\nWHERE id = 1;"),
          P('idが1のユーザーのemailを更新する'),
          H('削除する'),
          CODE('SQL', 'DELETE FROM users\nWHERE id = 1;'),
          P('idが1のユーザーを削除する'),
          H('結合する'),
          CODE('SQL', 'SELECT users.name, orders.total\nFROM users\nJOIN orders ON users.id = orders.user_id;'),
          LIST(['usersとordersを', 'ユーザーIDで結合して', '名前と注文金額を取得する'])
        ]},
        { t: 'SQLの「品詞」っぽい整理', b: [
          CARDS([
            ['名詞', 'users, email, age', 'テーブル、カラム、値'],
            ['動詞', 'SELECT, INSERT, UPDATE, DELETE', '操作'],
            ['条件', 'WHERE age >= 18', '絞り込み'],
            ['接続', 'JOIN, ON', '結合'],
            ['並び', 'ORDER BY', 'ソート'],
            ['まとまり', 'GROUP BY', '集計'],
            ['数える・計算', 'COUNT, SUM, AVG', '集計関数']
          ]),
          P('つまりSQLは、'),
          FLOW(['どのテーブルから', 'どのカラムを', 'どんな条件で', 'どう並べて', 'どう集計するか']),
          P('を書く言語です。')
        ]},
        { t: 'NoSQL編：4系統', b: [
          P('NoSQLは種類が複数あります。SQLほど用語が統一されていません。代表的にはこの4系統です。'),
          ROWS(['代表DB', 'データの形', '得意なこと'], [
            ['ドキュメントDB', '', 'MongoDB, Firestore', 'JSON風ドキュメント', '柔軟なデータ構造'],
            ['キーバリューDB', '', 'Redis, DynamoDB', 'key → value', '高速な参照'],
            ['カラム指向DB', '', 'Cassandra, HBase', '行 + 多数の列', '大量データ・分散処理'],
            ['グラフDB', '', 'Neo4j', 'ノード + 関係', '関係性の探索']
          ])
        ]},
        { t: 'ドキュメントDBの用語', b: [
          P('MongoDBやFirestoreのようなDBです。'),
          CARDS([
            ['database', 'SQLでは database', '大きな箱'],
            ['collection', 'SQLでは table', 'ドキュメントの集合'],
            ['document', 'SQLでは row / record', '1件のJSON風データ'],
            ['field', 'SQLでは column', '項目'],
            ['value', 'SQLでは value', '値'],
            ['object', 'SQLでは JSON object', '入れ子のまとまり'],
            ['array', 'SQLでは 配列的な値', '配列'],
            ['_id', 'SQLでは primary key', '一意なID']
          ]),
          P('例：'),
          CODE('JSON', '{\n  "_id": "U001",\n  "name": "佐藤",\n  "email": "sato@example.com",\n  "age": 28,\n  "tags": ["premium", "newsletter"],\n  "address": {\n    "prefecture": "Tokyo",\n    "city": "Shibuya"\n  }\n}'),
          P('この場合、'),
          MONO('このJSON風の1件\n→ document\n\nname, email, age, tags, address\n→ field\n\n"佐藤", 28, ["premium", "newsletter"]\n→ value\n\naddressの中身\n→ object\n\ntags\n→ array'),
          P('SQLよりも、1件の中に複雑な構造を入れやすいです。')
        ]},
        { t: 'NoSQLの動詞系', b: [
          P('NoSQLでも基本はCRUDです。'),
          ROWS(['MongoDB風', 'Firestore風', 'Redis風'], [
            ['作る / 追加する', '', 'insertOne', 'set, add', 'SET'],
            ['取得する', '', 'find, findOne', 'get', 'GET'],
            ['更新する', '', 'updateOne', 'update', 'SET, HSET'],
            ['削除する', '', 'deleteOne', 'delete', 'DEL'],
            ['絞り込む', '', 'find({ 条件 })', 'where', 'キー設計次第'],
            ['並べる', '', 'sort', 'orderBy', '用途次第'],
            ['件数', '', 'countDocuments', 'count', 'SCARD, LLEN など']
          ]),
          P('NoSQLはDBごとに命令の名前がかなり違います。SQLはだいたい、'),
          CHIPS(['SELECT', 'INSERT', 'UPDATE', 'DELETE']),
          P('で統一されています。NoSQLは、'),
          GLOSS([
            ['find', '条件に合うデータを探す'],
            ['get', 'キーを指定して1件取得する'],
            ['set', '値を設定する。上書きも含む'],
            ['put', '1件まるごと保存する'],
            ['insert', '新しいデータを追加する'],
            ['update', '既存データの一部を変える'],
            ['delete', 'データを消す'],
            ['scan', '全体を走査する。遅くなりやすい'],
            ['query', 'キーや条件を指定して検索する']
          ]),
          P('など、DBごとのAPI名になります。')
        ]},
        { t: 'SQLとNoSQLの大きな違い', b: [
          ROWS(['SQL', 'NoSQL'], [
            ['データ構造', '', '表形式', 'JSON風、key-value、グラフなど'],
            ['スキーマ', '', '事前に厳密に決めることが多い', '柔軟なことが多い'],
            ['関係性', '', 'JOINが得意', 'JOINは弱い/設計で避けることが多い'],
            ['整合性', '', '強い整合性を重視しやすい', 'スケールや速度を重視しやすい'],
            ['クエリ', '', 'SQLで統一的', 'DBごとに違う'],
            ['向いている用途', '', '業務データ、会計、在庫、注文', 'ログ、キャッシュ、柔軟なJSON、巨大分散データ']
          ]),
          P('かなり雑に言うと、'),
          PAIRS([
            ['SQL', '→ 正確性・整合性・関係性に強い'],
            ['NoSQL', '→ 柔軟性・速度・スケールに強い']
          ])
        ]},
        { t: 'SQLの「JOIN」とNoSQLの「埋め込み」', b: [
          P('ここは重要です。SQLでは、データを分けて持つことが多いです。'),
          CODE('TABLE: users', 'id | name\n1  | 佐藤'),
          CODE('TABLE: orders', 'id  | user_id | total\n101 | 1       | 5000'),
          P('取得するときにJOINします。'),
          CODE('SQL', 'SELECT users.name, orders.total\nFROM users\nJOIN orders ON users.id = orders.user_id;'),
          P('一方、NoSQLでは、1つのドキュメントに埋め込むことがあります。'),
          CODE('JSON', '{\n  "orderId": "101",\n  "user": {\n    "id": "1",\n    "name": "佐藤"\n  },\n  "total": 5000\n}'),
          P('違いはこうです。'),
          MONO('SQL\n→ 正規化して分ける\n→ 必要なときにJOINする\n\nNoSQL\n→ よく一緒に使うデータは埋め込む\n→ 読み取りを速くする'),
          P('ただし、NoSQLでも何でも埋め込めばよいわけではありません。更新頻度やデータ量によって設計します。')
        ]},
        { t: 'SQLでよく出る「制約」系の用語', b: [
          P('SQLはデータの正しさを守る仕組みが多いです。'),
          CARDS([
            ['PRIMARY KEY', '', '主キー。1件を一意に識別'],
            ['FOREIGN KEY', '', '外部キー。別テーブルとの関係'],
            ['NOT NULL', '', '空を許さない'],
            ['UNIQUE', '', '重複を許さない'],
            ['DEFAULT', '', '値がないときの初期値'],
            ['CHECK', '', '条件を満たす値だけ許可'],
            ['INDEX', '', '検索高速化'],
            ['TRANSACTION', '', '複数処理をまとめる'],
            ['COMMIT', '', '確定'],
            ['ROLLBACK', '', '取り消し']
          ]),
          P('例：'),
          CODE('SQL', 'CREATE TABLE users (\n  id INT PRIMARY KEY,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  age INT CHECK (age >= 0)\n);'),
          P('これは日本語にすると、'),
          LIST(['usersテーブルを作る', 'idは主キー', 'emailは重複不可で空も不可', 'ageは0以上だけ許可']),
          P('です。SQLは「変なデータが入らないようにDB側で守る」設計がしやすいです。')
        ]},
        { t: 'NoSQLでよく出る設計用語', b: [
          CARDS([
            ['document', '', 'JSON風の1件データ'],
            ['collection', '', 'documentの集合'],
            ['key', '', 'データを探すためのキー'],
            ['value', '', 'キーに対応する値'],
            ['partition key', '', 'データ分散・検索の軸'],
            ['sort key', '', '同じpartition内で並べるキー'],
            ['index', '', '検索を速くする索引'],
            ['denormalization', '', '非正規化。あえて重複して持つ'],
            ['embedding', '', '1件の中に関連データを埋め込む'],
            ['reference', '', 'IDで別データを参照する'],
            ['TTL', '', '一定時間後に自動削除'],
            ['eventual consistency', '', '結果整合性。少し遅れて整合する考え方']
          ]),
          P('DynamoDB系では特に、'),
          GLOSS([
            ['partition key', 'データを分ける・探すための主軸になるキー'],
            ['sort key', '同じpartitionの中で並べる・絞るためのキー'],
            ['GSI', 'Global Secondary Index。別のキーで検索するための索引'],
            ['LSI', 'Local Secondary Index。同じpartition内で別の並び順を使う索引'],
            ['item', '1件のデータ。SQLの行にあたる'],
            ['attribute', 'itemの中の項目。SQLの列にあたる']
          ]),
          P('が重要です。'),
          MONO('Item\n→ 1件のデータ\n\nAttribute\n→ その中の項目\n\nPartition Key\n→ データを分ける・探すための主軸\n\nSort Key\n→ 同じPartition内で並べる・絞るための軸')
        ]},
        { t: 'SQL / NoSQLを「動詞」で比較', b: [
          ROWS(['SQL', 'NoSQL'], [
            ['作る', '', 'CREATE TABLE', 'collection作成、key作成'],
            ['追加する', '', 'INSERT', 'insert, put, set'],
            ['取得する', '', 'SELECT', 'find, get, query, scan'],
            ['絞り込む', '', 'WHERE', 'filter / query条件'],
            ['更新する', '', 'UPDATE SET', 'update, set'],
            ['削除する', '', 'DELETE', 'delete, del'],
            ['結合する', '', 'JOIN', 'アプリ側で結合、または埋め込み'],
            ['並べ替える', '', 'ORDER BY', 'sort, orderBy, sort key'],
            ['集計する', '', 'GROUP BY, COUNT, SUM', 'aggregation pipeline, 別集計設計'],
            ['確定する', '', 'COMMIT', 'DBによる'],
            ['巻き戻す', '', 'ROLLBACK', 'DBによる']
          ])
        ]},
        { t: '具体例：ユーザー一覧から成人だけ取り出す', b: [
          H('SQL'),
          CODE('SQL', 'SELECT *\nFROM users\nWHERE age >= 18;'),
          LIST(['usersテーブルから', 'ageが18以上の行を取得する']),
          H('MongoDB風'),
          CODE('MONGODB', 'db.users.find({ age: { $gte: 18 } });'),
          LIST(['usersコレクションから', 'ageが18以上のドキュメントを探す']),
          H('JavaScript配列'),
          CODE('JAVASCRIPT', 'users.filter(user => user.age >= 18);'),
          LIST(['users配列から', 'ageが18以上の要素だけ残す']),
          P('見た目は違いますが、やっていることは同じです。'),
          NOTE('大量のデータから条件に合うものだけ抽出する')
        ]},
        { t: 'SQL / NoSQL / JSONの関係', b: [
          P('ここも混乱しやすいです。'),
          PAIRS([
            ['SQL', '→ データベースを操作するための言語'],
            ['NoSQL', '→ SQL以外の方式も含むデータベース分類'],
            ['JSON', '→ データの表現形式'],
            ['MongoDB / Firestore', '→ JSONに近い形でデータを保存するNoSQL DB'],
            ['PostgreSQL / MySQL', '→ SQLで操作するRDB']
          ]),
          P('つまり、'),
          MONO('SQL vs NoSQL\n→ データベースの種類・思想の違い\n\nJSON\n→ データの書き方・形式\n\nSQL\n→ データベースへの命令文')
        ]},
        { t: '品詞で見るSQL / NoSQL', b: [
          H('SQL'),
          PAIRS([
            ['名詞', 'database, table, column, row, key, index'],
            ['動詞', 'SELECT, INSERT, UPDATE, DELETE, CREATE, DROP'],
            ['条件', 'WHERE, HAVING'],
            ['接続', 'JOIN, ON'],
            ['並び', 'ORDER BY'],
            ['集計', 'GROUP BY, COUNT, SUM, AVG'],
            ['制約', 'PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL']
          ]),
          H('NoSQL'),
          PAIRS([
            ['名詞', 'database, collection, document, item, attribute, key, value, node, edge'],
            ['動詞', 'get, set, put, find, query, scan, insert, update, delete'],
            ['条件', 'filter, where, match'],
            ['並び', 'sort, orderBy, sort key'],
            ['設計', 'embed, reference, denormalize, partition, shard'],
            ['高速化', 'index, cache']
          ])
        ]},
        { t: 'まとめ', b: [
          P('SQL / NoSQL編を一言でまとめるとこうです。'),
          PAIRS([
            ['SQL', '= 表に対して、SELECT / INSERT / UPDATE / DELETE する世界'],
            ['NoSQL', '= JSON風データやkey-valueなどに対して、get / set / find / query する世界']
          ]),
          P('プログラミングの「動詞」で見るなら、'),
          H('SQLでよく使う動詞'),
          MONO('SELECT   選ぶ\nINSERT   追加する\nUPDATE   更新する\nDELETE   削除する\nJOIN     結合する\nFILTER   絞り込む\nGROUP    まとめる\nSORT     並べる\nCOUNT    数える\nCOMMIT   確定する\nROLLBACK 巻き戻す'),
          H('NoSQLでよく使う動詞'),
          MONO('get       取得する\nset       設定する\nput       保存する\nfind      探す\nquery     条件検索する\nscan      全体走査する\nupdate    更新する\ndelete    削除する\nembed     埋め込む\nreference 参照する\npartition 分割する\nindex     索引化する\ncache     一時保存する'),
          P('かなり本質的には、DB操作もプログラミングと同じで、'),
          NOTE('データを 作る・探す・絞る・取り出す・変える・消す・まとめる・保存する'),
          P('という動詞の組み合わせです。')
        ]}
      ]
    };
  }
