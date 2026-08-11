// ⑩〜⑫章。言語ごとの代表的なフレームワーク紹介。

function c10() {
  return {
    tab: '⑩ React / Next.js', col: 'oklch(0.62 0.16 210)', soft: 'oklch(0.94 0.04 210)',
    title: 'JavaScript のフレームワーク',
    desc: 'Reactで画面を部品に分け、Next.jsがページ・ルーティング・サーバー処理まで面倒を見る。今のWeb開発の主流。',
    sections: [
      { t: 'どこに何が乗っているか', b: [
        P('JavaScriptの世界は積み重ねになっています。下から順に、素のJavaScript、Reactで画面を部品化、Next.jsでアプリ全体の土台、という関係です。'),
        FLOW(['ブラウザ / Node.js', 'JavaScript / TypeScript', 'React（画面を部品で作る）', 'Next.js（ページ・ルーティング・サーバー処理）']),
        CARDS([
          ['React', 'ライブラリ', '画面を部品（コンポーネント）に分けて組み立てる道具。画面のことだけを担当する'],
          ['Next.js', 'フレームワーク', 'Reactの上に乗る土台。URLとページの対応、サーバー側の処理、ビルドまで面倒を見る'],
          ['関係', '', 'Next.jsを使うと、中でReactを書く。ReactだけでもWebは作れるが、規模が大きいと足りなくなる']
        ]),
        NOTE('React ＝ 自分が呼ぶ（ライブラリ）\nNext.js ＝ 自分が呼ばれる（フレームワーク）')
      ]},
      { t: 'React — 画面を部品に分ける', b: [
        P('Reactでは、画面を「関数」で書きます。関数がHTMLのようなものを返し、それがそのまま画面になります。'),
        CODE('REACT / JSX', 'function Greeting() {\n  return <p>Hello</p>;\n}\n\n// 使う側\nfunction App() {\n  return (\n    <div>\n      <Greeting />\n      <Greeting />\n    </div>\n  );\n}'),
        P('この「HTMLのような書き方」をJSXと呼びます。JavaScriptの中にタグを書けるようにした記法です。'),
        H('外から値を渡す — props'),
        CODE('REACT', 'function Greeting({ name }) {\n  return <p>Hello, {name}</p>;\n}\n\n<Greeting name="Taro" />'),
        H('中の状態を持つ — state'),
        CODE('REACT', 'import { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      {count} 回\n    </button>\n  );\n}'),
        NOTE('画面を直接書き換えない。\nstateを変えると、Reactが画面を作り直す。'),
        P('⑥章のFlutter・SwiftUI・Composeと同じ「宣言的UI」の発想です。実際、SwiftUIやComposeはReactの影響を受けています。')
      ]},
      { t: 'React の基本用語', b: [
        GLOSS([
          ['コンポーネント', '画面の部品。大文字で始まる関数として書く'],
          ['JSX', 'JavaScriptの中にHTMLのようなタグを書く記法。.jsx / .tsx'],
          ['props', '親から子へ渡す値。子からは書き換えない'],
          ['state', 'その部品が持つ状態。変わると画面が作り直される'],
          ['useState', '状態を1つ作るフック。[値, 更新関数] を返す'],
          ['useEffect', '描画の後に副作用を実行するフック。通信や購読など'],
          ['フック（Hook）', 'use で始まる関数群。Reactの機能を関数から使うための仕組み'],
          ['再レンダリング', 'stateやpropsが変わったとき、関数がもう一度呼ばれること'],
          ['key', 'リストを描くとき、各要素を識別するための印'],
          ['仮想DOM', '一度メモリ上で画面を組み立て、変わった所だけ本物に反映する仕組み'],
          ['className', 'JSXでのclass指定。classは予約語なのでこう書く'],
          ['{ }', 'JSXの中でJavaScriptの値を埋め込む記号']
        ])
      ]},
      { t: 'Reactだけだと足りないもの', b: [
        P('Reactは画面の担当なので、アプリとして必要な残りは自分でそろえる必要があります。'),
        CARDS([
          ['URLとページの対応', 'ルーティング', '/about を開いたらどの部品を出すか。別ライブラリが必要'],
          ['サーバー側での描画', 'SSR', '最初の表示を速くしたり、検索エンジンに読ませたい場合'],
          ['データの取得場所', '', 'どこでAPIを呼ぶか、その結果をどう配るか'],
          ['ビルド設定', '', '本番用にまとめる設定を自分で組む'],
          ['画像やフォントの最適化', '', '自前で用意することになる']
        ]),
        P('これらをまとめて用意したのがNext.jsです。')
      ]},
      { t: 'Next.js — Reactの土台', b: [
        P('Next.jsの一番の特徴は、フォルダの構造がそのままURLになることです。'),
        CODE('フォルダ構成（App Router）', 'app/\n  page.tsx           →  /\n  about/\n    page.tsx         →  /about\n  blog/\n    [slug]/\n      page.tsx       →  /blog/任意の文字\n  api/\n    users/\n      route.ts       →  /api/users\n  layout.tsx         →  全ページ共通の枠'),
        CODE('app/about/page.tsx', 'export default function About() {\n  return <h1>About</h1>;\n}'),
        NOTE('ルーティング用の設定ファイルを書かない。\nファイルを置いた場所がURLになる。'),
        GLOSS([
          ['App Router', '今の標準。appフォルダを使う方式'],
          ['Pages Router', '古い方式。pagesフォルダを使う。既存プロジェクトで見かける'],
          ['page.tsx', 'そのURLの画面本体'],
          ['layout.tsx', '複数ページで共通の外枠。ヘッダーなど'],
          ['[slug]', '可変部分。/blog/hello の hello が受け取れる'],
          ['route.ts', 'APIの実装。画面ではなくデータを返す'],
          ['loading.tsx', '読み込み中に出す画面'],
          ['error.tsx', 'エラー時に出す画面']
        ])
      ]},
      { t: 'サーバーで描くか、ブラウザで描くか', b: [
        P('Next.jsの中心的な話題です。同じ画面でも、どこで組み立てるかで速さと性質が変わります。'),
        ROWS(['何をするか', '向いている場面'], [
          ['CSR', 'クライアントサイド', 'ブラウザに来てからJSで画面を作る', '管理画面など、ログイン後の動的な画面'],
          ['SSR', 'サーバーサイド', 'アクセスのたびにサーバーで作って送る', '常に最新が必要。ユーザーごとに違う画面'],
          ['SSG', '静的生成', 'ビルド時に作っておく。ただ配るだけ', 'ブログ、ドキュメント。最速'],
          ['ISR', '差分再生成', 'SSGを一定時間ごとに作り直す', '更新はあるが毎回でなくていいページ']
        ]),
        H('Server Component と Client Component'),
        P('Next.jsのApp Routerでは、既定でサーバー側の部品になります。ブラウザでの操作が必要な部品だけ、先頭に印を付けます。'),
        CODE('サーバー側（既定）', '// DBを直接触ってよい。ブラウザには送られない\nexport default async function Page() {\n  const users = await db.user.findMany();\n  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;\n}'),
        CODE('ブラウザ側', '"use client";\n\nimport { useState } from "react";\n\nexport default function Counter() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>{n}</button>;\n}'),
        NOTE('useState や onClick を使うなら "use client" が要る。\n付けない部品はサーバーで動き、JSがブラウザに届かない。')
      ]},
      { t: 'React と Next.js の違い早見', b: [
        ROWS(['React', 'Next.js'], [
          ['正体', '', 'ライブラリ', 'フレームワーク'],
          ['担当', '', '画面の組み立てだけ', 'ページ・ルーティング・サーバー処理・ビルド'],
          ['ルーティング', '', '別途ライブラリを入れる', 'フォルダ構成がそのままURL'],
          ['サーバー処理', '', 'なし', 'Server Component / API Routes'],
          ['始め方', '', 'npm create vite@latest', 'npx create-next-app@latest'],
          ['向く規模', '', '画面だけ埋め込みたい、小さく始めたい', 'サイト全体、SEOが要る、APIも一緒に持ちたい']
        ]),
        CODE('SHELL', '# React だけ（Vite）\nnpm create vite@latest my-app -- --template react-ts\n\n# Next.js\nnpx create-next-app@latest my-app')
      ]},
      { t: '周辺でよく出る名前', b: [
        GLOSS([
          ['Vite', '開発サーバーとビルドの道具。Reactを素早く始めるときの定番'],
          ['Vue / Svelte / Angular', 'Reactと同じ立場の別の選択肢'],
          ['Express', 'Node.jsの軽量Webフレームワーク。APIサーバーの定番'],
          ['NestJS', 'Node.js向けの本格フレームワーク。Springに考え方が近い'],
          ['Tailwind CSS', 'クラス名を並べてデザインするCSSの道具'],
          ['Redux / Zustand / Jotai', 'アプリ全体の状態を管理する道具'],
          ['TanStack Query', 'サーバーから取ったデータの取得・キャッシュ管理'],
          ['Prisma / Drizzle', 'TypeScriptからDBを型付きで扱うORM'],
          ['Vercel', 'Next.jsを作った会社のホスティングサービス'],
          ['React Native', 'Reactの書き方でスマホアプリを作る。⑥章のFlutterの対抗馬']
        ]),
        NOTE('学ぶ順は JavaScript → React → Next.js。\n飛ばすと、どこまでがReactの話か分からなくなる。')
      ]}
    ]
  };
}

function c11() {
  return {
    tab: '⑪ Flask / Django / FastAPI', col: 'oklch(0.58 0.13 95)', soft: 'oklch(0.94 0.05 95)',
    title: 'Python のフレームワーク',
    desc: '小さく始めるFlask、全部入りのDjango、型と速さのFastAPI。同じAPIを3つで書き比べる。',
    sections: [
      { t: '3つの立ち位置', b: [
        CARDS([
          ['Flask', 'マイクロ', '必要最小限だけ。足りないものは自分で選んで足す。学習と小規模に向く'],
          ['Django', 'フルスタック', '管理画面・DB・認証・テンプレートまで最初から入っている。大規模Webサイト向け'],
          ['FastAPI', 'モダンAPI', '型ヒントを使い、自動でドキュメントを作る。非同期に強い。API専用と考えてよい']
        ]),
        ROWS(['得意', '入っているもの', '向く用途'], [
          ['Flask', '小さく始める', '軽さと自由度', 'ルーティングとテンプレートのみ', '小規模Web、社内ツール、学習'],
          ['Django', '全部入り', '一貫した作法', 'ORM・管理画面・認証・フォーム・テンプレート', 'ECサイト、業務システム、CMS'],
          ['FastAPI', 'API', '型と自動ドキュメント', 'バリデーション・OpenAPI・非同期', 'REST API、機械学習モデルの公開']
        ]),
        NOTE('Web画面まで作るなら Django。\nAPIだけ返すなら FastAPI。\n小さく学ぶなら Flask。')
      ]},
      { t: 'Flask — 最小構成', b: [
        CODE('PYTHON', 'from flask import Flask\n\napp = Flask(__name__)\n\n@app.route("/")\ndef index():\n    return "Hello"\n\n@app.route("/users/<user_id>")\ndef show_user(user_id):\n    return {"id": user_id, "name": "Taro"}\n\nif __name__ == "__main__":\n    app.run(debug=True)'),
        MONO('@app.route("/")   → このURLが来たら下の関数を呼ぶ\n<user_id>         → URLの可変部分。引数で受け取る\n辞書を返す        → 自動でJSONになる\ndebug=True        → 保存すると自動で再起動'),
        P('@ で始まる行はデコレータと呼び、「この関数にこういう役割を足す」という印です。Pythonのフレームワークでは頻出します。'),
        GLOSS([
          ['@app.route', 'URLと関数を結びつける'],
          ['Blueprint', '機能ごとにファイルを分ける仕組み'],
          ['Jinja2', 'HTMLテンプレートエンジン。Djangoのものと似ている'],
          ['Flask-SQLAlchemy', 'DBを扱う拡張。標準では入っていない'],
          ['WSGI', 'PythonのWebアプリとサーバーをつなぐ従来の規格']
        ])
      ]},
      { t: 'Django — 全部入り', b: [
        P('Djangoは「作り方の型」まで決まっています。最初は約束事が多く感じますが、大規模になるほど効いてきます。'),
        CODE('SHELL', 'django-admin startproject config .\npython manage.py startapp users\npython manage.py migrate\npython manage.py runserver'),
        CODE('models.py（DBの定義）', 'from django.db import models\n\nclass User(models.Model):\n    name = models.CharField(max_length=100)\n    age = models.IntegerField()\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    def __str__(self):\n        return self.name'),
        CODE('views.py（処理）', 'from django.shortcuts import render\nfrom .models import User\n\ndef user_list(request):\n    users = User.objects.filter(age__gte=18)\n    return render(request, "users/list.html", {"users": users})'),
        CODE('urls.py（URL対応）', 'from django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path("users/", views.user_list),\n]'),
        P('クラスを書いてコマンドを打つと、DBのテーブルが自動で作られます。これがORMです。'),
        GLOSS([
          ['ORM', 'PythonのクラスとDBの表を対応づける仕組み。SQLをほぼ書かずに済む'],
          ['models.py', 'DBの構造を書く場所'],
          ['views.py', 'リクエストを受けて返す処理'],
          ['urls.py', 'URLとviewの対応表'],
          ['migrate', 'モデルの変更を実際のDBに反映するコマンド'],
          ['makemigrations', '変更内容の差分ファイルを作るコマンド'],
          ['管理画面', '/admin。データを追加・編集できる画面が自動でできる'],
          ['MTV', 'Model / Template / View。Djangoの構成の呼び方'],
          ['Django REST framework', 'DjangoでAPIを作るための拡張']
        ]),
        NOTE('Djangoの最大の武器は自動生成される管理画面。\n業務システムでは、これだけで工数が大きく減る。')
      ]},
      { t: 'FastAPI — 型と自動ドキュメント', b: [
        P('⑤章のTypeScriptと同じ発想で、Pythonの型ヒントを本気で使います。型を書くと、入力チェックとAPIドキュメントが自動でついてきます。'),
        CODE('PYTHON', 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass User(BaseModel):\n    name: str\n    age: int\n\n@app.get("/users/{user_id}")\ndef get_user(user_id: int):\n    return {"id": user_id, "name": "Taro"}\n\n@app.post("/users")\ndef create_user(user: User):\n    return {"created": user.name}\n\n@app.get("/slow")\nasync def slow():\n    await something()\n    return {"ok": True}'),
        CARDS([
          ['型チェックが自動', 'user_id: int', '数字でない値が来たら、自分で書かなくてもエラーを返す'],
          ['入力の検証が自動', 'Pydantic', 'BaseModelを継承したクラスが、そのまま入力の仕様になる'],
          ['ドキュメントが自動', '/docs', '起動して /docs を開くと、試せるAPI仕様書が出ている'],
          ['非同期に対応', 'async def', 'そのままasync/awaitが書ける']
        ]),
        GLOSS([
          ['Pydantic', '型に基づいてデータを検証・変換するライブラリ。FastAPIの土台'],
          ['BaseModel', 'データの形を定義するクラス'],
          ['@app.get / @app.post', 'HTTPメソッドとURLの割り当て'],
          ['{user_id}', 'URLの可変部分。関数の引数名と一致させる'],
          ['/docs', '自動生成されるSwagger UI'],
          ['OpenAPI', 'API仕様を書く標準形式。自動で出力される'],
          ['Uvicorn', 'FastAPIを動かすサーバー'],
          ['ASGI', '非同期に対応した新しい規格。WSGIの後継']
        ])
      ]},
      { t: '同じAPIを3つで書き比べる', b: [
        P('「/users にPOSTされたら、名前を返す」だけのAPIです。'),
        CODE('FLASK', 'from flask import Flask, request\n\napp = Flask(__name__)\n\n@app.post("/users")\ndef create():\n    data = request.get_json()\n    # 型チェックは自分で書く\n    return {"created": data["name"]}'),
        CODE('DJANGO（DRF）', 'from rest_framework.decorators import api_view\nfrom rest_framework.response import Response\n\n@api_view(["POST"])\ndef create(request):\n    name = request.data.get("name")\n    return Response({"created": name})'),
        CODE('FASTAPI', 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\nclass User(BaseModel):\n    name: str\n\napp = FastAPI()\n\n@app.post("/users")\ndef create(user: User):\n    # 型チェックは自動\n    return {"created": user.name}'),
        NOTE('行数はほぼ同じでも、\nFastAPIだけ「検証」と「仕様書」がついてくる。')
      ]},
      { t: '選び方', b: [
        CARDS([
          ['学習・小さいツール', 'Flask', '仕組みが見えやすい。理解してから他へ移ると早い'],
          ['画面もDBも認証も要る', 'Django', '自分で選ぶ手間がない。管理画面が強力'],
          ['APIだけ返す', 'FastAPI', '型・検証・ドキュメントが最初からそろう'],
          ['機械学習モデルを公開', 'FastAPI', 'Pythonの資産をそのままAPI化できる'],
          ['既存の大規模サイト', 'Django', '採用事例と情報量が多い']
        ]),
        ROWS(['学習コスト', 'つまずきやすい所'], [
          ['Flask', '', '低い', '規模が大きくなると構成を自分で決める必要がある'],
          ['Django', '', '高め', '約束事が多い。ORMとmigrationの理解が壁'],
          ['FastAPI', '', '中', '型ヒントと非同期の理解が前提になる']
        ])
      ]}
    ]
  };
}

function c12() {
  return {
    tab: '⑫ Spring / Quarkus', col: 'oklch(0.46 0.14 35)', soft: 'oklch(0.93 0.045 35)',
    title: 'Java のフレームワーク',
    desc: '業務システムの定番Spring Boot、起動が速い新世代のQuarkusとMicronaut。共通するのはDIという考え方。',
    sections: [
      { t: '4つの関係', b: [
        P('Javaの世界はSpringが長く標準でした。近年、クラウドやコンテナ向けに「起動が速く、メモリを食わない」フレームワークが出てきています。'),
        CARDS([
          ['Spring', '土台', 'DIやWeb機能を提供する巨大な基盤。歴史が長く、機能が非常に多い'],
          ['Spring Boot', '実用形', 'Springを設定なしで使えるようにしたもの。今Javaで「Spring」と言えば普通はこれ'],
          ['Quarkus', '新世代', 'Red Hat製。起動が非常に速く、メモリが小さい。コンテナ・Kubernetes向け'],
          ['Micronaut', '新世代', 'コンパイル時にDIを解決する設計。こちらも起動が速い']
        ]),
        FLOW(['Java', 'Spring（土台）', 'Spring Boot（すぐ使える形）']),
        NOTE('Spring と Spring Boot は別物ではない。\nSpring Boot は Spring を使いやすくした包装。'),
        P('QuarkusとMicronautは、Spring Bootの対抗馬です。書き味は驚くほど似ているので、Springを知っていれば移りやすいです。')
      ]},
      { t: 'Spring Boot — 最小のAPI', b: [
        CODE('JAVA', 'import org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\nimport org.springframework.web.bind.annotation.*;\n\n@SpringBootApplication\npublic class App {\n    public static void main(String[] args) {\n        SpringApplication.run(App.class, args);\n    }\n}\n\n@RestController\nclass UserController {\n\n    @GetMapping("/users/{id}")\n    public String getUser(@PathVariable String id) {\n        return "user " + id;\n    }\n\n    @PostMapping("/users")\n    public String create(@RequestBody User user) {\n        return "created " + user.getName();\n    }\n}'),
        MONO('@SpringBootApplication → ここがアプリの起点\n@RestController        → JSONを返す係\n@GetMapping("/users")  → GETでこのURLが来たら呼ぶ\n@PathVariable          → URLの可変部分を受け取る\n@RequestBody           → 送られてきたJSONをオブジェクトに変換'),
        P('@ で始まるものをアノテーションと呼びます。⑪章のPythonのデコレータと同じ役割で、「この部品はこういう役目」と印を付けています。')
      ]},
      { t: 'DI — 4つに共通する中心的な考え方', b: [
        P('DI（依存性注入）は、必要な部品を自分で作らず、外から渡してもらう設計です。Javaのフレームワークはこれが中心にあります。'),
        CODE('DIなし', 'class UserService {\n    // 自分で作ってしまう\n    private UserRepository repo = new UserRepository();\n}'),
        CODE('DIあり（Spring）', '@Service\nclass UserService {\n    private final UserRepository repo;\n\n    // 外から渡してもらう\n    public UserService(UserRepository repo) {\n        this.repo = repo;\n    }\n}'),
        CARDS([
          ['何が嬉しいか', 'テスト', '本物のDBの代わりに偽物を渡せる。テストが書きやすい'],
          ['何が嬉しいか', '差し替え', '実装を変えても、使う側のコードを触らずに済む'],
          ['誰が渡すか', 'コンテナ', 'フレームワークが起動時に部品を集め、必要な所へ配る']
        ]),
        GLOSS([
          ['DI', '依存性注入。必要な部品を外から渡す'],
          ['Bean', 'Springが管理する部品のこと'],
          ['コンテナ', 'Beanを保管して配る仕組み'],
          ['@Component', '「これはBeanです」という一般的な印'],
          ['@Service', '業務処理を持つBean'],
          ['@Repository', 'DBアクセスを持つBean'],
          ['@Autowired', '注入してもらう印。今はコンストラクタ注入が推奨'],
          ['@Configuration', '設定を書くクラス']
        ]),
        NOTE('SpringもQuarkusもMicronautも、\nこのDIの発想は共通。違うのは「いつ解決するか」。')
      ]},
      { t: 'Quarkus と Micronaut — 何が違うのか', b: [
        P('Spring Bootは、起動時にアノテーションを読み取って部品を組み立てます（実行時DI）。この処理に時間とメモリがかかります。'),
        ROWS(['DIを解決するタイミング', '起動の速さ', '特徴'], [
          ['Spring Boot', '', '実行時（起動時にリフレクションで解決）', '数秒', '機能と情報量が圧倒的。事実上の標準'],
          ['Quarkus', '', 'ビルド時', '非常に速い', 'ネイティブ化に強い。Kubernetes前提の設計'],
          ['Micronaut', '', 'コンパイル時', '非常に速い', 'リフレクションを使わない設計。省メモリ']
        ]),
        H('ネイティブイメージ'),
        P('QuarkusとMicronautは、GraalVMを使ってJavaコードを機械語の実行ファイルに変換できます。⑦章のC/C++に近い形になり、起動がミリ秒単位になります。'),
        FLOW(['Javaコード', 'GraalVM native-image', '実行ファイル（JVM不要）', 'ミリ秒で起動']),
        CARDS([
          ['向く場面', 'サーバーレス', '呼ばれるたびに起動する。起動の速さが直接コストになる'],
          ['向く場面', 'コンテナを大量に動かす', 'メモリが小さいほど台数を減らせる'],
          ['向かない場面', '既存の大規模Spring資産', '移行コストが大きい。無理に変える理由は薄い']
        ]),
        CODE('QUARKUS', 'import jakarta.ws.rs.*;\n\n@Path("/users")\npublic class UserResource {\n\n    @GET\n    @Path("/{id}")\n    public String get(@PathParam("id") String id) {\n        return "user " + id;\n    }\n}'),
        CODE('MICRONAUT', 'import io.micronaut.http.annotation.*;\n\n@Controller("/users")\npublic class UserController {\n\n    @Get("/{id}")\n    public String get(String id) {\n        return "user " + id;\n    }\n}'),
        NOTE('書き方はSpringとほぼ同じ。\nアノテーションの名前が違うだけ、という場面が多い。')
      ]},
      { t: '4つの比較早見', b: [
        ROWS(['開発元', '起動', 'メモリ', '情報量', '向く場面'], [
          ['Spring Boot', '', 'VMware / Pivotal', '数秒', '多め', '非常に多い', '業務システム全般。迷ったらこれ'],
          ['Quarkus', '', 'Red Hat', '非常に速い', '少ない', '中', 'コンテナ、Kubernetes、サーバーレス'],
          ['Micronaut', '', 'Object Computing', '非常に速い', '少ない', '少なめ', 'マイクロサービス、省リソース'],
          ['Spring（素）', '', '—', '—', '—', '多い', '今から素で使うことはほぼない']
        ]),
        NOTE('学習の入口は Spring Boot 一択。\n情報量が違いすぎるので、まずここで作法を覚える。')
      ]},
      { t: 'Java フレームワーク用語', b: [
        GLOSS([
          ['アノテーション', '@ で始まる印。クラスやメソッドに役割を付ける'],
          ['@RestController', 'JSONを返すWeb入口'],
          ['@Controller', '画面（HTML）を返すWeb入口'],
          ['@Entity', 'DBの表に対応するクラス'],
          ['JPA / Hibernate', 'JavaのORM。クラスと表を対応づける'],
          ['Spring Data JPA', 'メソッド名を書くだけでSQLが作られる仕組み'],
          ['application.yml', '設定ファイル。DB接続先やポート番号'],
          ['Maven / Gradle', 'ビルドと依存管理（⑧章）'],
          ['Spring Initializr', '雛形を作る公式サイト。start.spring.io'],
          ['Actuator', '死活監視やメトリクスを出す機能'],
          ['GraalVM', 'Javaを機械語にする仕組み。ネイティブ化の土台'],
          ['Jakarta EE', '旧Java EE。QuarkusはこのAPIを使う'],
          ['MicroProfile', 'マイクロサービス向けのJava標準仕様群']
        ]),
        CODE('SHELL', '# Spring Boot の雛形を作る\n# https://start.spring.io から生成、または\ncurl https://start.spring.io/starter.zip -o app.zip\n\n# Quarkus\nquarkus create app com.example:app\n\n# Micronaut\nmn create-app com.example.app\n\n# 起動\n./mvnw spring-boot:run      # Spring Boot\n./mvnw quarkus:dev          # Quarkus\n./gradlew run               # Micronaut')
      ]}
    ]
  };
}
