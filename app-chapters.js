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

      { t: 'クラスとインターフェース', b: [
        P('Javaはすべてがクラスの中にあります。まず基本の形です。'),
        CODE('JAVA', 'public class User {\n    // フィールド（このクラスが持つデータ）\n    private String name;\n    private int age;\n\n    // コンストラクタ（new したときに呼ばれる）\n    public User(String name, int age) {\n        this.name = name;   // this は「このオブジェクト自身」\n        this.age = age;\n    }\n\n    // メソッド（このクラスができること）\n    public String getName() {\n        return name;\n    }\n\n    public boolean isAdult() {\n        return age >= 18;\n    }\n}\n\n// 使う側\nUser u = new User("Taro", 20);\nSystem.out.println(u.getName());'),
        GLOSS([
          ['class', '設計図。これを元に new で実体を作る'],
          ['フィールド', 'クラスが持つデータ。インスタンス変数とも言う'],
          ['コンストラクタ', 'new のときに一度だけ動く。クラス名と同じ名前で書く'],
          ['メソッド', 'クラスが持つ処理'],
          ['this', 'そのオブジェクト自身。引数と同名のフィールドを区別するのに使う'],
          ['new', '設計図から実体を作る'],
          ['public', 'どこからでも使える'],
          ['private', 'そのクラスの中からしか使えない。フィールドは基本これ'],
          ['protected', '同じパッケージと、継承した子クラスから使える'],
          ['static', 'オブジェクトを作らずに使える。クラスに属する'],
          ['final', '後から変更できない。変数・メソッド・クラスに付く'],
          ['getter / setter', 'privateなフィールドを読み書きするためのメソッド']
        ]),
        H('インターフェース — 「できること」の約束'),
        P('中身を書かず、「このメソッドを持っていること」だけを決めます。実装するクラスは、必ずそのメソッドを用意しなければなりません。'),
        CODE('JAVA', '// 約束を決める\npublic interface Greeter {\n    String greet();          // 中身は書かない\n\n    default String hello() { // default を付けると中身を書ける\n        return "Hello, " + greet();\n    }\n}\n\n// 約束を守るクラス\npublic class JapaneseGreeter implements Greeter {\n    @Override\n    public String greet() {\n        return "こんにちは";\n    }\n}\n\n// 受け取る側は「中身」ではなく「約束」を知っていればよい\nGreeter g = new JapaneseGreeter();\nSystem.out.println(g.hello());'),
        P('これが⑬章のDI（依存性注入）につながります。使う側がインターフェースだけを見ていれば、実装を差し替えられるからです。'),
        ROWS(['interface', 'abstract class'], [
          ['何を決める', '', 'できること（振る舞い）の約束', '共通の土台＋一部の実装'],
          ['フィールド', '', '基本は持てない（定数のみ）', '持てる'],
          ['実装', '', 'default を付けたものだけ', '書いても書かなくてもよい'],
          ['いくつ継承できるか', '', '複数 implements できる', '1つだけ extends できる'],
          ['使い分け', '', '「〜できる」を表す。迷ったらこちら', '「〜の一種」で、共通コードを持たせたいとき']
        ]),
        GLOSS([
          ['implements', 'インターフェースの約束を守る宣言'],
          ['extends', 'クラスを継承する。親の機能を引き継ぐ'],
          ['abstract', '中身のないメソッド／実体を作れないクラス'],
          ['@Override', '親やインターフェースのメソッドを上書きする印。書き間違いを防ぐ'],
          ['default メソッド', 'インターフェース側に既定の実装を持たせる'],
          ['record', '値を入れるだけのクラスを1行で作る（Java 16〜）'],
          ['enum', '決まった選択肢の集合。Status.ACTIVE など'],
          ['ポリモーフィズム', '同じ呼び方で、実体ごとに違う動きをすること']
        ])
      ]},

      { t: '例外処理 — Javaは「検査例外」が特徴', b: [
        P('エラーが起きたとき、処理を止めて呼び出し元へ知らせる仕組みです。基本形は他の言語と同じです。'),
        CODE('JAVA', 'try {\n    int result = 10 / divisor;\n    System.out.println(result);\n} catch (ArithmeticException e) {\n    // 0で割ったときなど\n    System.out.println("計算できません: " + e.getMessage());\n} catch (Exception e) {\n    // それ以外すべて。広い型は後ろに書く\n    System.out.println("予期しないエラー");\n} finally {\n    // 成功しても失敗しても必ず通る\n    System.out.println("終了");\n}'),
        H('Javaだけの特徴 — 検査例外'),
        P('Javaには「必ず対処を書かないとコンパイルが通らない例外」があります。他の多くの言語にはない仕組みです。'),
        ROWS(['対処', '例'], [
          ['検査例外', 'Checked', 'try-catch するか、throws で宣言しないとコンパイルエラー', 'IOException, SQLException'],
          ['非検査例外', 'Unchecked', '書かなくてもコンパイルは通る。実行時に落ちる', 'NullPointerException, IllegalArgumentException'],
          ['Error', '', '基本的に捕まえない。回復不能', 'OutOfMemoryError, StackOverflowError']
        ]),
        CODE('JAVA', '// 自分で処理せず、呼び出し元に投げる宣言\npublic String read(String path) throws IOException {\n    return Files.readString(Path.of(path));\n}\n\n// 自分で投げる\nif (age < 0) {\n    throw new IllegalArgumentException("年齢が不正です");\n}'),
        H('try-with-resources'),
        P('ファイルや接続など「使い終わったら閉じる必要があるもの」は、この形で書くと自動で閉じてくれます。'),
        CODE('JAVA', '// ( ) の中で作ったものは、抜けるときに自動で close される\ntry (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {\n    System.out.println(br.readLine());\n} catch (IOException e) {\n    e.printStackTrace();\n}\n// finally で br.close() を書く必要がない'),
        GLOSS([
          ['try', '失敗するかもしれない処理を囲む'],
          ['catch', '例外を受け止める。型ごとに分けられる'],
          ['finally', '成功・失敗にかかわらず必ず実行'],
          ['throw', '例外を発生させる'],
          ['throws', 'このメソッドは例外を投げうる、という宣言'],
          ['Exception', '例外の基本型。検査例外の親'],
          ['RuntimeException', '非検査例外の親'],
          ['e.getMessage()', 'エラーの説明文を取り出す'],
          ['e.printStackTrace()', 'どこで起きたかの経路を出力する'],
          ['カスタム例外', 'Exception を継承して自作する']
        ]),
        NOTE('catch して何もしないのが最悪。\n握りつぶすと、原因が永久に分からなくなる。')
      ]},

      { t: 'Stream API — 一覧の加工を流れで書く', b: [
        P('コレクションを「流れ」として扱い、絞る・変換する・集めるをつなげて書きます。JavaScriptのfilter / mapに当たる機能です。'),
        CODE('従来の書き方', 'List<String> names = new ArrayList<>();\nfor (User user : users) {\n    if (user.getAge() >= 18) {\n        names.add(user.getName());\n    }\n}'),
        CODE('STREAM', 'List<String> names = users.stream()\n    .filter(user -> user.getAge() >= 18)   // 絞る\n    .map(User::getName)                     // 変換する\n    .sorted()                               // 並べる\n    .toList();                              // 集める'),
        P('やっていることは同じですが、「何をしたいか」が上から順に読めます。'),
        MONO('users.stream()   → 流れを作る\n.filter(...)     → 条件に合うものだけ残す（中間操作）\n.map(...)        → 別の形に変換する（中間操作）\n.sorted()        → 並べ替える（中間操作）\n.toList()        → 結果を確定させる（終端操作）'),
        NOTE('中間操作をいくつ書いても、終端操作を呼ぶまで何も動かない。\n終端操作は1回しか使えない。'),
        GLOSS([
          ['stream()', 'コレクションから流れを作る'],
          ['filter', '条件に合うものだけ残す'],
          ['map', '1件ずつ別の形に変換する'],
          ['sorted', '並べ替える'],
          ['distinct', '重複を除く'],
          ['limit / skip', '件数を絞る／先頭を飛ばす'],
          ['count', '件数を数える'],
          ['toList()', 'リストにして確定（Java 16〜）'],
          ['collect(Collectors.toList())', '同じ意味の従来の書き方'],
          ['Collectors.groupingBy', 'キーごとにまとめる。SQLのGROUP BYに近い'],
          ['findFirst', '最初の1件を取る。Optional で返る'],
          ['anyMatch / allMatch', '条件に合うものがあるか／全部そうか'],
          ['reduce', '畳み込んで1つの値にする'],
          ['User::getName', 'メソッド参照。user -> user.getName() の短縮形'],
          ['-> ', 'ラムダ式。その場で小さな関数を書く記法']
        ]),
        H('Optional — 「無いかもしれない」を型で表す'),
        CODE('JAVA', 'Optional<User> found = users.stream()\n    .filter(u -> u.getName().equals("Taro"))\n    .findFirst();\n\n// 中身を安全に取り出す\nString name = found\n    .map(User::getName)\n    .orElse("見つかりません");\n\n// あったときだけ実行\nfound.ifPresent(u -> System.out.println(u.getName()));'),
        P('null を返す代わりにOptionalを返すことで、「確認せずに使う」ミスを防げます。⑦章のKotlin・Swiftのnull安全と同じ発想です。')
      ]},

      { t: 'ジェネリクス — 中身の型を後から決める', b: [
        P('List<String> の < > がジェネリクスです。「文字列を入れるリスト」と型を指定しておくことで、取り出すときにキャストが要らなくなります。'),
        CODE('JAVA', '// 型を指定する\nList<String> names = new ArrayList<>();\nnames.add("Taro");\nString first = names.get(0);   // そのまま String として使える\n\n// 指定しないと（古い書き方。今は避ける）\nList raw = new ArrayList();\nraw.add("Taro");\nString bad = (String) raw.get(0);   // 毎回キャストが必要で、間違えると実行時エラー'),
        H('自分で作る'),
        CODE('JAVA', '// T は「使うときに決まる型」の入れ物\npublic class Box<T> {\n    private T value;\n\n    public void set(T value) { this.value = value; }\n    public T get() { return value; }\n}\n\nBox<String> b1 = new Box<>();\nb1.set("Taro");\nString s = b1.get();      // String として取り出せる\n\nBox<Integer> b2 = new Box<>();\nb2.set(20);'),
        CODE('JAVA', '// メソッドだけをジェネリックにもできる\npublic static <T> T firstOf(List<T> list) {\n    return list.get(0);\n}\n\n// 型に条件を付ける（Number とその子だけ）\npublic static <T extends Number> double sum(List<T> list) {\n    double total = 0;\n    for (T n : list) {\n        total += n.doubleValue();\n    }\n    return total;\n}'),
        GLOSS([
          ['<T>', '型そのものを受け取る印。T は Type の頭文字で慣習的な名前'],
          ['<E>', '要素（Element）。コレクションでよく使われる'],
          ['<K, V>', 'キーと値。Map<K, V> のように使う'],
          ['<T extends X>', 'Xか、その子の型だけ許す（上限）'],
          ['<T super X>', 'Xか、その親の型だけ許す（下限）'],
          ['<?>', 'ワイルドカード。「何かの型」。読み取り専用のときに使う'],
          ['<>', 'ダイヤモンド演算子。右辺の型指定を省略できる'],
          ['型消去', 'コンパイル後に型情報が消える仕組み。実行時に T が何かは分からない']
        ]),
        NOTE('Javaのジェネリクスも、実行時には型情報が消える（型消去）。\n⑤章のTypeScriptと同じ性質で、new T() のような書き方はできない。'),
        P('⑤章のTypeScriptのジェネリクスと記法がほぼ同じです。JavaのList<String>を理解していれば、TypeScriptのArray<string>もそのまま読めます。')
      ]},

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

      { t: 'リスト内包表記 — Pythonらしい書き方の代表', b: [
        P('「リストから条件に合うものを集めて、新しいリストを作る」処理を1行で書く記法です。Pythonのコードを読むと必ず出てきます。'),
        CODE('従来の書き方', 'adults = []\nfor user in users:\n    if user["age"] >= 18:\n        adults.append(user)'),
        CODE('リスト内包表記', 'adults = [user for user in users if user["age"] >= 18]'),
        P('読む順番は「後ろから前」ではなく、次の3つに分けると分かりやすいです。'),
        MONO('[ user            for user in users        if 条件 ]\n  ↑ 何を入れるか   ↑ どこから取るか        ↑ 絞り込み'),
        H('変換もできる'),
        CODE('PYTHON', '# 名前だけ取り出す\nnames = [user["name"] for user in users]\n\n# 条件つきで変換する\nlabels = [u["name"] for u in users if u["age"] >= 18]\n\n# 値そのものを加工する\ndoubled = [n * 2 for n in [1, 2, 3]]      # [2, 4, 6]\n\n# if-else を入れる場合は前に書く（位置が変わるので注意）\nlabels2 = ["大人" if u["age"] >= 18 else "子供" for u in users]'),
        NOTE('絞り込みの if は後ろ。\n値を選ぶ if-else は前。ここが紛らわしい。'),
        H('リスト以外にも使える'),
        CODE('PYTHON', '# 辞書内包表記 — { キー: 値 for ... }\nages = {u["name"]: u["age"] for u in users}\n# {"Taro": 20, "Hana": 15}\n\n# 集合内包表記 — 重複が消える\nunique = {u["age"] for u in users}\n\n# ジェネレータ式 — ( ) にすると、その場で全部作らない\ntotal = sum(u["age"] for u in users)'),
        GLOSS([
          ['[ ... for ... ]', 'リスト内包表記。新しいリストを作る'],
          ['{ k: v for ... }', '辞書内包表記'],
          ['{ ... for ... }', '集合内包表記。重複が除かれる'],
          ['( ... for ... )', 'ジェネレータ式。1件ずつ作るのでメモリを使わない'],
          ['enumerate', 'for i, x in enumerate(xs) で番号つきで回す'],
          ['zip', '2つのリストを組にして同時に回す'],
          ['sorted(xs, key=...)', '並べ替え。keyに並べ替えの基準を渡す'],
          ['sum / max / min / len', 'よく組み合わせる組み込み関数']
        ]),
        NOTE('1行に詰め込みすぎると読めなくなる。\n入れ子が2段を超えたら、素直に for で書く。')
      ]},

      { t: 'デコレータ — @ の正体', b: [
        P('⑫章のFlaskやFastAPIで出てきた @app.route の正体です。「関数を受け取って、機能を足した関数を返す」仕組みで、Pythonでは関数もただの値として扱えることを利用しています。'),
        H('何をしているのか'),
        CODE('PYTHON', '# 関数を受け取り、包んで返す関数を作る\ndef with_log(func):\n    def wrapper(*args, **kwargs):\n        print(f"{func.__name__} を開始")\n        result = func(*args, **kwargs)   # 元の関数を呼ぶ\n        print(f"{func.__name__} を終了")\n        return result\n    return wrapper\n\n# @ を付けると…\n@with_log\ndef greet(name):\n    print(f"Hello, {name}")\n\ngreet("Taro")\n# greet を開始\n# Hello, Taro\n# greet を終了'),
        P('@with_log は、次の1行を短く書いたものです。'),
        CODE('PYTHON', 'greet = with_log(greet)'),
        NOTE('デコレータは「関数を包み直しているだけ」。\n魔法ではなく、ただの関数の受け渡し。'),
        H('よく見る組み込みのデコレータ'),
        GLOSS([
          ['@property', 'メソッドを、括弧なしの属性のように読めるようにする'],
          ['@staticmethod', 'selfを受け取らないメソッド。クラスに属する関数'],
          ['@classmethod', 'クラス自身（cls）を受け取るメソッド'],
          ['@dataclass', '値を入れるクラスの__init__などを自動生成する'],
          ['@functools.lru_cache', '同じ引数の結果を覚えて、2回目以降を速くする'],
          ['@functools.wraps', '包むときに、元の関数の名前や説明を保つ'],
          ['@abstractmethod', '子クラスに実装を強制する'],
          ['@app.route / @app.get', 'フレームワークがURLと関数を結びつける（⑫章）'],
          ['@pytest.fixture', 'テストの前準備を用意する']
        ]),
        CODE('PYTHON', 'from dataclasses import dataclass\n\n@dataclass\nclass User:\n    name: str\n    age: int\n\nu = User("Taro", 20)\nprint(u)          # User(name=\'Taro\', age=20) と自動で表示される\n\n\nclass Circle:\n    def __init__(self, r):\n        self._r = r\n\n    @property\n    def area(self):\n        return 3.14 * self._r ** 2\n\nc = Circle(2)\nprint(c.area)     # 括弧が要らない。c.area() ではない')
      ]},

      { t: '仮想環境とパッケージ管理', b: [
        P('Pythonで最初につまずくのがここです。何も考えずに pip install すると、パソコン全体に入ってしまい、プロジェクトごとに違うバージョンが必要になった瞬間に壊れます。'),
        FLOW(['プロジェクトAは requests 2.0 が必要', 'プロジェクトBは requests 3.0 が必要', '全体に入れると、どちらかが動かない']),
        P('そこで、プロジェクトごとに独立した箱（仮想環境）を作ります。'),
        CODE('SHELL', '# 1. 仮想環境を作る（.venv というフォルダができる）\npython -m venv .venv\n\n# 2. 有効にする\nsource .venv/bin/activate      # Mac / Linux\n.venv\\Scripts\\activate         # Windows\n\n# プロンプトの先頭に (.venv) が付けば成功\n\n# 3. この中に入れる。他のプロジェクトには影響しない\npip install requests\n\n# 4. 何が入っているか記録する\npip freeze > requirements.txt\n\n# 5. 別の環境で同じものを再現する\npip install -r requirements.txt\n\n# 6. 抜ける\ndeactivate'),
        NOTE('.venv フォルダは Git に入れない（.gitignore に書く）。\n代わりに requirements.txt を共有する。'),
        GLOSS([
          ['venv', '標準の仮想環境ツール。追加インストール不要'],
          ['activate', '仮想環境を有効にする。ここからの pip はこの中だけに入る'],
          ['deactivate', '仮想環境を抜ける'],
          ['pip', 'パッケージを入れる道具'],
          ['requirements.txt', '必要なパッケージを列挙したファイル'],
          ['pip freeze', '今入っているものをバージョン付きで書き出す'],
          ['site-packages', '実際にパッケージが置かれる場所'],
          ['pyproject.toml', '新しい標準の設定ファイル。poetryやuvが使う'],
          ['-e .', '開発中の自分のパッケージを、編集可能な状態で入れる']
        ]),
        H('新しい選択肢'),
        ROWS(['特徴', '設定ファイル'], [
          ['venv + pip', '標準', '追加インストール不要。確実だが手作業が多い', 'requirements.txt'],
          ['Poetry', '依存解決が賢い', '仮想環境の作成からロックまで一括。少し重い', 'pyproject.toml / poetry.lock'],
          ['uv', '非常に速い', 'Rust製。pip互換で動作が速い。近年急速に普及', 'pyproject.toml / uv.lock'],
          ['conda', 'データ分析向け', 'Python以外のライブラリも管理できる', 'environment.yml']
        ]),
        P('⑨章のロックファイルの話が、そのままここに当てはまります。バージョンを固定しておかないと「自分の環境では動く」が起こります。')
      ]},

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
