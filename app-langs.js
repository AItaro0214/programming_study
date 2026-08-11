// ⑤〜⑨章。app-data.js の P/H/NOTE/CODE/... ヘルパーをそのまま使う。

function c5() {
  return {
    tab: 'TypeScript', col: 'oklch(0.52 0.12 195)', soft: 'oklch(0.93 0.04 195)',
    title: 'TypeScript — JavaScriptに型をつける',
    desc: '書き方はJavaScriptのまま、Javaのような型チェックを足した言語。どこがJS寄りで、どこがJava寄りか。',
    sections: [
      { t: 'TypeScriptとは — JSに型を足したもの', b: [
        P('TypeScriptは、JavaScriptに「型」を足した言語です。JavaScriptとして正しいコードは、基本的にそのままTypeScriptとしても通ります（JavaScriptの上位互換）。'),
        P('ただし、ブラウザやNode.jsはTypeScriptを直接は実行できません。tsc（TypeScriptコンパイラ）でJavaScriptに変換してから動きます。'),
        FLOW(['TypeScript（.ts）', 'tsc でコンパイル', 'JavaScript（.js）', 'ブラウザ / Node.js が実行']),
        NOTE('型はコンパイル時のチェック用。\n変換後のJavaScriptに、型は1行も残らない。'),
        CARDS([
          ['なぜ使うか', '', '書いた時点で間違いに気づける。名前の打ち間違い、渡す値の型違いをエディタが赤く教えてくれる'],
          ['何が増えるか', '', '型注釈、interface、ジェネリクス、tsconfig.json、ビルド手順'],
          ['何が変わらないか', '', 'if / for / 関数 / クラス / 配列操作など、JavaScriptの文法そのもの']
        ])
      ]},
      { t: 'JavaScriptとの違い — 書き方で見る', b: [
        P('同じ処理を並べると、増えているのは「: 型」の部分だけだと分かります。'),
        CODE('JAVASCRIPT', 'function greet(name) {\n  return "Hello, " + name;\n}\n\nlet age = 20;\nconst users = [];'),
        CODE('TYPESCRIPT', 'function greet(name: string): string {\n  return "Hello, " + name;\n}\n\nlet age: number = 20;\nconst users: string[] = [];'),
        P('引数の後ろ、関数の後ろ、変数の後ろに「: 型」が付いただけです。'),
        ROWS(['JavaScript', 'TypeScript'], [
          ['型の宣言', '', 'なし', 'name: string のようにコロンで書く'],
          ['間違いに気づく時', '', '実行して初めてエラー', '書いている最中にエディタが指摘'],
          ['ファイル拡張子', '', '.js', '.ts（Reactでは .tsx）'],
          ['実行', '', 'そのまま動く', 'JSに変換してから動く'],
          ['型を書かないと', '', '常にその状態', '推論される。推論できない所だけ書けばよい']
        ]),
        NOTE('全部に型を書く必要はない。\n推論できない所（関数の引数など）だけ書くのが普通。')
      ]},
      { t: 'Javaとの違い — 型の考え方', b: [
        P('どちらも「型のある言語」ですが、型が効くタイミングと書き方が違います。'),
        CODE('JAVA', 'String name = "Taro";\nint age = 20;\nList<String> names = new ArrayList<>();'),
        CODE('TYPESCRIPT', 'const name: string = "Taro";\nconst age: number = 20;\nconst names: string[] = [];'),
        NOTE('Java       → 型 変数名\nTypeScript → 変数名: 型'),
        ROWS(['Java', 'TypeScript'], [
          ['型が効くタイミング', '', 'コンパイル時＋実行時（JVMが型を持つ）', 'コンパイル時だけ。実行時には消える'],
          ['型の位置', '', '変数名の前', '変数名の後ろにコロン'],
          ['型推論', '', 'var で一部可能', '基本は推論。書かなくても効く'],
          ['クラス', '', 'ほぼ必須。すべてクラスの中', 'あるが必須ではない。関数やオブジェクトだけでも書ける'],
          ['実行環境', '', 'JVM', 'JSに変換してブラウザ / Node.js'],
          ['「値がない」', '', 'null の1つ', 'null と undefined の2つある'],
          ['整数と小数', '', 'int / long / double と分かれる', 'number ひとつ（内部は浮動小数）']
        ]),
        P('TypeScriptの型は「実行前のチェック」に徹していて、Javaのように実行時まで型情報を持ち歩きません。ここが最大の違いです。')
      ]},
      { t: '基本の型を一語ずつ', b: [
        GLOSS([
          ['string', '文字列。"Taro" など'],
          ['number', '数値。整数も小数も全部これ'],
          ['boolean', '真偽値。true / false'],
          ['bigint', '巨大な整数。10n のように n を付ける'],
          ['null', '「空っぽ」を意図的に入れた状態'],
          ['undefined', '「まだ入っていない」状態。未定義'],
          ['any', 'なんでもOK。型チェックを放棄する逃げ道。多用すると意味がなくなる'],
          ['unknown', 'なんでも入るが、使う前に必ず型を確かめさせられる。安全版の any'],
          ['never', '絶対に値を返さない。必ず例外を投げる関数など'],
          ['void', '戻り値なし。返さない関数の型'],
          ['object', 'オブジェクト全般。実務では形を具体的に書くことが多い'],
          ['string[]', '文字列の配列。Array<string> とも書ける'],
          ['[string, number]', 'タプル。順番と個数が決まった配列'],
          ['enum', '決まった選択肢の集合。Status.Active など'],
          ['リテラル型', '"active" のように、値そのものを型にできる'],
          ['ユニオン型', 'string | number。「どちらか」を表す'],
          ['インターセクション型', 'A & B。「両方の性質を持つ」を表す']
        ])
      ]},
      { t: 'interface と type — 形に名前をつける', b: [
        P('同じ形のオブジェクトを何度も扱うとき、形に名前を付けておきます。'),
        CODE('TYPESCRIPT', 'interface User {\n  id: string;\n  name: string;\n  age?: number;      // ? は「なくてもいい」\n  readonly createdAt: Date;   // 後から変更不可\n}\n\nfunction show(user: User): void {\n  console.log(user.name);\n}'),
        P('type でも同じことができます。'),
        CODE('TYPESCRIPT', 'type User = {\n  id: string;\n  name: string;\n};\n\ntype Id = string | number;        // ユニオン\ntype Admin = User & { role: string };   // 合成'),
        ROWS(['interface', 'type'], [
          ['得意なこと', '', 'オブジェクトの形を書く。後から項目を追加できる', 'なんでも書ける。ユニオンや別名も作れる'],
          ['継承・合成', '', 'extends', '& でつなぐ'],
          ['使い分け', '', '迷ったらこちら。オブジェクトの形が主目的', 'ユニオンや複雑な型を作りたいとき']
        ]),
        P('Javaのinterfaceと違い、TypeScriptのinterfaceは「実装を約束する契約」だけでなく、単なるデータの形にもよく使います。')
      ]},
      { t: '関数の型の書き方', b: [
        CODE('TYPESCRIPT', '// 普通の関数\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n\n// アロー関数\nconst add2 = (a: number, b: number): number => a + b;\n\n// 引数が省略可能\nfunction greet(name: string, title?: string): string {\n  return title ? title + " " + name : name;\n}\n\n// 初期値つき\nfunction greet2(name: string, mark: string = "!"): string {\n  return name + mark;\n}\n\n// 関数そのものの型\nlet handler: (event: string) => void;'),
        GLOSS([
          ['(a: number)', '引数の型'],
          ['): number', '戻り値の型。矢印ではなくコロンで書く'],
          ['name?: string', '省略できる引数。渡さないと undefined'],
          ['=> void', '「この形の関数」という型。何も返さない'],
          ['...args: number[]', '可変長引数。いくつでも受け取る']
        ])
      ]},
      { t: 'ジェネリクス — Javaと見比べる', b: [
        P('「中身の型は使うときに決める」書き方です。JavaのList<String>と同じ発想で、記号もほぼ同じです。'),
        CODE('JAVA', 'List<String> names = new ArrayList<>();\n\npublic <T> T firstOf(List<T> list) {\n    return list.get(0);\n}'),
        CODE('TYPESCRIPT', 'const names: Array<string> = [];\n\nfunction firstOf<T>(list: T[]): T {\n  return list[0];\n}\n\nconst n = firstOf<number>([1, 2, 3]);   // n は number\nconst s = firstOf(["a", "b"]);          // 推論されて string'),
        P('T は「型の入れ物」です。使うときに string や number が入ります。'),
        GLOSS([
          ['<T>', '型そのものを引数として受け取る印'],
          ['T[]', 'Tの配列'],
          ['<T extends X>', 'Tに条件をつける。「Xの性質を持つ型だけ」'],
          ['Promise<User>', '「いずれUserを返す」非同期の型'],
          ['Record<string, number>', 'キーが文字列、値が数値のオブジェクト']
        ])
      ]},
      { t: 'TS特有のよく出る記号', b: [
        GLOSS([
          ['?', '省略可能。age?: number は「なくてもいい」'],
          ['!', 'nullやundefinedではないと断言する。user!.name。外すべき最後の手段'],
          ['as', '型を強引に指定する。value as string。中身は変わらないので嘘をつくと壊れる'],
          ['readonly', '後から書き換え禁止'],
          ['|', 'ユニオン。string | null は「文字列またはnull」'],
          ['&', 'インターセクション。両方の性質を持つ'],
          ['keyof', 'オブジェクトのキー名を型として取り出す'],
          ['typeof', '値から、その値の型を取り出す'],
          ['Partial<T>', 'Tの全項目を「省略可能」にした型'],
          ['Required<T>', '逆に全項目を必須にした型'],
          ['Pick<T, K>', 'Tから指定した項目だけ抜き出した型'],
          ['Omit<T, K>', 'Tから指定した項目を除いた型'],
          ['?.', 'オプショナルチェーン。途中がnullなら止まる。user?.name'],
          ['??', 'null合体。左がnull/undefinedのときだけ右を使う']
        ]),
        CODE('TYPESCRIPT', 'const name = user?.profile?.name ?? "名無し";\n// user も profile も null かもしれない。\n// 途中で null なら "名無し" になる。')
      ]},
      { t: '実行時に型は消える — ここが落とし穴', b: [
        P('TypeScriptの型は、コンパイルすると完全に消えます。だから「実行中に型で判断する」ことはできません。'),
        CODE('TYPESCRIPT', 'interface User { name: string; }\n\nfunction f(x: User | string) {\n  // これは書けない。Userは実行時に存在しないから\n  // if (x instanceof User) { ... }\n\n  // 実行時に確かめられるのは、値そのものの形\n  if (typeof x === "string") {\n    console.log(x.toUpperCase());\n  } else {\n    console.log(x.name);\n  }\n}'),
        NOTE('外から来たデータ（APIの返り値など）は、\n型を書いても中身が保証されるわけではない。'),
        P('APIのレスポンスに型を付けても、それは「こう来るはず」という宣言にすぎません。実際に違う形で来たら実行時に壊れます。本気で守るなら、実行時に中身を検証するライブラリ（zod など）を併用します。')
      ]},
      { t: '導入とビルド', b: [
        CODE('SHELL', '# インストール（開発時だけ使うので -D）\nnpm install -D typescript\n\n# 設定ファイルを作る\nnpx tsc --init\n\n# 変換する（.ts → .js）\nnpx tsc\n\n# 変換せず、その場で実行する\nnpx tsx index.ts'),
        GLOSS([
          ['tsc', 'TypeScriptコンパイラ本体。.tsを.jsに変換する'],
          ['tsconfig.json', 'どう変換するかの設定ファイル'],
          ['strict', '厳しくチェックする設定。基本はオンにする'],
          ['target', '変換後のJavaScriptのバージョン'],
          ['module', 'import/requireのどちらの形式で出力するか'],
          ['.d.ts', '型だけを書いたファイル。JS製ライブラリに型を後付けする'],
          ['@types/xxx', 'JS製ライブラリ用の型定義パッケージ']
        ])
      ]}
    ]
  };
}

function c6() {
  return {
    tab: 'モバイル3種', col: 'oklch(0.60 0.16 55)', soft: 'oklch(0.94 0.045 55)',
    title: 'Flutter / Swift / Kotlin',
    desc: 'スマホアプリの3択。Dart（Flutter）は両OS対応、SwiftはiOS純正、KotlinはAndroid純正。書き方は驚くほど似ている。',
    sections: [
      { t: '3つの立ち位置', b: [
        CARDS([
          ['Flutter（Dart言語）', 'Google', '1つのコードでiOS・Android・Web・デスクトップまで動く。画面は自前で描くので、どのOSでも見た目が同じ'],
          ['Swift', 'Apple', 'iOS / Mac の純正言語。新機能への対応が最速。Appleの世界の外では基本使わない'],
          ['Kotlin', 'JetBrains / Google', 'Androidの純正言語。Javaと100%共存でき、Javaの資産をそのまま使える']
        ]),
        ROWS(['言語', '対象', 'UIの書き方', '開発ツール'], [
          ['Flutter', 'クロスプラットフォーム', 'Dart', 'iOS / Android / Web / PC', 'Widget（ウィジェット）', 'VS Code / Android Studio'],
          ['Swift', 'Apple純正', 'Swift', 'iOS / iPadOS / macOS / watchOS', 'SwiftUI（新）/ UIKit（旧）', 'Xcode（Macが必要）'],
          ['Kotlin', 'Android純正', 'Kotlin', 'Android（KMPで他OSも）', 'Jetpack Compose（新）/ XML（旧）', 'Android Studio']
        ]),
        NOTE('3つとも「画面の形をコードで宣言する」書き方（宣言的UI）に統一されてきている。\n言語が違っても発想はほぼ同じ。'),
        P('なお、Kotlinは元々Java向けに作られた言語なので、③章のJavaの知識がほぼそのまま効きます。')
      ]},
      { t: '最小のコード — 文字を1つ表示する', b: [
        P('3つとも「画面の部品を組み立てて返す」形です。'),
        CODE('DART / FLUTTER', 'import "package:flutter/material.dart";\n\nvoid main() {\n  runApp(const MyApp());\n}\n\nclass MyApp extends StatelessWidget {\n  const MyApp({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return const MaterialApp(\n      home: Scaffold(\n        body: Center(child: Text("Hello")),\n      ),\n    );\n  }\n}'),
        CODE('SWIFT / SWIFTUI', 'import SwiftUI\n\nstruct ContentView: View {\n    var body: some View {\n        Text("Hello")\n    }\n}'),
        CODE('KOTLIN / COMPOSE', 'import androidx.compose.material3.Text\nimport androidx.compose.runtime.Composable\n\n@Composable\nfun Greeting() {\n    Text("Hello")\n}'),
        P('どれも「Textという部品を返している」だけです。返した内容がそのまま画面になります。')
      ]},
      { t: '宣言的UI — 3つとも同じ発想', b: [
        P('昔は「ボタンを作って、後から色を変えて、文字を差し替えて…」と手順を書いていました（命令的）。今の3つは「今の状態ならこういう画面」と形を書きます（宣言的）。'),
        FLOW(['状態（データ）が変わる', 'build / body / @Composable が呼び直される', '新しい画面が描かれる']),
        ROWS(['画面部品', '状態の持ち方', '更新のきっかけ'], [
          ['Flutter', '', 'Widget', 'StatefulWidget の State', 'setState() を呼ぶ'],
          ['SwiftUI', '', 'View', '@State / @Observable', '値を書き換えると自動'],
          ['Compose', '', '@Composable 関数', 'remember + mutableStateOf', '値を書き換えると自動']
        ]),
        NOTE('画面を直接いじるのではなく、データを変える。\n画面はデータから自動で作り直される。'),
        CODE('DART / FLUTTER', 'class Counter extends StatefulWidget {\n  const Counter({super.key});\n  @override\n  State<Counter> createState() => _CounterState();\n}\n\nclass _CounterState extends State<Counter> {\n  int count = 0;\n\n  @override\n  Widget build(BuildContext context) {\n    return TextButton(\n      onPressed: () => setState(() => count++),\n      child: Text("$count 回"),\n    );\n  }\n}'),
        CODE('SWIFT / SWIFTUI', 'struct Counter: View {\n    @State private var count = 0\n\n    var body: some View {\n        Button("\\(count) 回") {\n            count += 1\n        }\n    }\n}'),
        CODE('KOTLIN / COMPOSE', '@Composable\nfun Counter() {\n    var count by remember { mutableStateOf(0) }\n\n    Button(onClick = { count++ }) {\n        Text("$count 回")\n    }\n}')
      ]},
      { t: '変数と型', b: [
        CODE('変数', 'Dart     var name = "Taro";      // 推論\n         String name = "Taro";   // 明示\n         final name = "Taro";    // 再代入不可\n         const pi = 3.14;        // コンパイル時定数\n\nSwift    var name = "Taro"       // 変更できる\n         let name = "Taro"       // 変更できない\n         var name: String = "Taro"\n\nKotlin   var name = "Taro"       // 変更できる\n         val name = "Taro"       // 変更できない\n         val name: String = "Taro"'),
        NOTE('Swift と Kotlin は let / val が「変更しない」。\nJavaScript の let とは意味が逆なので注意。'),
        ROWS(['変更できる', '変更できない', '型の書き方'], [
          ['Dart', '', 'var', 'final / const', 'String name'],
          ['Swift', '', 'var', 'let', 'var name: String'],
          ['Kotlin', '', 'var', 'val', 'val name: String'],
          ['Java（参考）', '', '（普通の変数）', 'final', 'String name'],
          ['JavaScript（参考）', '', 'let', 'const', '型なし']
        ])
      ]},
      { t: 'null安全 — 3言語の主戦場', b: [
        P('「値が入っていないかもしれない変数」を、コンパイラに追跡させる仕組みです。JavaのNullPointerExceptionを言語レベルで潰しにいったのがこの3つです。'),
        CODE('null許容', 'Dart     String? name;      // null が入るかも\n         String  name;      // null は絶対に入らない\n\nSwift    var name: String?  // Optional。null が入るかも\n         var name: String   // 必ず値がある\n\nKotlin   var name: String?  // null が入るかも\n         var name: String   // null は代入できない'),
        P('null かもしれない値は、そのままでは使えません。取り出し方が用意されています。'),
        GLOSS([
          ['?.', '3言語共通。nullなら何もせずnullを返す。name?.length'],
          ['?? （Dart / Swift）', 'nullのときの代わりの値。name ?? "名無し"'],
          ['?: （Kotlin）', '同じ意味。エルビス演算子と呼ぶ。name ?: "名無し"'],
          ['! （Dart）', 'nullでないと断言。違ったら実行時エラー'],
          ['! （Swift）', '強制アンラップ。name!。違ったらクラッシュ'],
          ['!! （Kotlin）', '同じく強制。name!!。違ったらNullPointerException'],
          ['if let（Swift）', 'nullでないときだけ中に入る書き方'],
          ['guard let（Swift）', 'nullなら早期に抜ける書き方'],
          ['let（Kotlin）', 'name?.let { ... } でnullでないときだけ実行']
        ]),
        CODE('取り出し方', 'Dart     final n = name ?? "名無し";\n         if (name != null) { print(name.length); }\n\nSwift    let n = name ?? "名無し"\n         if let name = name { print(name.count) }\n         guard let name = name else { return }\n\nKotlin   val n = name ?: "名無し"\n         name?.let { println(it.length) }'),
        NOTE('! や !! は「絶対にnullじゃない」と人間が保証する印。\n保証が外れた瞬間にアプリが落ちるので、多用しない。')
      ]},
      { t: '関数とクラス', b: [
        CODE('関数', 'Dart     int add(int a, int b) {\n           return a + b;\n         }\n         int add(int a, int b) => a + b;\n\nSwift    func add(_ a: Int, _ b: Int) -> Int {\n             return a + b\n         }\n\nKotlin   fun add(a: Int, b: Int): Int {\n             return a + b\n         }\n         fun add(a: Int, b: Int) = a + b'),
        P('Swiftの引数には「呼ぶときの名前」が付きます。_ を書くと省略できます。'),
        CODE('SWIFT', 'func greet(to name: String) { }\ngreet(to: "Taro")      // 呼ぶときに to: が要る\n\nfunc greet2(_ name: String) { }\ngreet2("Taro")         // _ にすると不要'),
        CODE('クラス', 'Dart     class User {\n           final String name;\n           User(this.name);\n           void hello() => print("Hi $name");\n         }\n         final u = User("Taro");\n\nSwift    struct User {\n             let name: String\n             func hello() { print("Hi \\(name)") }\n         }\n         let u = User(name: "Taro")\n\nKotlin   class User(val name: String) {\n             fun hello() = println("Hi $name")\n         }\n         val u = User("Taro")'),
        NOTE('Kotlin の class User(val name: String) は、\nJavaで20行かかるクラスと同じ意味。'),
        GLOSS([
          ['data class（Kotlin）', '値を入れるためだけのクラス。比較や表示を自動生成'],
          ['struct（Swift）', '構造体。コピーで渡る。SwiftUIの画面はこれで書く'],
          ['class（Swift）', '参照で渡る。共有したい状態に使う'],
          ['extends（Dart）', '継承'],
          ['@override', '親の処理を上書きする印']
        ])
      ]},
      { t: '非同期処理', b: [
        P('通信やファイル読み込みなど「時間がかかる処理」の書き方です。3つともasync / awaitに揃っています。'),
        CODE('DART', 'Future<String> fetchName() async {\n  final res = await http.get(url);\n  return res.body;\n}\n\nfinal name = await fetchName();'),
        CODE('SWIFT', 'func fetchName() async throws -> String {\n    let (data, _) = try await URLSession.shared.data(from: url)\n    return String(data: data, encoding: .utf8) ?? ""\n}\n\nlet name = try await fetchName()'),
        CODE('KOTLIN', 'suspend fun fetchName(): String {\n    return client.get(url).bodyAsText()\n}\n\nlifecycleScope.launch {\n    val name = fetchName()\n}'),
        GLOSS([
          ['Future（Dart）', 'いずれ値が入る箱。JSのPromiseと同じ'],
          ['Stream（Dart）', '値が何度も流れてくる箱'],
          ['async / await', '3言語共通。待つ間、画面は固まらない'],
          ['suspend（Kotlin）', '中断できる関数の印。コルーチンの中でだけ呼べる'],
          ['coroutine（Kotlin）', '軽量な並行処理の仕組み'],
          ['launch / scope（Kotlin）', 'コルーチンを始める場所と生存範囲'],
          ['Task（Swift）', '非同期処理を始める入れ物'],
          ['try await（Swift）', '失敗するかもしれない非同期処理を待つ']
        ])
      ]},
      { t: 'リスト操作', b: [
        CODE('絞り込む・変換する', 'Dart     final adults = users.where((u) => u.age >= 18).toList();\n         final names  = users.map((u) => u.name).toList();\n\nSwift    let adults = users.filter { $0.age >= 18 }\n         let names  = users.map { $0.name }\n\nKotlin   val adults = users.filter { it.age >= 18 }\n         val names  = users.map { it.name }'),
        NOTE('Dart は where、Swift と Kotlin は filter。\n名前が違うだけで、やっていることは同じ。'),
        GLOSS([
          ['$0（Swift）', '1つ目の引数の省略記法'],
          ['it（Kotlin）', '引数が1つのときの省略名'],
          ['toList()（Dart）', '結果をリストに確定させる'],
          ['first / firstWhere', '最初の1件を取る'],
          ['fold / reduce', '畳み込んで1つの値にする'],
          ['forEach', '1件ずつ処理する']
        ])
      ]},
      { t: 'どれを選ぶか', b: [
        CARDS([
          ['iOS・Android両方を早く出したい', 'Flutter', '1つのコードで両方。人員が少ないほど効く'],
          ['iOSらしい体験を突き詰めたい', 'Swift', '新OS機能への対応が最速。Apple Watchなども自然'],
          ['Androidが主戦場、Javaの資産がある', 'Kotlin', 'Javaと混在できる。Android公式の第一言語'],
          ['Webも同じチームで作りたい', 'Flutter / TypeScript', '言語をそろえると学習コストが下がる']
        ]),
        ROWS(['学びやすさ', 'つまずきやすい所'], [
          ['Flutter', 'Dart', 'JS・Javaの経験があれば入りやすい', 'Widgetの入れ子が深くなる。状態管理の流儀が多い'],
          ['Swift', '', '文法は現代的で読みやすい', 'Optionalの扱い。Macとxcodeが必須'],
          ['Kotlin', '', 'Java経験者は即戦力', 'Androidの仕組み（Activity・ライフサイクル）自体が重い']
        ]),
        NOTE('3つとも「宣言的UI・null安全・async/await」で似てきている。\n1つ覚えると、残り2つの習得はかなり速い。')
      ]}
    ]
  };
}

function c7() {
  return {
    tab: 'C / C++', col: 'oklch(0.45 0.055 285)', soft: 'oklch(0.93 0.02 285)',
    title: 'C / C++ — 機械に一番近い言葉',
    desc: 'OS・組込み・ゲーム・高速処理の土台。他の言語が自動でやってくれることを、自分で書く必要がある。',
    sections: [
      { t: 'C と C++ の立ち位置', b: [
        P('CとC++は、ハードウェアに最も近い高級言語です。OS、データベース、ゲームエンジン、組込み機器、他言語の処理系そのものが、たいていこれで書かれています。'),
        CARDS([
          ['C', '1972年', '小さくて単純。機能が少ないぶん、何が起きるか完全に見える。OS・組込みの定番'],
          ['C++', '1983年〜', 'Cにクラス・テンプレート・STLなどを足した巨大な言語。Cのコードもほぼそのまま動く'],
          ['共通点', '', 'コンパイルして機械語の実行ファイルを作る。実行時に仮想マシンを挟まないので速い']
        ]),
        P('JavaやPythonは、書いたコードを「実行環境（JVMやインタプリタ）」が読み取って動かします。C/C++は、そのOS・CPU専用の実行ファイルに変換してからOSが直接実行します。'),
        FLOW(['ソースコード（.c / .cpp）', 'コンパイル', 'オブジェクトファイル（.o）', 'リンク', '実行ファイル', 'OSが直接実行']),
        NOTE('速い理由も、大変な理由も、\n「間に誰もいない」ことから来ている。')
      ]},
      { t: '基本の形', b: [
        CODE('C', '#include <stdio.h>\n\nint main(void) {\n    printf("Hello, World!\\n");\n    return 0;\n}'),
        CODE('C++', '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}'),
        MONO('#include   → 外部の機能を取り込む（他言語の import）\nint main   → プログラムの入口。ここから始まる\nvoid       → 引数なし\nprintf     → コンソールに出力する関数\n<<         → C++の出力演算子。左へ流し込む\nstd::      → 標準ライブラリの名前空間\nreturn 0   → 正常終了をOSに伝える\n;          → 文の終わり。省略できない'),
        NOTE('main の戻り値 0 は「正常に終わった」という意味。\nOSやシェルがこの数字を見ている。')
      ]},
      { t: 'コンパイルして実行するまで', b: [
        P('他の多くの言語と違い、「保存して実行」ではありません。必ずビルドの手順を挟みます。'),
        CODE('SHELL', '# C\ngcc hello.c -o hello\n./hello\n\n# C++\ng++ hello.cpp -o hello\n./hello\n\n# よく付けるオプション\ng++ -std=c++20 -Wall -Wextra -O2 main.cpp -o app'),
        GLOSS([
          ['gcc / g++', 'コンパイラ。ソースを機械語に変換する'],
          ['clang / clang++', '別のコンパイラ。Macの標準'],
          ['-o 名前', '出力する実行ファイル名'],
          ['-std=c++20', '使う言語バージョンの指定'],
          ['-Wall -Wextra', '警告をできるだけ出す。初学者ほど付けるべき'],
          ['-O2', '最適化して速くする'],
          ['-g', 'デバッグ情報を付ける'],
          ['Makefile / CMake', 'ファイルが増えたとき、ビルド手順をまとめる道具']
        ]),
        NOTE('ファイルが2〜3個を超えたら、\n手打ちのコンパイルはやめてCMakeに任せる。')
      ]},
      { t: '他言語より大変なところ（ここが本題）', b: [
        P('Java・Python・JavaScriptが裏でやってくれていることを、C/C++では自分で引き受けます。'),
        CARDS([
          ['メモリを自分で管理する', '最大の違い', '確保したら必ず解放する。忘れるとメモリリーク、二重に解放すると即クラッシュ'],
          ['ポインタがある', '', '「値」ではなく「値のある住所」を直接扱う。強力だが、間違えると他人の領域を壊す'],
          ['配列が範囲を見張らない', '', '10個の配列の11番目に書き込んでも、その場では止まらない。後から謎の不具合になる'],
          ['文字列が特別扱いされない', 'Cの場合', '文字列型がない。文字の配列と終端記号で表す'],
          ['ヘッダファイルが要る', '', '宣言（.h）と実装（.c/.cpp）を分けて書く手間がある'],
          ['未定義動作がある', '', '「規格が動作を決めていない」書き方が存在する。動いてしまうこともあり、原因追跡が難しい'],
          ['標準ライブラリが薄い', 'Cの場合', 'JSONもHTTPも標準では入っていない。外部ライブラリを自分で用意する'],
          ['環境ごとに違う', '', 'OS・CPU・コンパイラで挙動やサイズが変わることがある']
        ]),
        NOTE('要するに「安全装置が付いていない」。\nその代わり、何が起きているかを完全に制御できる。')
      ]},
      { t: 'メモリとポインタ', b: [
        P('Javaなどでは、使われなくなったデータをGC（ガベージコレクタ）が自動で片付けます。C/C++にはそれがありません。'),
        ROWS(['メモリの解放', '書く人の負担'], [
          ['Java / Python / JS / Go', '', 'GCが自動で回収', 'ほぼ意識しない'],
          ['Swift / Kotlin', '', '参照カウントなどで自動', 'まれに循環参照だけ注意'],
          ['C', '', 'malloc したら free を自分で書く', '常に意識する'],
          ['C++', '', 'new / delete。今はスマートポインタで自動化', '設計時に必ず考える']
        ]),
        H('ポインタの基本'),
        CODE('C', 'int x = 10;\nint *p = &x;      // p は x の住所を持つ\n\nprintf("%d\\n", x);    // 10   … 値\nprintf("%p\\n", &x);   // 住所そのもの\nprintf("%d\\n", *p);   // 10   … 住所の先にある値\n\n*p = 20;              // 住所の先を書き換える\nprintf("%d\\n", x);    // 20   … x が変わっている'),
        GLOSS([
          ['&x', 'xの住所（アドレス）を取り出す'],
          ['*p', 'その住所に入っている値を読む・書く（デリファレンス）'],
          ['int *p', '「intの住所」を入れる変数の宣言'],
          ['NULL / nullptr', 'どこも指していない状態'],
          ['malloc', '必要な大きさのメモリを借りる（C）'],
          ['free', '借りたメモリを返す（C）'],
          ['new / delete', '同じことをするC++の書き方'],
          ['スタック', '関数の中の変数が置かれる場所。自動で片付く'],
          ['ヒープ', 'malloc / new で借りる場所。自分で返す必要がある']
        ]),
        H('動的にメモリを借りる'),
        CODE('C', '#include <stdlib.h>\n\nint *arr = malloc(sizeof(int) * 10);   // 10個分borrow\nif (arr == NULL) { return 1; }         // 失敗の確認も自分で\n\narr[0] = 5;\n\nfree(arr);      // 返す。忘れるとメモリリーク\narr = NULL;     // 返した後は触らない印'),
        H('よくある事故'),
        CARDS([
          ['メモリリーク', 'freeし忘れ', '借りっぱなし。長時間動くとメモリを食い潰す'],
          ['ダングリングポインタ', '解放後に使用', '返した住所を触る。他のデータを壊す'],
          ['二重解放', 'free を2回', 'その場でクラッシュすることが多い'],
          ['バッファオーバーラン', '範囲外書き込み', '配列の外に書く。セキュリティ事故の定番'],
          ['セグメンテーション違反', 'Segfault', '触ってはいけない領域に触った。OSに強制終了される']
        ]),
        NOTE('C++では今、生のポインタを直接使わず\nunique_ptr / shared_ptr / vector に任せるのが主流。')
      ]},
      { t: '文字列の扱いが特殊', b: [
        P('Cには文字列型がありません。「文字の配列」で、終わりを \\0 という見えない文字で示します。'),
        CODE('C', '#include <string.h>\n\nchar name[] = "Taro";   // 実際は T a r o \\0 の5文字分\n\nprintf("%zu\\n", strlen(name));   // 4  … 見える文字数\nprintf("%zu\\n", sizeof(name));   // 5  … \\0 を含む箱の大きさ\n\nchar buf[10];\nstrcpy(buf, name);        // コピー。長さを超えると壊れる\nstrcat(buf, "!");         // 連結\n\nif (strcmp(name, "Taro") == 0) {   // 比較。== は使えない\n    printf("同じ\\n");\n}'),
        NOTE('Cでは name == "Taro" は「住所の比較」になる。\n中身を比べたいときは必ず strcmp。'),
        P('C++には std::string があり、他の言語に近い感覚で書けます。'),
        CODE('C++', '#include <string>\n\nstd::string name = "Taro";\n\nname += " Yamada";           // 連結は + でよい\nif (name == "Taro Yamada") { }   // == で中身を比較できる\n\nstd::cout << name.size() << std::endl;'),
        ROWS(['C', 'C++', '他の言語'], [
          ['型', '', 'char[] / char*', 'std::string', 'String / str'],
          ['長さ', '', 'strlen(s)', 's.size()', 's.length / len(s)'],
          ['連結', '', 'strcat(a, b)', 'a + b', 'a + b'],
          ['比較', '', 'strcmp(a, b) == 0', 'a == b', 'a == b / equals'],
          ['長さの上限', '', '確保した配列の大きさ。超えたら破壊', '自動で伸びる', '自動で伸びる']
        ])
      ]},
      { t: '配列と vector', b: [
        CODE('C', 'int nums[5] = {1, 2, 3, 4, 5};\n\nfor (int i = 0; i < 5; i++) {\n    printf("%d\\n", nums[i]);\n}\n\n// 大きさは固定。後から増やせない\n// nums[7] = 1;  → 書けてしまうが、壊れる'),
        CODE('C++', '#include <vector>\n\nstd::vector<int> nums = {1, 2, 3};\n\nnums.push_back(4);       // 後から増やせる\n\nfor (int n : nums) {     // 範囲for\n    std::cout << n << std::endl;\n}\n\nstd::cout << nums.size() << std::endl;'),
        NOTE('C++では、生の配列よりまず std::vector。\n大きさの管理とメモリ解放を任せられる。'),
        GLOSS([
          ['sizeof', '型や変数のバイト数を返す。配列の要素数計算にも使う'],
          ['push_back', 'vectorの末尾に追加'],
          ['at(i)', '範囲チェック付きの取り出し。範囲外なら例外'],
          ['[i]', 'チェックなし。速いが範囲外は未定義動作'],
          ['範囲for', 'for (int n : nums) の形。C++11から']
        ])
      ]},
      { t: 'ヘッダファイルと分割', b: [
        P('C/C++は「先に宣言されていない名前は使えない」ため、宣言だけを書いたヘッダファイルを配ります。'),
        CODE('user.h（宣言）', '#ifndef USER_H\n#define USER_H\n\nint add(int a, int b);\n\n#endif'),
        CODE('user.c（実装）', '#include "user.h"\n\nint add(int a, int b) {\n    return a + b;\n}'),
        CODE('main.c（使う側）', '#include <stdio.h>\n#include "user.h"\n\nint main(void) {\n    printf("%d\\n", add(2, 3));\n    return 0;\n}'),
        GLOSS([
          ['#include <xxx>', '標準ライブラリなど、システムの場所から探す'],
          ['#include "xxx"', '自分のプロジェクト内から探す'],
          ['#ifndef / #define / #endif', 'インクルードガード。同じヘッダを二重に読まないための定型'],
          ['#pragma once', '同じ目的の短い書き方。今はこちらが主流'],
          ['プリプロセッサ', 'コンパイル前に # の行を処理する仕組み'],
          ['リンク', '分かれてコンパイルされた結果を1つの実行ファイルに結合する工程']
        ]),
        NOTE('「宣言はヘッダ、実装は本体」。\nこの分離は他の多くの言語には無い手間。')
      ]},
      { t: 'C++ のクラスと STL', b: [
        CODE('C++', '#include <iostream>\n#include <string>\n\nclass User {\nprivate:\n    std::string name_;\n\npublic:\n    User(std::string name) : name_(name) {}\n\n    void hello() const {\n        std::cout << "Hi " << name_ << std::endl;\n    }\n};\n\nint main() {\n    User u("Taro");\n    u.hello();\n    return 0;\n}'),
        H('STL — 標準テンプレートライブラリ'),
        GLOSS([
          ['std::vector', '可変長配列。最もよく使う'],
          ['std::string', '文字列'],
          ['std::map', 'キーと値。順序つき'],
          ['std::unordered_map', 'ハッシュ版。速い'],
          ['std::set', '重複しない集合'],
          ['iterator', '要素を順に指す仕組み。begin() / end()'],
          ['template', '型を後から決める仕組み。Javaのジェネリクスの原型'],
          ['auto', '型を推論させる。auto it = v.begin();'],
          ['unique_ptr', '持ち主が1人のスマートポインタ。自動でdelete'],
          ['shared_ptr', '共有できるスマートポインタ。参照が0で解放'],
          ['namespace', '名前の衝突を防ぐ入れ物。std がその代表']
        ]),
        P('C++はバージョンごとに書き方が大きく変わります。C++11以降（auto、範囲for、スマートポインタ、ラムダ）を「モダンC++」と呼び、今はこちらが標準です。')
      ]},
      { t: '他言語との違い早見', b: [
        ROWS(['C / C++', 'Java / Python / JS'], [
          ['実行の仕組み', '', 'コンパイルして機械語の実行ファイル', 'VMやインタプリタが解釈して実行'],
          ['メモリ', '', '自分で確保・解放', 'GCが自動'],
          ['配列の範囲チェック', '', 'なし（vector.at()は例外）', 'あり。超えると例外'],
          ['null', '', 'NULL / nullptr。触ると即クラッシュ', '例外が飛ぶ'],
          ['文字列', '', 'char配列（C）/ std::string（C++）', '標準の文字列型'],
          ['ビルド', '', 'コンパイル＋リンクが必須', '不要または自動'],
          ['実行速度', '', '最速級', 'C/C++より遅いことが多い'],
          ['起動の速さ', '', '速い', 'VM起動などの分だけ遅い'],
          ['移植性', '', '再コンパイルが必要', '同じコードがどこでも動きやすい'],
          ['エラーの出方', '', '実行時に突然クラッシュしがち', '例外として捕まえやすい']
        ]),
        NOTE('学ぶ価値は「速さ」より「仕組みが見えること」。\nメモリ・ポインタ・コンパイルを一度やると、他の言語の理解が深くなる。')
      ]}
    ]
  };
}

function c8() {
  return {
    tab: '依存とパッケージ', col: 'oklch(0.55 0.16 345)', soft: 'oklch(0.94 0.04 345)',
    title: '依存関係・パッケージ・モジュール',
    desc: '他人が書いたコードを、自分のコードから呼ぶ仕組み。言葉の整理と、各言語での「入れ方」「使い方」。',
    sections: [
      { t: 'まず言葉の整理', b: [
        P('どれも「コードのまとまり」を指しますが、大きさと役割が違います。'),
        CARDS([
          ['モジュール', 'module', '1つのファイル、または機能のひとまとまり。最小単位'],
          ['パッケージ', 'package', 'モジュールを束ねて配布できる形にしたもの。名前とバージョンが付く'],
          ['ライブラリ', 'library', '呼び出して使う道具の集まり。主導権は自分のコード側にある'],
          ['フレームワーク', 'framework', '土台。主導権は向こうにあり、自分のコードが呼び出される'],
          ['依存関係', 'dependency', '自分のコードが動くために必要な外部のパッケージ'],
          ['パッケージマネージャ', '', '依存を自動でダウンロード・更新・管理する道具'],
          ['レジストリ', 'registry', 'パッケージが公開されている倉庫。npm・PyPI・Maven Centralなど']
        ]),
        NOTE('ライブラリ ＝ 自分が呼ぶ\nフレームワーク ＝ 自分が呼ばれる'),
        P('さらに、依存が別の依存を連れてくることがあります。これを推移的依存と呼びます。5個入れたつもりが、実際には200個入っていることも珍しくありません。'),
        FLOW(['自分のコード', '直接の依存（5個）', 'その依存が使う依存（195個）', '合計200個が入る'])
      ]},
      { t: 'なぜ使うのか', b: [
        P('日付の整形、HTTP通信、画像処理、暗号化。こうしたものを毎回自分で書くのは非効率で、しかも自作のほうがバグりやすい領域です。'),
        CARDS([
          ['利点', '', '作らずに済む。世界中で検証されている。更新で不具合が直る'],
          ['代償', '', '中身を把握しきれない。更新で壊れることがある。放置されると自分が困る'],
          ['判断基準', '', '更新が続いているか、利用数、ライセンス、依存の数、代替のしやすさ']
        ]),
        NOTE('「1行で済むことのために依存を増やさない」も、\n「暗号化を自作しない」も、どちらも正しい。')
      ]},
      { t: 'パッケージマネージャ早見', b: [
        ROWS(['管理ツール', '設定ファイル', '置き場所'], [
          ['JavaScript / Node.js', '', 'npm / yarn / pnpm', 'package.json', 'node_modules/'],
          ['TypeScript', '', 'npmと同じ', 'package.json（+ tsconfig.json）', 'node_modules/'],
          ['Python', '', 'pip / poetry / uv', 'requirements.txt / pyproject.toml', 'site-packages/（venv内）'],
          ['Java', '', 'Maven / Gradle', 'pom.xml / build.gradle', '~/.m2 / ~/.gradle'],
          ['Kotlin（Android）', '', 'Gradle', 'build.gradle.kts', '~/.gradle'],
          ['Dart / Flutter', '', 'pub', 'pubspec.yaml', '.dart_tool/ / pub cache'],
          ['Swift', '', 'Swift Package Manager / CocoaPods', 'Package.swift / Podfile', '.build/ / Pods/'],
          ['C / C++', '', 'vcpkg / Conan / 手動', 'CMakeLists.txt', 'システムやプロジェクト内'],
          ['SQL（参考）', '', '（なし）', '—', '—']
        ]),
        NOTE('C/C++だけ「標準のパッケージ管理がない」。\nここも他言語より手間がかかる点。')
      ]},
      { t: '入れるコマンド', b: [
        CODE('SHELL', '# JavaScript / TypeScript\nnpm install axios              # 本番でも使う\nnpm install -D typescript      # 開発時だけ\n\n# Python\npip install requests\npip install -r requirements.txt\n\n# Java（Gradle）… build.gradle に書いてから\n./gradlew build\n\n# Flutter / Dart\nflutter pub add http\ndart pub get\n\n# Swift（CocoaPods）\npod install\n\n# Android（Gradle）… build.gradle.kts に書いてから\n./gradlew build\n\n# C++（vcpkg）\nvcpkg install fmt'),
        P('JavaScriptとPython以外は、まず設定ファイルに1行書いてから、ビルドコマンドで取り込む流れが主流です。'),
        CODE('設定ファイルに書く例', 'package.json     "axios": "^1.6.0"\n\npubspec.yaml     dependencies:\n                   http: ^1.2.0\n\nbuild.gradle     implementation("com.squareup.okhttp3:okhttp:4.12.0")\n\npom.xml          <dependency>\n                   <groupId>com.squareup.okhttp3</groupId>\n                   <artifactId>okhttp</artifactId>\n                   <version>4.12.0</version>\n                 </dependency>\n\nPackage.swift    .package(url: "https://github.com/....git", from: "1.0.0")')
      ]},
      { t: '使う文法 — import / require / #include', b: [
        P('入れただけでは使えません。ファイルの先頭で「これを使う」と書きます。ここが言語ごとに一番形が違う部分です。'),
        H('外部ライブラリを読み込む'),
        CODE('各言語', 'Java        import java.util.List;\n            import com.example.user.User;\n\nJavaScript  import axios from "axios";          // ESM\n            const axios = require("axios");      // CommonJS\n\nTypeScript  import axios from "axios";\n            import type { User } from "./types";  // 型だけ\n\nPython      import requests\n            from datetime import datetime\n\nDart        import "package:http/http.dart" as http;\n\nSwift       import Foundation\n            import SwiftUI\n\nKotlin      import kotlinx.coroutines.launch\n\nC           #include <stdio.h>\n\nC++         #include <vector>\n            using namespace std;   // 省略用（多用は非推奨）'),
        H('自分の別ファイルを読み込む'),
        CODE('各言語', 'Java        import com.example.util.DateUtil;\n\nJavaScript  import { formatDate } from "./utils/date.js";\n            import DateUtil from "./utils/date.js";   // default\n\nTypeScript  import { formatDate } from "./utils/date";\n\nPython      from utils.date import format_date\n            from .date import format_date        # 相対\n\nDart        import "utils/date.dart";\n\nSwift       （同じモジュール内はimport不要）\n\nKotlin      import com.example.utils.formatDate\n\nC / C++     #include "utils/date.h"'),
        H('公開する側の書き方'),
        CODE('各言語', 'JavaScript  export function formatDate() { }\n            export default class DateUtil { }\n            module.exports = { formatDate };     // CommonJS\n\nTypeScript  export function formatDate(): string { }\n            export interface User { }\n\nPython      （関数を定義すれば自動で公開）\n            __all__ = ["format_date"]            # 明示する場合\n\nJava        public class DateUtil { }            # publicなら外から見える\n\nDart        （_ で始まる名前だけが非公開）\n\nSwift       public func formatDate() { }\n            internal / private / fileprivate\n\nKotlin      fun formatDate() { }                 # 既定でpublic\n            internal / private\n\nC / C++     ヘッダ（.h）に宣言を書いて配る'),
        NOTE('Python と Dart は「書けば公開」が既定。\nJava・Swift・Kotlin は公開範囲を明示的に選ぶ。')
      ]},
      { t: '呼び出し方の違い', b: [
        P('読み込んだ後の使い方にも、少し癖があります。'),
        CODE('各言語', 'Python      import requests\n            requests.get(url)          # 名前空間つきで呼ぶ\n\n            from requests import get\n            get(url)                   # 直接呼ぶ\n\nDart        import "package:http/http.dart" as http;\n            http.get(url);             # as で別名を付けるのが慣習\n\nJavaScript  import axios from "axios";\n            axios.get(url);\n\n            import { get } from "./api.js";\n            get(url);\n\nC++         #include <vector>\n            std::vector<int> v;        # std:: を付ける\n\n            using namespace std;\n            vector<int> v;             # 省略できるが衝突しやすい'),
        GLOSS([
          ['as / 別名', '同じ名前がぶつかるときに付け替える'],
          ['名前空間', '名前の衝突を防ぐ入れ物。std:: や com.example'],
          ['default export', 'JSで「そのファイルの主役」を1つだけ出す書き方'],
          ['named export', '名前を付けて複数出す書き方。{ } で受け取る'],
          ['副作用インポート', 'import "./styles.css" のように、読み込むこと自体が目的']
        ])
      ]},
      { t: 'バージョンの書き方とロックファイル', b: [
        P('バージョンは「メジャー.マイナー.パッチ」の3つで表すのが一般的です（セマンティックバージョニング）。'),
        MONO('1  .  2  .  3\n│     │     └─ パッチ：バグ修正のみ。安全\n│     └─────── マイナー：機能追加。壊れない想定\n└───────────── メジャー：破壊的変更。移行作業が要る'),
        GLOSS([
          ['1.2.3', 'このバージョンだけ。完全固定'],
          ['^1.2.3', '1.x.x の範囲で新しいものを許す。メジャーは上げない'],
          ['~1.2.3', '1.2.x の範囲だけ許す。より慎重'],
          ['>=1.2.0 <2.0.0', '範囲を直接書く形'],
          ['latest / *', '常に最新。再現性がなくなるので実務では避ける']
        ]),
        H('ロックファイル'),
        P('^1.2.3 のような幅のある指定だと、入れる時期によって実際のバージョンが変わってしまいます。それを防ぐため、「今回実際に入った正確なバージョン」を記録したファイルが作られます。'),
        CODE('各言語のロックファイル', 'JavaScript   package-lock.json / yarn.lock / pnpm-lock.yaml\nPython       poetry.lock / uv.lock / requirements.txt（固定して使う）\nDart         pubspec.lock\nSwift        Package.resolved / Podfile.lock\nGradle       gradle.lockfile（任意）'),
        NOTE('ロックファイルは必ずGitに入れる。\n「自分の環境では動くのに」の大半はこれで防げる。')
      ]},
      { t: 'よくあるトラブル', b: [
        CARDS([
          ['自分の環境では動く', '', 'ロックファイルを共有していない。入っているバージョンが人によって違う'],
          ['更新したら壊れた', '', 'メジャーバージョンが上がって破壊的変更が入った。変更履歴を読む'],
          ['バージョンが衝突する', '', 'AとBが同じライブラリの別バージョンを要求している'],
          ['node_modulesが巨大', '', '推移的依存が積み上がった結果。依存を減らすか、軽い代替を探す'],
          ['脆弱性の警告が出る', '', '自分が直接入れていない、依存の依存に問題がある場合が多い'],
          ['放置されたライブラリ', '', '数年更新がない。新OSや新バージョンで動かなくなる'],
          ['グローバルに入れて混乱', 'Python', '仮想環境（venv）を作らずに入れると、プロジェクト間で干渉する']
        ]),
        CODE('SHELL', '# 何が入っているか見る\nnpm ls\npip list\n./gradlew dependencies\nflutter pub deps\n\n# 脆弱性を調べる\nnpm audit\npip-audit'),
        NOTE('依存は資産であり、同時に負債でもある。\n入れる前に「本当に要るか」を1回だけ考える。')
      ]}
    ]
  };
}

function c9() {
  return {
    tab: '基本文法早見', col: 'oklch(0.52 0.13 120)', soft: 'oklch(0.94 0.04 120)',
    title: '全言語 基本文法 早見',
    desc: 'Java / JavaScript / TypeScript / Python / Dart / Swift / Kotlin / C / C++ を、同じお題で並べて比較。',
    sections: [
      { t: 'ひとつなぎの例文 — 6つの手順', b: [
        P('ここから3つのセクションは、全言語まったく同じ動きをする小さなプログラムです。バラバラの文法ではなく、実際に動く1本のコードとして並べています。'),
        P('どれも次の6手順で、同じ順番に並んでいます。'),
        STEPS([
          ['import / #include', '依存を読み込む', '外部の機能を持ってくる。ここが無いと標準機能以外は使えない'],
          ['users = [...]', '変数を作る', 'データを用意する。この例では2人分のユーザー'],
          ['isAdult(...)', '関数を作る', '「18歳以上か」を判定する処理に名前を付ける'],
          ['filter / where', '条件で絞る', '作った関数を使って、条件に合うものだけ残す'],
          ['if / else', '条件で分ける', '結果によって処理を変える'],
          ['print / println', '実行して出す', '呼び出して、結果をコンソールへ']
        ]),
        NOTE('やることは全言語同じ。\n違うのは書き方だけ、というのが見て分かる。'),
        H('Java'),
        CODE('JAVA', '// ① 依存を読み込む\nimport java.time.LocalDate;   // java.time パッケージから LocalDate を参照\nimport java.util.List;        // java.util パッケージから List を参照\n\npublic class Main {\n\n    // データの形を決める（record は「値を入れるだけのクラス」）\n    record User(String name, int age) {}\n\n    // ③ 関数を作る — static なので new せずに呼べる\n    static boolean isAdult(User u) {\n        return u.age() >= 18;      // 18以上なら true を返す\n    }\n\n    // ⑥ ここから実行が始まる\n    public static void main(String[] args) {\n\n        // ② 変数を作る — List.of は「後から変更できないリスト」\n        List<User> users = List.of(\n            new User("Taro", 20),\n            new User("Hana", 15)\n        );\n\n        // ④ 条件で絞る — stream() で流し、filter で残し、count() で数える\n        //    Main::isAdult は「上で作った関数そのものを渡す」書き方\n        long count = users.stream().filter(Main::isAdult).count();\n\n        // ⑤ 条件で分ける\n        if (count > 0) {\n            // LocalDate.now() は ① で読み込んだクラスの機能\n            System.out.println(LocalDate.now() + " 成人 " + count + " 人");\n        } else {\n            System.out.println("成人はいません");\n        }\n    }\n}'),
        H('JavaScript'),
        CODE('JAVASCRIPT', '// ① 依存を読み込む\n//    "node:os" というモジュールから hostname だけを取り出して参照する\n//    外部パッケージなら import axios from "axios";\nimport { hostname } from "node:os";\n\n// ② 変数を作る — const は再代入できない箱\nconst users = [\n  { name: "Taro", age: 20 },   // { } はオブジェクト\n  { name: "Hana", age: 15 },\n];\n\n// ③ 関数を作る\nfunction isAdult(user) {\n  return user.age >= 18;   // 18以上なら true\n}\n\nfunction main() {\n  // ④ 条件で絞る — filter が isAdult を1件ずつ呼び、true のものだけ残す\n  const count = users.filter(isAdult).length;\n\n  // ⑤ 条件で分ける\n  if (count > 0) {\n    // ` ` はテンプレートリテラル。${ } の中に値を埋め込める\n    // hostname() は ① で読み込んだ機能\n    console.log(`${hostname()} 成人 ${count} 人`);\n  } else {\n    console.log("成人はいません");\n  }\n}\n\n// ⑥ 実行する — 定義しただけでは動かない。呼んで初めて動く\nmain();'),
        H('TypeScript'),
        CODE('TYPESCRIPT', '// ① 依存を読み込む — JavaScript とまったく同じ書き方\nimport { hostname } from "node:os";\n\n// データの形を型として決めておく（TypeScript だけの機能）\ninterface User {\n  name: string;\n  age: number;\n}\n\n// ② 変数を作る — : User[] は「Userの配列」という型注釈\nconst users: User[] = [\n  { name: "Taro", age: 20 },\n  { name: "Hana", age: 15 },\n];\n\n// ③ 関数を作る — 引数と戻り値に型が付く\nfunction isAdult(user: User): boolean {\n  return user.age >= 18;\n}\n\n// : void は「何も返さない」\nfunction main(): void {\n  // ④ 条件で絞る\n  const count: number = users.filter(isAdult).length;\n\n  // ⑤ 条件で分ける\n  if (count > 0) {\n    console.log(`${hostname()} 成人 ${count} 人`);\n  } else {\n    console.log("成人はいません");\n  }\n}\n\n// ⑥ 実行する\nmain();'),
        NOTE('JavaScript と TypeScript の差は「: 型」だけ。\n流れはまったく同じ。')
      ]},
      { t: 'ひとつなぎの例文 — Python / Dart / Swift / Kotlin', b: [
        H('Python'),
        CODE('PYTHON', '# ① 依存を読み込む\n#    datetime モジュールの中から date だけを参照する（from ... import ...）\nfrom datetime import date\n\n# ② 変数を作る — [ ] がリスト、{ } が辞書\nusers = [\n    {"name": "Taro", "age": 20},\n    {"name": "Hana", "age": 15},\n]\n\n# ③ 関数を作る — def が「関数を定義する」合図。: の後はインデントで表す\ndef is_adult(user):\n    return user["age"] >= 18   # 辞書はキーで取り出す\n\ndef main():\n    # ④ 条件で絞る — リスト内包表記。if に合うものだけ集めて len で数える\n    count = len([u for u in users if is_adult(u)])\n\n    # ⑤ 条件で分ける\n    if count > 0:\n        # f"..." は f文字列。{ } の中に値を埋め込める\n        # date.today() は ① で読み込んだ機能\n        print(f"{date.today()} 成人 {count} 人")\n    else:\n        print("成人はいません")\n\n# ⑥ 実行する\n#    「このファイルが直接実行されたときだけ main() を呼ぶ」という定番の書き方\nif __name__ == "__main__":\n    main()'),
        H('Dart'),
        CODE('DART', '// ① 依存を読み込む — dart:io は標準ライブラリ。stdout を使うために参照\nimport "dart:io";\n\n// データの形を決める\nclass User {\n  final String name;   // final は後から変更できない\n  final int age;\n  User(this.name, this.age);   // this.name と書くだけで代入される省略記法\n}\n\n// ③ 関数を作る — => は「return を1行で書く」省略形\nbool isAdult(User u) => u.age >= 18;\n\n// ⑥ ここから実行が始まる\nvoid main() {\n  // ② 変数を作る\n  final users = [User("Taro", 20), User("Hana", 15)];\n\n  // ④ 条件で絞る — Dart では filter ではなく where\n  final count = users.where(isAdult).length;\n\n  // ⑤ 条件で分ける\n  if (count > 0) {\n    // "$count" で変数を文字列に埋め込む\n    // stdout は ① で読み込んだ dart:io の機能\n    stdout.writeln("成人 $count 人");\n  } else {\n    stdout.writeln("成人はいません");\n  }\n}'),
        H('Swift'),
        CODE('SWIFT', '// ① 依存を読み込む — Foundation は標準ライブラリ一式\nimport Foundation\n\n// データの形を決める — struct はコピーで渡る型\nstruct User {\n    let name: String   // let は変更できない\n    let age: Int\n}\n\n// ③ 関数を作る\n//    _ を付けると、呼ぶときに引数名を書かなくてよくなる\n//    -> Bool は「Boolを返す」\nfunc isAdult(_ u: User) -> Bool {\n    return u.age >= 18\n}\n\nfunc main() {\n    // ② 変数を作る — 生成時は引数名（name: age:）が要る\n    let users = [\n        User(name: "Taro", age: 20),\n        User(name: "Hana", age: 15)\n    ]\n\n    // ④ 条件で絞る\n    let count = users.filter(isAdult).count\n\n    // ⑤ 条件で分ける — Swift は条件に ( ) が要らない\n    if count > 0 {\n        // \\( ) の中に値を埋め込む\n        print("成人 \\(count) 人")\n    } else {\n        print("成人はいません")\n    }\n}\n\n// ⑥ 実行する\nmain()'),
        H('Kotlin'),
        CODE('KOTLIN', '// ① 依存を読み込む — Javaの標準ライブラリをそのまま参照できる\nimport java.time.LocalDate\n\n// データの形を決める — data class は1行でクラスが完成する\ndata class User(val name: String, val age: Int)\n\n// ③ 関数を作る — = で書くと return を省略できる\nfun isAdult(u: User): Boolean = u.age >= 18\n\n// ⑥ ここから実行が始まる\nfun main() {\n    // ② 変数を作る — val は変更できない、var は変更できる\n    val users = listOf(User("Taro", 20), User("Hana", 15))\n\n    // ④ 条件で絞る — ::isAdult は「上で作った関数そのものを渡す」書き方\n    val count = users.filter(::isAdult).size\n\n    // ⑤ 条件で分ける\n    if (count > 0) {\n        // "$変数" で埋め込む。式を入れるときは ${ }\n        println("${LocalDate.now()} 成人 $count 人")\n    } else {\n        println("成人はいません")\n    }\n}'),
        NOTE('Kotlin の data class は1行でクラスが終わる。\nJavaの同じクラスと見比べると差が分かる。')
      ]},
      { t: 'ひとつなぎの例文 — C / C++', b: [
        P('CとC++だけは、リストの件数を自分で計算したり、構造体を自分で定義したりと、手数が増えます。⑧章の「他言語より大変なところ」がここに出ています。'),
        H('C'),
        CODE('C', '// ① 依存を読み込む — < > はシステムの標準ライブラリを探す印\n#include <stdio.h>     // printf を使うため\n#include <stdbool.h>   // bool / true / false を使うため\n\n// データの形を決める — Cにクラスはないので構造体を使う\ntypedef struct {\n    char name[32];   // 文字列は「文字の配列」。長さを自分で決める\n    int age;\n} User;\n\n// ③ 関数を作る\nbool is_adult(User u) {\n    return u.age >= 18;\n}\n\n// ⑥ ここから実行が始まる\nint main(void) {\n    // ② 変数を作る\n    User users[] = {{"Taro", 20}, {"Hana", 15}};\n\n    // 件数も自分で計算する（配列全体のバイト数 ÷ 1件のバイト数）\n    int len = sizeof(users) / sizeof(users[0]);\n\n    // ④ 条件で絞る — Cに filter は無いので for で自分で数える\n    int count = 0;\n    for (int i = 0; i < len; i++) {\n        if (is_adult(users[i])) {\n            count++;\n        }\n    }\n\n    // ⑤ 条件で分ける\n    if (count > 0) {\n        // %d は「ここに整数を入れる」印。\\n は改行\n        printf("成人 %d 人\\n", count);\n    } else {\n        printf("成人はいません\\n");\n    }\n    return 0;   // 0 は「正常終了」をOSに伝える\n}'),
        H('C++'),
        CODE('C++', '// ① 依存を読み込む — 使う機能ごとに1行ずつ\n#include <iostream>    // std::cout を使うため\n#include <vector>      // std::vector を使うため\n#include <string>      // std::string を使うため\n#include <algorithm>   // std::count_if を使うため\n\n// データの形を決める\nstruct User {\n    std::string name;   // Cと違い、文字列型がある\n    int age;\n};\n\n// ③ 関数を作る — const User& は「コピーせず参照で受け取る」\nbool isAdult(const User& u) {\n    return u.age >= 18;\n}\n\n// ⑥ ここから実行が始まる\nint main() {\n    // ② 変数を作る — vector は後から要素を増やせる配列\n    std::vector<User> users = {{"Taro", 20}, {"Hana", 15}};\n\n    // ④ 条件で絞る — 先頭から末尾まで見て、条件に合う数を返す\n    int count = std::count_if(users.begin(), users.end(), isAdult);\n\n    // ⑤ 条件で分ける\n    if (count > 0) {\n        // << で右へ流し込む。endl は改行\n        std::cout << "成人 " << count << " 人" << std::endl;\n    } else {\n        std::cout << "成人はいません" << std::endl;\n    }\n    return 0;\n}'),
        NOTE('Cには filter が無いので、for で自分で数える。\nC++は count_if で1行になる。')
      ]},
      srcMap().sections[7],     // 同じ処理を言語別に見る（旧①08）
      srcWords().sections[5],   // 3言語を横並びにするとこう（旧③06）
      { t: 'コメント', b: [
        CODE('コメント', 'Java        // 1行\n            /* 複数行 */\n\nJavaScript  // 1行\n            /* 複数行 */\n\nTypeScript  // 1行\n            /* 複数行 */\n\nPython      # 1行\n            """ 複数行（文字列を流用） """\n\nDart        // 1行\n            /* 複数行 */\n\nSwift       // 1行\n            /* 複数行 */\n\nKotlin      // 1行\n            /* 複数行 */\n\nC           /* 複数行 */\n            // 1行（C99以降）\n\nC++         // 1行\n            /* 複数行 */'),
        NOTE('Pythonだけ # 。\n他は全部 // で揃っている。')
      ]},
      { t: '変数と定数', b: [
        CODE('変数', 'Java        int age = 20;\n            String name = "Taro";\n            var age = 20;              // 推論（Java 10〜）\n\nJavaScript  let age = 20;\n            var age = 20;              // 古い書き方\n\nTypeScript  let age: number = 20;\n            let age = 20;              // 推論\n\nPython      age = 20\n            age: int = 20              # 型ヒント（任意）\n\nDart        int age = 20;\n            var age = 20;\n\nSwift       var age = 20\n            var age: Int = 20\n\nKotlin      var age = 20\n            var age: Int = 20\n\nC           int age = 20;\n\nC++         int age = 20;\n            auto age = 20;             // 推論'),
        CODE('定数（変更しない）', 'Java        final int AGE = 20;\nJavaScript  const age = 20;\nTypeScript  const age = 20;\nPython      AGE = 20                   # 慣習。強制力はない\nDart        final age = 20;  /  const pi = 3.14;\nSwift       let age = 20\nKotlin      val age = 20\nC           const int AGE = 20;  /  #define AGE 20\nC++         const int AGE = 20;  /  constexpr int AGE = 20;'),
        NOTE('let の意味が逆転する点に注意。\nJS/TS の let ＝ 変更できる、Swift の let ＝ 変更できない。')
      ]},
      { t: '条件分岐', b: [
        CODE('if', 'Java        if (age >= 18) { ... }\n            else if (age >= 13) { ... }\n            else { ... }\n\nJavaScript  if (age >= 18) { ... }\n            else if (age >= 13) { ... }\n            else { ... }\n\nTypeScript  （JavaScriptと同じ）\n\nPython      if age >= 18:\n                ...\n            elif age >= 13:\n                ...\n            else:\n                ...\n\nDart        if (age >= 18) { ... } else { ... }\n\nSwift       if age >= 18 { ... } else { ... }      // ( ) 不要\n\nKotlin      if (age >= 18) { ... } else { ... }\n            val s = if (age >= 18) "大人" else "子供"   // 式として使える\n\nC / C++     if (age >= 18) { ... } else { ... }'),
        CODE('複数分岐', 'Java        switch (day) {\n              case 1: ...; break;\n              default: ...;\n            }\n\nJavaScript  switch (day) { case 1: ...; break; default: ... }\n\nPython      match day:\n                case 1: ...\n                case _: ...\n\nSwift       switch day {\n            case 1: ...\n            default: ...\n            }                          // breakは不要\n\nKotlin      when (day) {\n                1 -> ...\n                else -> ...\n            }\n\nDart        switch (day) { case 1: ...; break; }\n\nC / C++     switch (day) { case 1: ...; break; default: ...; }'),
        NOTE('Pythonはインデントでブロックを表す。{ } を使わない。\nSwift・Kotlinは条件の ( ) が不要／breakが不要。')
      ]},
      { t: '繰り返し', b: [
        CODE('回数で回す', 'Java        for (int i = 0; i < 5; i++) { ... }\nJavaScript  for (let i = 0; i < 5; i++) { ... }\nTypeScript  （同じ）\nPython      for i in range(5):\n                ...\nDart        for (var i = 0; i < 5; i++) { ... }\nSwift       for i in 0..<5 { ... }\nKotlin      for (i in 0 until 5) { ... }\nC / C++     for (int i = 0; i < 5; i++) { ... }'),
        CODE('中身を1つずつ', 'Java        for (String n : names) { ... }\nJavaScript  for (const n of names) { ... }\nPython      for n in names:\n                ...\nDart        for (final n in names) { ... }\nSwift       for n in names { ... }\nKotlin      for (n in names) { ... }\nC++         for (auto n : names) { ... }      // C++11〜\nC           for (int i = 0; i < len; i++) { ... }   // 添字で回す'),
        CODE('条件で回す', 'ほぼ共通    while (条件) { ... }\nPython      while 条件:\n                ...\n共通        break    → 抜ける\n            continue → 次の回へ')
      ]},
      { t: '関数', b: [
        CODE('関数の定義', 'Java        public int add(int a, int b) {\n                return a + b;\n            }\n\nJavaScript  function add(a, b) { return a + b; }\n            const add = (a, b) => a + b;\n\nTypeScript  function add(a: number, b: number): number {\n                return a + b;\n            }\n\nPython      def add(a, b):\n                return a + b\n\nDart        int add(int a, int b) => a + b;\n\nSwift       func add(_ a: Int, _ b: Int) -> Int {\n                return a + b\n            }\n\nKotlin      fun add(a: Int, b: Int): Int = a + b\n\nC / C++     int add(int a, int b) {\n                return a + b;\n            }'),
        MONO('戻り値の型の位置\n\n前に書く   Java / C / C++ / Dart   →  int add(...)\n後ろに書く Swift                    →  func add(...) -> Int\n           Kotlin                   →  fun add(...): Int\n           TypeScript               →  function add(...): number\n書かない   JavaScript / Python')
      ]},
      { t: 'クラス', b: [
        CODE('クラス定義', 'Java        public class User {\n                private String name;\n                public User(String name) { this.name = name; }\n                public String getName() { return name; }\n            }\n\nJavaScript  class User {\n              constructor(name) { this.name = name; }\n              hello() { console.log(this.name); }\n            }\n\nTypeScript  class User {\n              constructor(private name: string) {}\n              hello(): void { console.log(this.name); }\n            }\n\nPython      class User:\n                def __init__(self, name):\n                    self.name = name\n                def hello(self):\n                    print(self.name)\n\nDart        class User {\n              final String name;\n              User(this.name);\n            }\n\nSwift       struct User {\n                let name: String\n            }\n\nKotlin      class User(val name: String)\n\nC++         class User {\n            private:\n                std::string name_;\n            public:\n                User(std::string n) : name_(n) {}\n            };\n\nC           // クラスはない。構造体を使う\n            struct User { char name[32]; };'),
        NOTE('自分自身を指す言葉は this（Java/JS/TS/Dart/C++）、\nself（Python/Swift）。Kotlinは this。')
      ]},
      { t: '配列・リスト', b: [
        CODE('作る', 'Java        List<String> names = new ArrayList<>();\n            String[] arr = {"a", "b"};\n\nJavaScript  const names = ["a", "b"];\n\nTypeScript  const names: string[] = ["a", "b"];\n\nPython      names = ["a", "b"]\n\nDart        final names = <String>["a", "b"];\n\nSwift       var names = ["a", "b"]\n            var names: [String] = []\n\nKotlin      val names = listOf("a", "b")        // 変更不可\n            val names = mutableListOf("a")      // 変更可\n\nC           char *names[] = {"a", "b"};\n\nC++         std::vector<std::string> names = {"a", "b"};'),
        CODE('よく使う操作', '追加        Java  list.add(x)        JS    arr.push(x)\n            Python  list.append(x)   Dart  list.add(x)\n            Swift   arr.append(x)    Kotlin list.add(x)\n            C++     v.push_back(x)\n\n件数        Java  list.size()        JS    arr.length\n            Python  len(list)        Dart  list.length\n            Swift   arr.count        Kotlin list.size\n            C++     v.size()\n\n絞り込み    JS/TS/Swift/Kotlin  filter\n            Python              [x for x in xs if 条件]\n            Dart                where\n            Java                stream().filter(...)\n\n変換        ほぼ全部            map')
      ]},
      { t: '辞書・マップ', b: [
        CODE('キーと値', 'Java        Map<String, Integer> m = new HashMap<>();\n            m.put("age", 20);\n            m.get("age");\n\nJavaScript  const m = { age: 20 };\n            m.age;  /  m["age"];\n            const m2 = new Map();\n\nTypeScript  const m: Record<string, number> = { age: 20 };\n\nPython      m = {"age": 20}\n            m["age"]\n            m.get("age")\n\nDart        final m = {"age": 20};\n            m["age"];\n\nSwift       var m = ["age": 20]\n            m["age"]\n\nKotlin      val m = mapOf("age" to 20)\n            m["age"]\n\nC++         std::map<std::string, int> m;\n            m["age"] = 20;\n\nC           // 標準にはない。自分で実装するか外部ライブラリ')
      ]},
      { t: '「値がない」の扱い', b: [
        CODE('nullまわり', 'Java        String name = null;\n            if (name != null) { ... }\n            Optional<String> name;              // 明示的に扱う場合\n\nJavaScript  null と undefined の2つがある\n            name?.length\n            name ?? "既定値"\n\nTypeScript  string | null / string | undefined\n            strictNullChecks で厳格にできる\n\nPython      name = None\n            if name is not None: ...\n\nDart        String? name;\n            name?.length\n            name ?? "既定値"\n\nSwift       var name: String?\n            if let name = name { ... }\n            name ?? "既定値"\n\nKotlin      var name: String?\n            name?.length\n            name ?: "既定値"\n\nC / C++     NULL / nullptr\n            触るとその場でクラッシュ（Segfault）'),
        NOTE('Dart・Swift・Kotlin・TypeScript(strict) は、\nnullが入る可能性を型で区別する。ここが新しい世代の共通点。')
      ]},
      { t: '例外処理', b: [
        CODE('try / catch', 'Java        try { ... }\n            catch (IOException e) { ... }\n            finally { ... }\n\nJavaScript  try { ... } catch (e) { ... } finally { ... }\n\nTypeScript  （同じ。catch (e: unknown)）\n\nPython      try:\n                ...\n            except ValueError as e:\n                ...\n            finally:\n                ...\n\nDart        try { ... } on Exception catch (e) { ... }\n\nSwift       do {\n                try 何か()\n            } catch {\n                print(error)\n            }\n\nKotlin      try { ... } catch (e: Exception) { ... }\n\nC++         try { ... } catch (const std::exception& e) { ... }\n\nC           // 例外がない。戻り値やerrnoで判定する'),
        CODE('自分で投げる', 'Java        throw new IllegalArgumentException("だめ");\nJavaScript  throw new Error("だめ");\nPython      raise ValueError("だめ")\nDart        throw Exception("だめ");\nSwift       throw MyError.invalid\nKotlin      throw IllegalArgumentException("だめ")\nC++         throw std::runtime_error("だめ");'),
        NOTE('Pythonだけ raise。他は throw。\nCには例外の仕組み自体がない。')
      ]},
      { t: '文字列の連結と埋め込み', b: [
        CODE('埋め込み', 'Java        "Hi " + name\n            String.format("Hi %s", name)\n            "Hi \\{name}"                 // テンプレート（新しめ）\n\nJavaScript  `Hi ${name}`\n            "Hi " + name\n\nTypeScript  `Hi ${name}`\n\nPython      f"Hi {name}"\n            "Hi {}".format(name)\n            "Hi " + name\n\nDart        "Hi $name"\n            "Hi ${user.name}"\n\nSwift       "Hi \\(name)"\n\nKotlin      "Hi $name"\n            "Hi ${user.name}"\n\nC           printf("Hi %s\\n", name);\n\nC++         "Hi " + name                  // std::string同士\n            std::format("Hi {}", name)    // C++20'),
        NOTE('$ で埋め込む   → Dart / Kotlin\n${ } で囲う    → JS / TS\nf"..." と \\( ) → Python / Swift')
      ]},
      { t: 'コンソールに出す', b: [
        CODE('出力', 'Java        System.out.println("Hi");\nJavaScript  console.log("Hi");\nTypeScript  console.log("Hi");\nPython      print("Hi")\nDart        print("Hi");\nSwift       print("Hi")\nKotlin      println("Hi")\nC           printf("Hi\\n");\nC++         std::cout << "Hi" << std::endl;'),
        NOTE('①章のとおり、これらは全部コンソール向け。\nユーザーの画面に出すのは別の手段。')
      ]},
      { t: 'プログラムの入口', b: [
        CODE('エントリーポイント', 'Java        public static void main(String[] args) { }\n\nJavaScript  （ファイルの先頭から順に実行）\n\nTypeScript  （同じ）\n\nPython      if __name__ == "__main__":\n                main()\n\nDart        void main() { }\n\nSwift       @main struct App { }\n            （またはmain.swiftの先頭から）\n\nKotlin      fun main() { }\n\nC           int main(void) { return 0; }\n\nC++         int main() { return 0; }'),
        NOTE('JavaScript と Python は「上から順に実行」が基本。\nJava・C・C++ は main から必ず始まる。')
      ]},
      { t: '実行のしかた', b: [
        CODE('SHELL', 'Java        javac Main.java && java Main\n            （またはビルドツール経由）\n\nJavaScript  node index.js\n\nTypeScript  npx tsc && node index.js\n            npx tsx index.ts\n\nPython      python main.py\n\nDart        dart run main.dart\nFlutter     flutter run\n\nSwift       swift main.swift\n            （アプリはXcodeでビルド）\n\nKotlin      kotlinc main.kt -include-runtime -d app.jar\n            java -jar app.jar\n\nC           gcc main.c -o app && ./app\n\nC++         g++ main.cpp -o app && ./app'),
        ROWS(['実行の方式'], [
          ['Python / JavaScript', '', 'そのまま実行（インタプリタ）'],
          ['Java / Kotlin', '', '中間コードにして仮想マシン（JVM）で実行'],
          ['TypeScript', '', 'JavaScriptに変換してから実行'],
          ['Dart / Flutter', '', '開発中は即時実行、リリース時は機械語に変換'],
          ['Swift', '', '機械語に変換'],
          ['C / C++', '', '機械語に変換']
        ])
      ]}
    ]
  };
}
