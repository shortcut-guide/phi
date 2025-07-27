# phis-admin

---

ECサイト横断管理プラットフォーム「phis-admin」システム概要、機能一覧、システムアーキテクチャ、詳細機能仕様、収益化モデル、ディレクトリ構成、起動方法、デプロイ方法、Cloudflare D1データベース構造、各種API、フロントエンド構成、アナリティクス、認証、決済、画像圧縮、UI/UXに関する多岐にわたる情報を含んでいます。

```markdown
# phis-admin

---

# ディレクトリ構成

```

project-root/
├── frontend/
│   ├── .astro/                   \# Astroビルドキャッシュ（自動生成）
│   ├── .vscode/                  \# VSCode設定
│   ├── node\_modules/             \# フロントエンド依存パッケージ
│   ├── public/                   \# 静的ファイル
│   └── src/
│       ├── assets/               \# 画像・フォントなど
│       ├── components/           \# UIコンポーネント
│       ├── config/               \# 設定ファイル（多言語対応など）
│       ├── layouts/              \# レイアウトテンプレート
│       ├── pages/                \# ページ単位のAstroファイル
│       │   └── products.astro    \# 商品一覧・登録・編集UI
│       ├── styles/               \# CSS／Tailwindなどのスタイル定義
│       └── types/                \# 型定義（フロント用）
├── backend/
│   ├── **test**/\*\* \# 単体テスト関連
│   ├── api/                      \# アプリケーションロジック（API）
│   ├── auth/                     \# 認証関連 | 認証に関する処理をまとめたモジュール
│   ├── routes/                   \# ルーティング定義のみ
\#\# app.get(...), app.post(...)などのパスとハンドラの紐付け
\#\#（APIエンドポイント定義）
│   ├── controllers/              \# (任意) コントローラ層 | 処理ごとの責務を明確に分割したい場合
│   ├── models/                   \# DBアクセス層 | SQLやDBクエリ処理・データ操作（Cloudflare D1含む）
│   ├── services/                 \# 外部API・PayPal連携・内部処理など | 業務ロジックの中核
│   ├── utils/                    \# ユーティリティ | 汎用的な処理をまとめたモジュール

````

---

# npm 問題
tailwind: npm yarn経由のインストールだとtailwindが動かない為手動インストールしている
```
curl -L -o tailwindcss-4.1.11.zip https://github.com/tailwindlabs/tailwindcss/archive/refs/tags/v4.1.11.zip
unzip tailwindcss-4.1.11.zip
cp -r tailwindcss-4.1.11/packages/tailwindcss/* /path/to/your/project/node_modules/tailwindcss/
```

## 1. 概要

本システムは、複数のECサイトを横断的に管理し、ユーザーの購買活動を一元化するプラットフォームです。ユーザーが優先するECサイトを設定し、商品検索、注文自動化、メール管理、ポイント管理、売上管理などを統合的に提供します。また、代理購入を横断的にシステム機能として提供します。

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Frontend as Frontend(astro/react)
    participant Backend as Backend(nextjs)
    participant Puppeteer as Puppeteer
    participant EC_Site as ECサイト
    participant DB as Cloudflare D1
    participant Stripe as Stripe API

    User ->> Frontend: 購入依頼(商品URL, 数量, 希望価格)
    Frontend ->> Backend: 購入依頼APIリクエスト
    Backend ->> DB: 依頼内容を保存
    Backend ->> Puppeteer: 商品ページの取得依頼
    Puppeteer ->> EC_Site: 商品ページをスクレイピング
    EC_Site -->> Puppeteer: 商品情報を返却
    Puppeteer -->> Backend: 在庫/価格/配送可否を返却
    alt 購入可能な場合
        Backend ->> EC_Site: 認証処理（OAuth/ログイン）
        EC_Site -->> Backend: 認証成功
        Backend ->> EC_Site: 商品をカートに追加・購入手続き
        EC_Site -->> Backend: 注文成功（注文番号, 金額）
        Backend ->> Stripe: 決済処理
        Stripe -->> Backend: 決済成功
        Backend ->> DB: 注文内容を保存
        Backend ->> User: 購入成功通知
    else 購入不可の場合
        Backend ->> User: 購入不可通知
    end
````

## 2\. 機能一覧

| 機能 | 概要 |
|---|---|
| **商品検索** | 複数のECサイトを横断検索し、価格・在庫情報を取得 |
| **優先EC設定** | ユーザーが優先するECサイトを設定し、検索結果を最適化 |
| **注文自動化** | ECサイトのフォームをスクレイピングし、カート追加・注文入力を自動化 |
| **メール管理** | 各ECサイトの注文メールを一元管理（Gmail API） |
| **ポイント管理** | 各ECサイトのポイントを取得し、ユーザーに提供 |
| **売上管理** | 各ECサイトの売上情報を取得し、統合管理 |
| **API判定** | ECサイトのAPI提供の有無・有料/無料判定を実施 |
| **予約販売判定** | 商品が予約販売かどうかを判別し、データベースに記録 |
| **キャンペーン商品判定** | ユーザーが訪問した商品ページのみにバックグラウンドスクレイピングを実行 |
| **配送状況管理** | 配送情報を取得し、ECごとに記録 |
| **価格比較分析** | 複数販売店の価格をリアルタイムで比較し、最適価格を提示 |
| **レビューと評価管理** | 購入者のレビューを分析し、信頼性の高い情報を提供 |
| **ランキング機能** | 人気商品やトレンドをランキング化し、ユーザーに提案 |
| **商品スペック比較** | 複数商品の仕様や性能を直感的に比較可能にする |
| **外部カート購入** | 複数ECサイトの商品を一括でカートに追加し、購入を最適化 |
| **サービス比較（保険・通信・金融）** | 商品以外のサービス（保険、光回線、クレジットカード等）の比較 |

## 3\. システムアーキテクチャ

### 3.1 使用技術

| 項目 | 使用技術 |
|---|---|
| **フロントエンド** | React (Next.js) |
| **バックエンド** | Node.js (Express) |
| **スクレイピング** | Puppeteer |
| **データベース** | PostgreSQL / MongoDB |
| **認証** | OAuth2 / Firebase Auth |
| **メール管理** | Gmail API / Mailgun |
| **決済管理** | Stripe API |
| **検索エンジン** | Elasticsearch |
| **マップ連携** | Google Maps API |
| **クラウドホスティング** | Indigo Webarea |

## 4\. 詳細機能仕様

### 4.1 商品検索と価格比較

  - 複数のECサイト（楽天、Amazon、Yahoo\!ショッピングなど）を横断検索
  - スクレイピング & 公式APIの切り替え対応
  - 商品情報、価格、在庫、ポイント還元率を取得
  - Google Mapsとの連携による店舗情報の表示
  - 価格推移の可視化、購入タイミングの提案

### 4.2 注文自動化

  - フォーム入力の自動化（ログイン、カート追加、注文処理）
  - CAPTCHA対応（手動認証補助）
  - 注文履歴の管理と統合

### 4.3 ユーザーレビューと評価管理

  - 購入者のレビューを収集・分析
  - 信頼性の低いレビューをフィルタリング
  - AIによるレビューの要約と評価スコア算出

### 4.4 売上管理

  - 注文履歴をスクレイピング or APIで取得
  - 商品ごとの売上情報をデータベースに記録
  - 月別・年別の売上分析

### 4.5 配送状況管理

  - 配送状況を提供するECサイトを判定
  - 注文履歴ページから配送状況を取得
  - 配送データをデータベースに保存し、ユーザーに提供

## 5\. 収益化モデル

| モデル | 収益化手法 |
|---|---|
| **サブスクリプション課金** | プレミアム機能（月額 ¥980～） |
| **決済手数料** | Stripe決済時に1～5%の手数料を徴収 |
| **アフィリエイト収益** | Amazon、楽天、Yahoo\!ショッピング経由の手数料 |
| **スポンサー広告** | 優先ECサイトのプロモーション枠 |
| **企業向けAPI提供** | 商品検索API・売上管理APIの提供（¥10,000/月～） |

## 6\. まとめ

  - EC横断型の購入管理を実現
  - ポイント・売上・配送・注文情報を一元管理
  - スクレイピング & APIのハイブリッドアプローチで安定運用
  - 収益化モデルを多角的に展開し、ビジネス化を実現

-----

# 構成のポイント

1.  **フルスタックアーキテクチャ**
      * バックエンドはNode.js（Express）で構築し、スクレイピング（Puppeteer）やAPIデータ取得を実施。
      * フロントエンドはReact (Next.js) で構築し、TailwindCSSでデザインを適用。
      * データベースはmicroCMSを使用して、動的なコンテンツ管理を実現。
2.  **スクレイピング＆APIの自動判定**
      * Puppeteerを活用してECサイトの情報を取得。
      * 各ECサイトのAPIを判定し、利用可否をデータベースに格納。
3.  **一元管理機能**
      * ユーザーごとのGmailアカウントをAPIで管理し、ECサイトの会員登録を統一。
      * 購入履歴・ポイント・配送状況・キャンセル状況をダッシュボードで可視化。
4.  **レコメンド検索機能**
      * 優先したECサイトの商品を検索結果で優先的に表示。
      * Google Maps APIと連携し、リアル店舗の在庫状況を表示。

-----

# サーバー起動

```bash
npm run build && npm start
```

```
> phis-admin@1.0.0 build
> node esbuild.config.mjs

(node:45200) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time (Use `node --trace-warnings ...` to show where the warning was created)

> phis-admin@1.0.0 start
> node dist/src/d1Server.js
```

⚠️ **注意点（今後の対応）**

  * `ExperimentalWarning: Importing JSON modules...` は Node.js の仕様によるもので、動作に支障はありません。
  * 消したい場合は `NODE_NO_WARNINGS=1` を使うか、`.mjs` を `.cts` に変えて CJS へ移行する方法もあります（ただし非推奨）。

-----

# LISTEN確認

```bash
lsof -i -P -n | grep LISTEN
```

出力例:

```
node    12345 user   20u  IPv4 0x12345678      0t0  TCP *:3000 (LISTEN)
```

-----

# Git デプロイ

```mermaid
graph TD
  A[Git Repo: develop] -->|push| R[bare repo (hooks/post-receive)] --> D1[/var/www/phis-develop]
  B[Git Repo: staging] -->|push| R --> D2[/var/www/phis-staging]
  C[Git Repo: main] -->|push| R --> D3[/var/www/phis-production]
```

# システムデプロイ

```mermaid
graph TD
  GitRepo[Git 管理リポジトリ]
  DeployScript[deploy-config.sh]
  VPSSystemd[/etc/systemd/system/backend.service]
  VPSBin[/usr/local/bin/switch_maintenance.sh]

  GitRepo -->|変更検知| DeployScript
  DeployScript --> VPSSystemd
  DeployScript --> VPSBin
  DeployScript -->|再読み込み| Reload[systemctl daemon-reload + restart]
```

## ディレクトリ

```
config-repo/
├── systemd/
│   └── backend.service
├── scripts/
│   └── switch_maintenance.sh
├── deploy-config.sh ← 自動設置スクリプト
```

# Cloudflare D1

## 必要な商品管理テーブル項目

| 項目 | 説明 |
|---|---|
| **商品ID** \*必須 | 商品の一意識別子（ASINなど） |
| **ショップID** \*必須 | 商品が所属するECサイト |
| **商品名** \*必須 | 商品の名称 |
| **カテゴリ** \*必須 | JSON形式でカテゴリ情報を保持 |
| **商品価格** \*必須 | 商品の通常価格 |
| **現割引価格** | 割引後の価格 |
| **割引率** | 割引率（%） |
| **割引履歴** | JSON形式で割引履歴を保持 |
| **商品画像** | 商品の画像URL |
| **商品リンク** \*必須 | 商品ページのリンク |
| **アソシエイトリンク** | アフィリエイト用のリンク |
| **商品概要** | 商品の説明（段落形式） |
| **平均評価** | ユーザーの平均評価（星評価など） |
| **レビュー数** | レビューの総数 |
| **在庫状況** \*必須 | 商品の在庫情報（在庫あり/なしなど） |
| **配送情報** \*必須 | 配送に関する情報（配送日数・配送業者など） |
| **販売元** \*必須 | 商品の販売元情報 |
| **商品特長** | JSON形式で商品特長を管理 |
| **保証情報** | 保証に関する情報 |
| **可変スペック情報** | JSON形式で可変スペック情報を管理 |
| **獲得ポイント数** | 購入時に獲得できるポイント数 |
| **ポイント還元率** | ポイント還元率（%） |
| **ポイント有効期限** | 獲得ポイントの有効期限 |
| **ポイント獲得の条件** | ポイント獲得に関する条件 |
| **定期便** | 異なる定期おトク便の名称、配送条件、価格、日数、在庫状況、配送頻度を適切に管理 |
| **ブランド名** | 商品のブランド名 |
| **梱包サイズ** | 商品の梱包サイズ |
| **メーカー製造中止** | メーカーによる製造中止情報 |
| **商品タイプ** | 商品の種類（食品、家電、衣類など） |
| **カフェインの有無** | カフェイン含有の有無 |
| **メーカー名** | メーカーの名称 |
| **原産国** | 商品の原産国 |
| **商品の重量（kg）** | 商品の重量（kg単位） |
| **ストア売れ筋ランキング** | ストアでの売れ筋ランキング情報 |
| **ストア取扱開始日** | ストアでの取扱開始日 |

## スクレイピングデータモデル

### `sites` テーブル

| 項目 | 説明 | データ型 |
|---|---|---|
| `id` | サイト識別子 | `string` |
| `name` | ECサイト名 | `string` |
| `base_url` | 基本URL | `string` |
| `selectors` | スクレイピング用セレクタ情報 | `object` |
| `created_at` | 作成日時 | `datetime` |

### `scraped_products` テーブル

| 項目 | 説明 | データ型 |
|---|---|---|
| `id` | 一意の識別子 | `string` |
| `site_id` | `sites` テーブルのid | `string` (relation) |
| `product_url` | 商品ページURL | `string` |
| `scraped_data` | 取得データ（サイトごとの構造） | `object` |
| `last_scraped_at` | スクレイピング日時 | `datetime` |

### `japan_categories` テーブル（日本標準商品分類）

| フィールド | 説明 | データ型 |
|---|---|---|
| `id` | カテゴリID（JSICコード or JICFSコード） | `string` |
| `name` | カテゴリ名 | `string` |
| `parent_category` | 上位カテゴリ（親カテゴリID） | `string` (relation) |
| `level` | 階層レベル（大分類＝1, 中分類＝2, 小分類＝3） | `number` |
| `alternative_names` | 別名（ECサイトごとのカテゴリ名） | `array` |

-----

## 価格コム分析

### 商品カテゴリ別の比較機能

  * **目的**: ユーザーが特定の製品カテゴリ（家電、PC、スマートフォンなど）の中から商品を比較しやすくする。
  * **特徴**:
      * **カテゴリ分類**: 家電、IT関連商品、サービス（保険、旅行など）を細かく分類。カテゴリ間の階層が分かりやすく、目的の商品にたどり着きやすい設計。
      * **フィルター機能**: ブランド、価格帯、機能、性能、レビュー評価などで絞り込み可能。
  * **実現方法**:
      * **データベース構造**: 商品情報はカテゴリごとに分割されたテーブルに格納。
      * **検索機能**: Elasticsearchなどの検索エンジンを使用して高速検索を実現。

### 価格比較

  * **目的**: 複数の販売店の価格を一覧表示し、最安値を提示。
  * **特徴**:
      * **リアルタイム更新**: 各店舗からの価格データをAPIやスクレイピングで定期的に更新。
      * **価格推移グラフ**: 過去の価格履歴を可視化し、購入タイミングを判断しやすくする。
  * **実現方法**:
      * **価格データ取得**: 販売店との提携により、APIを通じて価格データを自動取得。
      * **価格更新の効率化**: 変更が頻繁な商品のみ更新し、全商品の更新負荷を軽減。

### レビューと評価

  * **目的**: 実際の購入者からのフィードバックを集約し、購入の参考にする。
  * **特徴**:
      * **レビューの質を管理**: 購入者のみレビュー可能、または評価に基づくレビューの信頼度ランキング。
      * **評価項目の細分化**: 性能、デザイン、使いやすさ、コストパフォーマンスなど多角的な視点。
  * **実現方法**:
      * **スパム対策**: 不正なレビューを検出するため、機械学習やモデレーションシステムを導入。
      * **レビューデータの活用**: レビュー内容を自然言語処理（NLP）で解析し、人気のトピックを可視化。

### ランキング機能

  * **目的**: 人気商品やトレンド商品を一覧化し、ユーザーに提案。
  * **特徴**:
      * **ランキングの多様性**: 売れ筋ランキング、レビュー評価ランキング、価格ランキング。
      * **パーソナライズ**: ユーザーの閲覧履歴や検索履歴に基づくランキングカスタマイズ。
  * **実現方法**:
      * **アルゴリズム**: ランキングは閲覧数、購入数、レビュー数などを基にスコアリングして算出。
      * **AI活用**: ユーザーの嗜好に応じたレコメンド。

### 商品のスペック比較

  * **目的**: 複数商品の仕様や性能を視覚的に比較。
  * **特徴**:
      * **スペック表**: 複数商品の性能を表形式で表示。
      * **視覚的な差別化**: 重要な違いをハイライト表示し、直感的に理解できる。
  * **実現方法**:
      * **データ管理**: JSONやスプレッドシート形式でスペックを一元管理。
      * **動的比較ツール**: Vue.jsやReactなどのフロントエンドフレームワークを活用して、ユーザーインタラクションを向上。

### 購入先リンク

  * **目的**: ユーザーが最適な販売店に直接アクセスできるようにする。
  * **特徴**:
      * **販売店情報の充実**: 価格以外に送料、在庫、ポイント還元情報を併記。
      * **アフィリエイト収益化**: 購入リンクにアフィリエイトコードを付与。
  * **実現方法**:
      * **アフィリエイトネットワーク**: 各販売店との提携による収益化。
      * **トラッキングツール**: Google Analyticsなどでクリック率や購買データを分析。

### 比較ツールのUI/UX

  * **目的**: 初心者でも簡単に使えるインターフェースを提供。
  * **特徴**:
      * **レスポンシブデザイン**: スマートフォンやタブレットにも最適化。
      * **シンプルで直感的なデザイン**: 比較ボタン、カート追加ボタンが目立つ位置に配置。
  * **実現方法**:
      * **フロントエンド技術**: React.jsやNext.jsで高性能なUIを構築。
      * **ユーザビリティテスト**: UI改善のために定期的にA/Bテストを実施。

### サービス比較（保険、通信、金融など）

  * **目的**: 商品だけでなく、サービス（保険、光回線、クレジットカードなど）を比較。
  * **特徴**:
      * **プラン別比較**: 月額料金、キャンペーン、利用可能地域などを比較。
      * **診断ツール**: ユーザーの入力情報に基づいて最適なプランを提案。
  * **実現方法**:
      * **動的フォーム**: リアルタイムで条件を変えられるインターフェース。
      * **バックエンド処理**: 複雑な料金体系をスクリプトで計算。

### ユーザーアカウント機能

  * **目的**: ユーザーの利便性を向上させるためのパーソナライズ。
  * **特徴**:
      * **お気に入り登録**: 気になる商品を保存。
      * **通知機能**: 価格変動やセール情報を通知。
  * **実現方法**:
      * **データベース設計**: 各ユーザーに関連付けたデータを効率的に管理。
      * **プッシュ通知**: FirebaseやSNS連携を活用。

### 比較の問題点

  * 商品毎の価格比較になっている
      * 可能であれば商品別に比較を行う
      * キャンペーン別に比較を行う
      * セール別に比較を行う

### 外部カート商品購入機能

  * **目的**: 外部の複数ECで買い物を行う
  * **特徴**:
      * 外部アカウントの登録
      * 指定商品を自動でカートに入れる
      * 購入後メールをまとめる
      * 住所などを自動入力
      * puppeteerを利用
      * SSOの利用
      * React + Authentication OpenIDConnect 認証

#### コマース関連用語

  * **マルチチャネルコマース (Multi-channel Commerce)**: 複数のチャネル（ECサイト、マーケットプレイス、SNSなど）を通じて商品を購入・販売する仕組み。
  * **クロスモールコマース (Cross-mall Commerce)**: 複数のECモール（例：Amazon、楽天、Yahoo\!ショッピングなど）をまたいで商品を購入できる仕組み。
  * **オムニチャネルコマース (Omnichannel Commerce)**: オンライン・オフラインを含むあらゆるチャネルで統合的に商品を購入・提供する仕組み。
  * **メタショッピング (Meta Shopping)**: 複数のECサイトを横断して価格や商品を比較し、購入を支援する仕組み。
  * **アグリゲートコマース (Aggregate Commerce)**: 異なるECプラットフォームの商品を1つのプラットフォームやサービスでまとめて購入可能にする仕組み。

-----

# API

## `pages/api/hello.js`

Next.js API route support: [https://nextjs.org/docs/api-routes/introduction](https://nextjs.org/docs/api-routes/introduction)

```javascript
export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
```

```bash
curl http://localhost:3000/api/hello
# {"name":"John Doe"}
```

-----

# ブランチルール

  * `backend_` や `frontend_` の接頭辞を使わず、階層的な命名をする
  * 長いブランチ名を避け、ディレクトリ構造と一致させる
  * ケバブケース（`-`）
  * 例: `backend-config-database`, `frontend-components-layout`

-----

# プレフィックスブランチ

  * **prefix**: 各機能や全体をまとめるブランチ(メインブランチ)

### `main` 本番環境

  * stagingのデプロイのみの本番環境

### `staging` ステージング環境

  * devのデプロイのみのステージング環境

### `dev` 開発環境

  * prefixをまとめた、開発環境用のブランチ

-----

# GitHub Actions

```yaml
tag.yml: release/ver⚪︎.⚪︎.⚪︎ # 自動タグ
```

-----

# バックエンド起動方法

### TypeScriptをビルド

```bash
npx tsc
```

-----

# D1起動方法

```bash
npx wrangler d1 create pup
npx wrangler d1 execute my-database --file=setup.sql
npx wrangler d1 list
npx wrangler dev
npx wrangler dev src/index.ts
npx wrangler dev --config wrangler.toml
```

## カラム情報の確認

```bash
npx wrangler d1 execute <DATABASE_NAME> \
  --local \
  --command "PRAGMA table_info('products')"

npx wrangler d1 execute products --local --command "PRAGMA table_info('products')"
```

## テーブルが作成されたか確認

```bash
npx wrangler d1 execute pup --command="SELECT name FROM sqlite_master WHERE type='table';"
```

## テーブルデータ確認

```bash
npx wrangler d1 execute pup --command="SELECT name FROM sqlite_master WHERE type='table';"
```

## リモートデータベース適用

```bash
npx wrangler d1 execute pup --file=setup.sql --remote
```

-----

# マルチアカウントデータベース

## 接続確認用

```bash
npx wrangler d1 execute PRODUCTS_DB \
  --local \
  --config src/d1-worker/products/wrangler-develop.toml \
  --env develop \
  --file ./sql/check.sql
```

## プロファイル本番環境

```bash
npx wrangler d1 execute PROFILE_DB \
  --local \
  --config src/d1-worker/profile/wrangler-production.toml \
  --env production \
  --file ./sql/init.sql
```

## `PROFILE_DB`

開発DB確認:

```bash
npx wrangler d1 execute PROFILE_DB --env=develop --local --config=src/d1-worker/profile/wrangler-develop.toml --command="SELECT name FROM sqlite_master WHERE type='table';"
```

```bash
npx wrangler d1 execute PROFILE_DB \
  --local \
  --file ./sql/user_profiles.sql \
  --config ./src/d1-worker/profile/wrangler-production.toml \
  --env production
```

```bash
npx wrangler d1 execute PROFILE_DB \
  --remote \
  --file ./sql/user_profiles.sql \
  --config ./src/d1-worker/profile/wrangler-production.toml \
  --env production
```

## マイグレーション

```bash
npx wrangler d1 migrations create <DATABASE_NAME> <MIGRATION_NAME>
npx wrangler d1 migrations create PROFILE_DB create_profile_table \
  --config ./src/d1-worker/profile/wrangler-production.toml \
  --env production
```

## `PRODUCT_DB`

開発DB確認:

```bash
cd backend
npx wrangler d1 execute PRODUCTS_DB --env=develop --local --config=src/d1-worker/products/wrangler-develop.toml --command="SELECT name FROM sqlite_master WHERE type='table';"
```

SQL実行:

```bash
npx wrangler d1 execute PRODUCTS_DB \
  --local \
  --config=src/d1-worker/products/wrangler-develop.toml \
  --env=develop \
  --file ./sql/products.sql
```

テーブル確認:

```bash
npx wrangler d1 execute PRODUCTS_DB \
  --local \
  --config=src/d1-worker/products/wrangler-develop.toml \
  --env=develop \
  --command "PRAGMA table_info(products);"
```

カラム更新:

```bash
npx wrangler d1 execute PRODUCTS_DB \
  --local  \
  --env=develop \
  --config=src/d1-worker/products/wrangler-develop.toml \
  --command "ALTER TABLE products ADD COLUMN own BOOLEAN DEFAULT 0;"
```

カラム削除:
直接カラムを削除する `ALTER TABLE ... DROP COLUMN` はサポートされていません。代替手順として新しいテーブルを作成してデータを移行する。

```bash
npx wrangler d1 execute PRODUCTS_DB \
  --local \
  --env=develop \
  --config=src/d1-worker/products/wrangler-develop.toml \
  --file ./sql/remove_own_column.sql
```

## CURL POST 追加

```bash
curl -X POST http://localhost:3002/api/contents \
     -H "Content-Type: application/json" \
     -d '{"title":"新規データ","body":"これはテストデータです","visible":true}'
```

## 削除手順

### データベース全体の削除

※ wrangler からデータベースを削除するコマンドは提供されていません

1.  Cloudflare Dashboard にログイン
2.  Workers & Pages → D1 を開く
3.  `pup` データベースを選択
4.  Delete Database (データベースを削除) をクリック
5.  確認プロンプトに `pup` を入力し削除

### 特定のテーブルを削除する

```bash
wrangler d1 execute pup --command="DROP TABLE contents;"
```

### テーブル内のデータのみ削除（初期化）

※ `id` の AUTOINCREMENT はリセットされない。

```bash
wrangler d1 execute pup --command="DELETE FROM contents;"
```

### `TRUNCATE` の代替（完全初期化）

```bash
wrangler d1 execute pup --command="DELETE FROM contents; VACUUM;"
```

### ローカルデータベースの削除

```bash
rm -rf .wrangler/state/v3/d1
```

# 本番 `curl`

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZmVhNDUzOTA0MDJiODQxMGQ0ZTc5NGQ3MjRlMWUyYyIsImlhdCI6MTc1MTE0NTU1NiwiZXhwIjoxNzUxMTg4NzU2fQ.odQKu2HsaI6jiydSpPtH_fw5NgC6IH-Ho-UbYjYFtrs" [https://searchlogs.phis.workers.dev/searchlogs/popular](https://searchlogs.phis.workers.dev/searchlogs/popular)
```

# トークン作成

```bash
# シークレット作成
openssl rand -hex 32

# アカウントIDを指定して実行
npx tsx generate-jwt.ts account1
```

-----

# メンテナンス

```mermaid
flowchart TD
  Deploy[deploy-config.sh] -->|指定時刻を登録| Schedule[cron or systemd-timer]
  Schedule -->|時刻到達| StartScript[switch_maintenance.sh start_maintenance]
  Schedule -->|時刻到達| StopScript[switch_maintenance.sh stop_maintenance]
```

## 使用方法

```bash
bash ./deploy-config.sh 21:00 22:00
```

## 指定時刻にメンテナンスモードを自動的に起動・解除

Git のブランチへの Push or Merge（例: `maintenance/start-21-00_end-22-00`）をトリガー

```mermaid
flowchart TD
    Developer[GitHub: 特定ブランチにPush/Merge]
    Webhook[GitHub Webhook]
    VPS[Webhook受信API (VPS)]
    CronGen[メンテ時間を抽出 & cron登録]
    ExecMaint[/usr/local/bin/switch_maintenance.sh 実行]

    Developer --> Webhook
    Webhook --> VPS
    VPS --> CronGen
    CronGen --> ExecMaint
```

### 実行方法

```bash
git checkout -b maintenance/start-21-00_end-22-00
git push origin maintenance/start-21-00_end-22-00
```

### GitHub Webhook を設定

GitHubリポジトリの Settings → Webhooks に以下を設定：

  - Payload URL: `https://your-vps-domain/api/webhook/maintenance`
  - Content-Type: `application/json`
  - Events: `push`

-----

# Cloudflare D1にJSONデータを送信するAPI

```mermaid
sequenceDiagram
    participant Client as クライアント（拡張機能等）
    participant NextAPI as Next.js API
    participant cloudflare D1 as cloudflare D1

    Client->>NextAPI: JSONデータを送信 (POST /api/upload-json)
    NextAPI->>cloudflare D1: cloudflare D1にデータを保存
    cloudflare D1->>NextAPI: 保存結果を返す
    NextAPI->>Client: 保存完了メッセージを返す
```

# D1にJSONデータを送信するAPI (再掲)

```mermaid
sequenceDiagram
    participant Client as クライアント（拡張機能等）
    participant NextAPI as Next.js API
    participant d1 as d1

    Client->>NextAPI: JSONデータを送信 (POST /api/upload-json)
    NextAPI->>d1: d1にデータを保存
    d1->>NextAPI: 保存結果を返す
    NextAPI->>Client: 保存完了メッセージを返す
```

-----

# 30日ごとの認可コード再取得

```mermaid
graph TD
    A[起動時にトークン確認] --> B{期限切れか？}
    B -- Yes --> C[Puppeteerで再取得]
    B -- No --> D[既存トークン使用]
    C --> E[DBに新トークン保存]
    E --> D
```

### APIルート

```mermaid
graph TD
    A[Client fetches token] --> B[/api/token GET/]
    A2[Client saves token] --> C[/api/token POST/]
    A3[Client updates token] --> D[/api/token PUT/]
    A4[Client deletes token] --> E[/api/token DELETE/]
    B --> F[Cloudflare D1 SELECT]
    C --> G[Cloudflare D1 INSERT]
    D --> H[Cloudflare D1 UPDATE]
    E --> I[Cloudflare D1 DELETE]
```

-----

# メール確認コードを自動取得・入力する流れ

```mermaid
graph TD
  A[Puppeteerでログイン試行] --> B[BASEから確認コードがメール送信される]
  B --> C[メール受信サーバで確認コードを取得-GmailApi]
  C --> D[Puppeteerでコード入力欄に自動入力]
  D --> E[ログイン・認可完了]
```

### 設計

```mermaid
graph TD
  A[Puppeteer or Frontend] -->|fetch| B[d1Client.ts]
  B -->|呼び出し| C[Hono API Routes : d1Server.ts]
  C -->|D1操作| D[Cloudflare D1]
```

  - `d1Server.ts`: D1のAPIエンドポイント定義 (`GET /token`, `POST /token` etc)
  - `d1Client.ts`: `fetch` を抽象化して API 経由でデータ操作する（再利用性高）
  - `scrape.ts`（Puppeteer等）やフロントエンドから `d1Client.ts` を呼び出す

-----

### テスト

```
project-root/
├── backend/
│   ├── __test__/**
```

```bash
npm run test
npm run test __test__/products.ts
```

```mermaid
graph TD
  A[テストの目的] --> B[Gmail API連携]
  A --> C[認証コード抽出]
  A --> D[Puppeteer操作]
  A --> E[BASE認可コードの取得]
  A --> F[トークン保存]

  B --> B1[Gmailから正しくメール取得できる]
  C --> C1[本文から6桁コードを抽出できる]
  D --> D1[メール・パス・コードが自動入力される]
  E --> E1[URLから?code=...を取得できる]
  F --> F1[D1にトークンが保存・更新される]
```

#### BASE認可コード自動取得処理のテスト手順

1.  `.env` が正しいことを確認（GmailとBASE）
2.  `fetchVerificationCode()` 単体で認証コードを取得
3.  `scrapeBaseAuth()` を実行し、自動ログイン＋認証＋トークン取得を検証
4.  Cloudflare D1 のトークン保存が `/api/token` で確認できること
5.  エラー時は Puppeteer の操作対象セレクタ・Gmailのメール件名などを見直す

-----

# スクレイピングした画像を BASEに登録し、画像をCDNとして再利用する。

  - puppeteer: ECショップから画像取得
  - backend: BASE API 経由で画像登録
  - BASE: 画像ホスティング (CDN的に利用)

<!-- end list -->

```mermaid
flowchart TD
  A[スクレイピング対象ECショップ] --> B[puppeteerで画像を取得]
  B --> C[画像を一時保存]
  C --> D[BASE APIで画像をアップロード]
  D --> E[BASE側で画像URL発行]
  E --> F[Cloudflare D1にURL保存]
  F --> G[フロントでCDN画像URLとして再利用]
```

-----

# タオバオの国際送料計算機

```
project-root/
├── backend/
│   ├── controllers/
│   │   └── shippingController.js
│   ├── services/
│   │   ├── taobaoApiService.js
│   │   └── shippingCalculator.js
│   └── routes/
│       └── shippingRoutes.js
└── frontend/
    ├── components/
    │   └── ShippingCalculator.jsx
    └── pages/
        └── index.jsx
```

-----

# JAN CODE API

```mermaid
flowchart TD
  A[カメラ起動] --> B[バーコード検出API]
  B --> C{JANコード検出}
  C -- 検出成功 --> D[APIで商品情報取得]
  D --> E[商品情報表示]
  C -- 検出失敗 --> B
```

  - JANCODEをAPIで検索して商品情報を取得する機能を実装。

  - ブラウザからバーコードを読み取り、JANCODEを取得する機能を実装。

  - 使用技術：フロントエンドはReact（Astro）、バックエンドはNode.js、APIは無料の外部JAN検索API、バーコード検出には Barcode Detection API を利用。

  - JANコード検索API

      - `GET https://www.jancode.xyz/api/jan/{JANコード}`
      - レスポンス：商品名、メーカー、カテゴリなど

-----

# 商品存在チェック＋検索数更新

```mermaid
flowchart TD
  A[JANコード検索] --> B[商品情報取得]
  B --> C[BASE商品検索 (JAN一致)]
  C -- 既存あり --> D[description から検索回数抽出]
  D --> E[検索回数 +1 にしてPUT更新]
  C -- 新規 --> F[description に検索回数: 1回を含めて POST登録]
  E & F --> G[登録 or 更新完了]
```

# `getBaseCategory`

```mermaid
flowchart TD
  A[BASEカテゴリ一覧取得] --> B["親カテゴリ: JAN検索商品 を検索"]
  B --> C{同名の子カテゴリが存在？}
  C -- Yes --> D[子カテゴリIDを返却]
  C -- No --> E[BASE APIで子カテゴリを新規作成]
  E --> F[新規カテゴリIDを返却]
```

-----

# フロントエンド

## フロントエンド構成

```
project-root/
├── frontend/
│   ├── .astro/                    # Astroビルドキャッシュ（自動生成）
│   ├── .vscode/                   # VSCode設定
│   ├── node_modules/              # フロントエンド依存パッケージ
│   ├── public/                    # 静的ファイル
│   └── src/
│       ├── assets/               # 画像・フォントなど
│       ├── components/           # UIコンポーネント
│       ├── config/               # 設定ファイル（多言語対応など）
│       ├── layouts/              # レイアウトテンプレート
│       ├── pages/                # ページ単位のAstroファイル
│       │   └── products.astro    # 商品一覧・登録・編集UI
│       ├── styles/               # CSS／Tailwindなどのスタイル定義
│       └── types/                # 型定義（フロント用）
```

## 無限スクロール + `pushState`

```mermaid
sequenceDiagram
  User->>Browser: Scroll to bottom
  Browser->>Frontend: loadPage(page+1)
  Frontend->>history: pushState({page})
  User->>Browser: Click Back
  Browser->>Frontend: popstate → loadInitial
  Frontend->>API: fetch offset=(page-1)*30
```

### 戻る操作でスクロール位置＋一覧内容を復元

  - **履歴復元**: `popstate` 時にスクロール位置とアイテムリストを完全復元
  - **技術**: `history.pushState(state)` に `items + scrollY` を含めて保存
  - **スクロール**: `window.scrollTo(0, scrollY)` で自動復元

<!-- end list -->

```mermaid
sequenceDiagram
  User->>Browser: scrolls & loads page 2
  Frontend->>History: pushState({ page: 2, items: [...], scrollY: 1800 })
  User->>Browser: clicks back
  Browser->>Frontend: popstate
  Frontend->>DOM: restore items
  Frontend->>Window: scrollTo(scrollY)
```

### ダイレクトアクセス時の対象位置スクロール＋優先読み込み対応

  - `/page/3` 直アクセス時: ページ3のみを最初に読み込む（1〜2ページは後回し）
  - スクロール: ページ3の先頭位置へ（レンダリング後に）スムーズにスクロール
  - 技術構成: `window.scrollTo` + `await loadPage(p)` + レンダリング完了検知
      - `loadPage(3)` → `scrollTo(item_60)` → 後続で`loadPage(1)`, `(2)`, ...

<!-- end list -->

```mermaid
sequenceDiagram
  User->>Browser: /page/3 にアクセス
  Frontend->>API: loadPage(1), loadPage(2), loadPage(3)
  Frontend->>DOM: render items
  Frontend->>Window: scrollTo(N件目位置)
```

### 対象ページのみを優先して先に読み込む

```mermaid
sequenceDiagram
  User->>Browser: アクセス /page/3
  Frontend->>API: fetch page 3 only
  Frontend->>DOM: render items (page 3)
  Frontend->>Window: scrollTo(top of page 3)
  Frontend-->>API: async fetch page 1, 2
```

### SSR & SPA統合構成

```mermaid
graph TD
  route1[/page/3 (SSR)] -->|最初のHTML描画| astro[Astro Server]
  astro -->|fetch pins| api[/api/pins]
  astro --> html[生成済みHTML]

  html -->|Hydration| SPA[Client-side React + PinGrid]
  SPA -->|scroll| more[/api/pins?offset=...]
```

### SSR Meta / OGP, 詳細導線, 中央スクロール

  - **SSR Meta / OGP**: `<meta>` や OGPタグ、JSON-LDを `page/[page].astro` に埋め込み
  - **詳細導線**: `/products/[id]` 詳細ページへリンクまたは遷移
  - **中央スクロール**: 優先アイテムが画面中央に表示されるようにスクロール調整

<!-- end list -->

```mermaid
graph TD
  SSR[/page/[page].astro] --> HTML[OGP + JSON-LD + title]
  HTML --> PinGrid
  PinGrid -->|click| ProductDetail
  ProductDetail -->|詳細| /products/[id]
  /page/[page] -->|scroll| scrollToCenter
```

-----

## アナリティクス

| 対象項目 | GA4 イベント名例 | トリガータイミング |
|---|---|---|
| 初期表示 | `page_view` | `/page/:id` 到達時 |
| スクロール読み | `scroll_page_load` | 次ページ読み込み成功後 |
| 商品クリック | `product_click` | ピン選択時 |
| 詳細表示 | `product_expand` | 詳細パネル展開ボタンを押したとき |

```mermaid
graph TD
  UI[無限スクロールUI] -->|scroll| track("scroll_page")
  UI -->|click| track("click_product")
  track --> /api/analytics
  /api/analytics --> analytics[(Cloudflare D1)]
```

## 検索コンポーネント

```mermaid
graph TD
  A[検索実行] --> B[検索ワードで商品DB検索]
  A --> C[検索語ログをD1に保存]
  B --> D[検索結果表示]
  D --> E[ユーザーが商品クリック]
  E --> F[検索語 + 商品IDをD1に保存]
  G[管理画面で人気ワード表示] --> H[search_logsから集計]
```

## 再設定リンク送信 API

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Frontend as フロントエンド
    participant Backend as バックエンド
    participant DB as データベース
    participant MailServer as メールサーバ

    User ->> Frontend: 再設定リクエスト（メールアドレス）
    Frontend ->> Backend: POST /auth/request-reset
    Backend ->> DB: リセットトークン生成・保存
    Backend ->> MailServer: リセットリンクを送信
    MailServer -->> User: リセットリンク受信
```

# 商品管理

商品管理ページ

```
project-root/
├── frontend/
│   └── pages/
│       └── products.astro         # 商品一覧・登録・編集UI
├── backend/
│   ├── api/
│   │   └── products/
│   │       ├── index.ts           # GET一覧 / POST新規
│   │       └── [id].ts            # PUT更新 / DELETE削除
│   ├── models/
│   │   └── productModel.ts        # D1クエリ操作
│   ├── types/
│   │   └── product.ts             # 型定義
│   └── utils/
│       └── d1.ts                  # D1接続ヘルパー
```

## 商品管理構成

```mermaid
flowchart TD
  UI[商品管理画面] -->|一覧取得| API1[/api/products GET/]
  UI -->|新規登録| API2[/api/products POST/]
  UI -->|更新| API3[/api/products/:id PUT/]
  UI -->|削除| API4[/api/products/:id DELETE/]
  API1 & API2 & API3 & API4 -->|D1接続| DB[(Cloudflare D1)]
```

```mermaid
graph TD
  route[routes/products.ts] -->|登録| api[api/products.ts]
  api -->|呼び出し| controller[controllers/productController.ts]
  controller --> model[models/productModel.ts]
```

## `ec_data` JSON構成

  - 価格差/priceDiff
  - 自動値下げフラグ/autoDiscount
  - カート追加数/cartCount
  - 売上件数/salesCount
  - ユーザー設定優先度/userPriority
  - カテゴリ優先度/categoryPriority

-----

# プロフィール

```mermaid
erDiagram
  user_profiles ||--o{ external_accounts : has

  user_profiles {
    TEXT user_id PK
    TEXT nickname
    TEXT bio
    TEXT avatar_url
    TEXT updated_at
  }

  external_accounts {
    TEXT id PK
    TEXT user_id FK
    TEXT provider
    TEXT external_user_id
    TEXT access_token
    TEXT refresh_token
    TEXT expires_at
    TEXT linked_at
  }
```

-----

# PayPal

## PayPal OAuthを用いた本人認証

```mermaid
flowchart TD
  A[ユーザーが認証ページにアクセス] --> B[PayPal認証リンクをクリック]
  B --> C[PayPalでOAuth認証]
  C --> D[code付きでリダイレクト]
  D --> E[access_token取得]
  E --> F[ユーザー情報取得]
  F --> G[DBでverified=trueに更新]
  G --> H[成功画面へリダイレクト]
```

```
project-root/
├── backend/
│   ├── auth/
│   │   └── paypal.ts
│   ├── routes/
│   │   ├── verify/
│   │   │   ├── status/
│   │   │   │   └── [userId].ts        # 認証状態取得
│   │   │   ├── expired/
│   │   │   │   └── [userId].ts        # 再認証が必要か
│   │   │   ├── start/
│   │   │   │   └── [userId].ts        # 認証開始（OAuth連携）
│   │   │   ├── paypal.ts
│   │   │   └── complete.ts            # 認証完了処理（PayPalコールバック）
│   ├── services/
│   │   └── oauthService.ts
│   ├── utils/
│   │   └── verifyHelper.ts
```

## PayPal OAuth 構成

```mermaid
flowchart TD
  A[ユーザーが電話番号変更を希望] --> B[PayPal OAuth によるログイン認証開始]
  B --> C{OAuth認証 成功？}
  C -- No --> D[変更不可：中断または失敗]
  C -- Yes --> E[PayPalから<br/>verified_account + 電話番号 取得]
  E --> F[認証情報を元に<br/>Cloudflare D1の電話番号を更新]
```

PayPal OAuthを用いた本人認証機能を以下の構成で実装：

  - フロントエンド：Astro、国際化対応 (`messageConfig.ts`)
  - バックエンド：TypeScript、OAuth連携・本人認証状態の更新
  - 認証完了後、「本人認証OK」のステータスに更新

## `[userId].ts`

```mermaid
sequenceDiagram
  participant Client
  participant RouteHandler ([userId].ts)
  participant Controller (verifyController.ts)
  participant AuthUtil (getAndAssertUserId)
  participant DB

  Client->>RouteHandler: GET /verify/[userId]
  RouteHandler->>Controller: handleGetVerifiedStatus(req, env)
  Controller->>AuthUtil: getAndAssertUserId(req, env)
  AuthUtil-->>Controller: userId
  Controller->>DB: getVerifiedStatus(userId)
  DB-->>Controller: { verified: true }
  Controller-->>RouteHandler: Response
  RouteHandler-->>Client: 200 OK
```

## Access Tokenを作成

### サンプルリクエスト

```bash
curl -v [https://api-m.sandbox.paypal.com/v1/oauth2/token](https://api-m.sandbox.paypal.com/v1/oauth2/token) \
-H "Accept: application/json" \
-H "Accept-Language: en_US" \
-u "<client_id>:<secret>" \
-d "grant_type=client_credentials"
```

### サンプルレスポンス

```json
{
    "access_token": "A21AAGk9mYWDNvy-OzYmU985kgwscf16by3R_97_RF-t90y_0TFTFQIhSndxdUcpfuY9dnMOpbwuNkmOZrsfnlmVSIPIOGraQ",
    "app_id": "APP-804485P543195W28T",
    "expires_in": 32400,
    "nonce": "2019-12-04T09:29:10Z01fPaJg9ztZoKhcsgIG1cjlWPxTy_HCiHPIDtPKvfDs",
    "scope": "[https://uri.paypal.com/services/invoicing](https://uri.paypal.com/services/invoicing) [https://uri.paypal.com/services/disputes/read-buyer](https://uri.paypal.com/services/disputes/read-buyer) [https://uri.paypal.com/services/payments/realtimepayment](https://uri.paypal.com/services/payments/realtimepayment) [https://uri.paypal.com/services/disputes/update-seller](https://uri.paypal.com/services/disputes/update-seller) [https://uri.paypal.com/services/payments/payment/authcapture](https://uri.paypal.com/services/payments/payment/authcapture) openid [https://uri.paypal.com/services/disputes/read-seller](https://uri.paypal.com/services/disputes/read-seller) [https://uri.paypal.com/services/payments/refund](https://uri.paypal.com/services/payments/refund) [https://api.paypal.com/v1/vault/credit-card](https://api.paypal.com/v1/vault/credit-card) [https://api.paypal.com/v1/payments/](https://api.paypal.com/v1/payments/).* [https://uri.paypal.com/payments/payouts](https://uri.paypal.com/payments/payouts) [https://api.paypal.com/v1/vault/credit-card/](https://api.paypal.com/v1/vault/credit-card/).* [https://uri.paypal.com/services/subscriptions](https://uri.paypal.com/services/subscriptions) [https://uri.paypal.com/services/applications/webhooks](https://uri.paypal.com/services/applications/webhooks)",
    "token_type": "Bearer"
}
```

# PayPal ログイン

```mermaid
sequenceDiagram
    participant PayPal
    participant Frontend (/callback.ts)
    participant Backend (/auth/paypal/callback)
    participant D1 (user_profiles など)

    PayPal ->> Frontend: ?code=xxx
    Frontend ->> Backend: POST /auth/paypal/callback (codeを送信)
    Backend ->> PayPal: codeからaccess_token取得
    Backend ->> PayPal: ユーザー情報取得（email, name）
    Backend ->> D1: user_profiles に保存 or ログイン
    Backend -->> Frontend: セッション or JWT 発行
    Frontend ->> Frontend: /mypage にリダイレクト
```

## Callback処理

```mermaid
sequenceDiagram
    participant PayPal
    participant Frontend(callback.ts)
    participant API(/auth/paypal/callback)
    participant Controller(paypalController.ts)
    participant D1(user_profiles)

    PayPal ->> Frontend: /callback?code=XXX
    Frontend ->> API: POST /auth/paypal/callback { code }
    API ->> Controller: handlePaypalCallback(code)
    Controller ->> PayPal: token exchange
    Controller ->> PayPal: get userinfo
    Controller ->> D1: upsert user_profiles
    Controller -->> API: login OK + JWT
    API -->> Frontend: 200 OK
    Frontend ->> Frontend: リダイレクト /mypage
```

-----

# PayPal Checkout を使った決済フロー

  - フロントエンド: Astro（カートUIとPayPalボタン表示）
  - バックエンド: TypeScript（サーバー側で注文生成と検証）
  - 決済プロバイダ: PayPal Smart Payment Buttons
  - 分離構成: `frontend/`, `backend/`

[Paypal Checkout](https://www.paypal.com/jp/brc/article/set-up-latest-paypal-checkout)

```
project-root/
├── frontend/
│   ├── src/middleware/cors.ts       ← CORS制御
│   ├── src/middleware/csrf.ts       ← CSRF検証
│   ├── src/pages/cart.astro         ← カートページ（PayPalボタン含む）
│   └── src/config/paypalConfig.ts   ← クライアントIDなど
├── backend/
│   ├── api/paypal/createOrder.ts    ← 注文作成
│   └── api/paypal/captureOrder.ts   ← 決済確定
```

```mermaid
sequenceDiagram
  participant User
  participant Frontend (Astro)
  participant Backend (TypeScript)
  participant PayPal API

  User->>Frontend (Astro): カートページ訪問
  Frontend (Astro)->>PayPal API: JS SDK 読み込み
  User->>Frontend (Astro): ボタン押下
  Frontend (Astro)->>Backend: POST /create-order
  Backend->>PayPal API: 注文作成
  PayPal API-->>Backend: orderID 発行
  Backend-->>Frontend (Astro): orderID 返却
  User->>Frontend (Astro): 購入承認
  Frontend (Astro)->>Backend: POST /capture-order
  Backend->>PayPal API: 決済確定
  PayPal API-->>Backend: ステータス返却
  Backend-->>Frontend: 完了ステータス返却
```

-----

# PDAPI (phis db api)

## CDN + API + SQL

```
vps-app/
├── public/
├── src/
│   ├── api/              # REST APIエンドポイント
│   ├── cache/            # CDN風キャッシュ処理（Redis等）
│   ├── db/               # SQLite操作ラッパー（D1風）
│   ├── pages/            # ページ（Next.js or Astro）
│   ├── utils/            # 共通ユーティリティ
├── scripts/              # バッチやCLIツール
├── config/               # 設定ファイル（DB・Redis）
├── .env
├── package.json
└── sqlite.db             # SQLite DBファイル
```

  - **CDN風キャッシュ**: Redis（`node-redis`） or Edge Cache風処理
  - **API処理**: Fastify / Express / Hono
  - **DB**: SQLite（`better-sqlite3` or `prisma`）
  - **DB高速化**: Indexed Redis or LRUキャッシュ
  - **セキュリティ**: APIキー + RateLimiter

-----

# 画像圧縮

SVG→PNG→WebPに変換して画像を最適化
`webp`: `png` -\> `WebP`
`inkspace`: `svg` -\> `png`

```mermaid
graph TD
  A[画像ファイルパス引数受取] --> B[拡張子判定]
  B -->|SVG| C[sharpでPNG/WebP変換 + コピー]
  B -->|PNG/JPG| D[sharpでWebP変換 + コピー]
  C & D --> E[./output に保存]
```

```bash
node --loader ts-node/esm scripts/imageConvert.mts '/Users/higemaru/phis-admin/frontend/static/assets/sale.png'
```

\*注意点
20250709時点ではassets/img では404になり、assets/ で200となる
言語リダイレクトによる影響と、nextのassets/imgの扱いによるバグかも

# ミドルウェアによる言語切り替え

`frontend` -\> `build`
`./lang/ npm run lang:start`
`http://localhost:3000`

言語をブラウザから自動取得して以下を変換
`/frontend/src/layouts/DefaultLayout.astro`
`<html lang="__PLACEHOLDER__" dir="ltr">`
↓
`<html lang="en" dir="ltr" data-astro-cid-qup72gqn="">`

-----

# スライドナビゲーション

```mermaid
sequenceDiagram
  participant User
  participant DOM
  participant App as SlideNavigator
  participant Hook as usePathStateWithDirection
  participant History

  User->>DOM: PushLink click → /page2
  DOM->>History: pushState("/page2")
  History->>Hook: popstate
  Hook->>App: direction = in → transform = translateX(0)

  User->>DOM: スワイプ右→左
  DOM->>History: history.back()
  History->>Hook: popstate
  Hook->>App: direction = out → transform = translateX(100%)
```

## ヘルプ表示

```mermaid
graph TD
  Load[ページロード]
  Check[window.innerWidth >= 768]
  Yes[PC] --> Show[← 戻るボタンを表示]
  No[スマホ] --> Hide[ヘルプ非表示]
  Click[← クリック] --> Back[history.back()]
```

### 表示フロー（初回のみ）

```mermaid
graph TD
  A[ページロード]
  B[PC判定] --> C{localStorage.slideHelpShown}
  C -- 未設定 --> D[showHelp = true, localStorageに記録]
  C -- 記録済み --> E[showHelp = false]
```

# 言語別HTMLキャッシュ × Cloudflare KV

```mermaid
flowchart TD
    subgraph Client
        BROWSER[ユーザー（ja/en...）]
    end
    subgraph Edge
        WORKER[Cloudflare Worker/Functions]
        KV[(Cloudflare KV<br>言語別HTML格納)]
    end
    subgraph Origin
        BUILD[SSG/ISRビルドサーバー]
    end

    BROWSER-->|リクエスト: /ja/xxx|WORKER
    WORKER-->|GET /ja/xxx|KV
    KV-->|ヒット: HTML返却|WORKER
    WORKER-->|HTML返却|BROWSER

    KV-->|ミス: fallback|WORKER
    WORKER-->|Origin fetch|BUILD
    BUILD-->|HTML生成→KV書込|KV
    BUILD-->|HTML返却|WORKER
    WORKER-->|HTML返却|BROWSER
```








---
記録

# ディレクトリ構成
```
project-root/
├── frontend/
│   ├── .astro/                   # Astroビルドキャッシュ（自動生成）
│   ├── .vscode/                  # VSCode設定
│   ├── node_modules/             # フロントエンド依存パッケージ
│   ├── public/                   # 静的ファイル
│   └── src/
│       ├── assets/               # 画像・フォントなど
│       ├── components/           # UIコンポーネント
│       ├── config/               # 設定ファイル（多言語対応など）
│       ├── layouts/              # レイアウトテンプレート
│       ├── pages/                # ページ単位のAstroファイル
│       │   └── products.astro    # 商品一覧・登録・編集UI
│       ├── styles/               # CSS／Tailwindなどのスタイル定義
│       └── types/                # 型定義（フロント用）
├── backend/
│   ├── __test__/**               # 単体テスト関連
│   ├── api/                      # アプリケーションロジック（API）
│   ├── auth/                     # 認証関連 | 認証に関する処理をまとめたモジュール
│   ├── routes/                   # ルーティング定義のみ
                                  ## app.get(...), app.post(...)などのパスとハンドラの紐付け
                                  ##（APIエンドポイント定義）
│   ├── controllers/              # (任意) コントローラ層 | 処理ごとの責務を明確に分割したい場合
│   ├── models/                   # DBアクセス層 | SQLやDBクエリ処理・データ操作（Cloudflare D1含む）
│   ├── services/                 # 外部API・PayPal連携・内部処理など | 業務ロジックの中核
│   ├── utils/                    # ユーティリティ | 汎用的な処理をまとめたモジュール
```

---

## **1. 概要**
本システムは、複数のECサイトを横断的に管理し、ユーザーの購買活動を一元化するプラットフォームです。
ユーザーが優先するECサイトを設定し、商品検索、注文自動化、メール管理、ポイント管理、売上管理などを統合的に提供します。
また、代理購入を横断的にシステム機能として提供。

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Frontend as Frontend(astro/react)
    participant Backend as Backend(nextjs)
    participant Puppeteer as Puppeteer
    participant EC_Site as ECサイト
    participant DB as Cloudflare D1
    participant Stripe as Stripe API

    User ->> Frontend: 購入依頼(商品URL, 数量, 希望価格)
    Frontend ->> Backend: 購入依頼APIリクエスト
    Backend ->> DB: 依頼内容を保存
    Backend ->> Puppeteer: 商品ページの取得依頼
    Puppeteer ->> EC_Site: 商品ページをスクレイピング
    EC_Site -->> Puppeteer: 商品情報を返却
    Puppeteer -->> Backend: 在庫/価格/配送可否を返却
    alt 購入可能な場合
        Backend ->> EC_Site: 認証処理（OAuth/ログイン）
        EC_Site -->> Backend: 認証成功
        Backend ->> EC_Site: 商品をカートに追加・購入手続き
        EC_Site -->> Backend: 注文成功（注文番号, 金額）
        Backend ->> Stripe: 決済処理
        Stripe -->> Backend: 決済成功
        Backend ->> DB: 注文内容を保存
        Backend ->> User: 購入成功通知
    else 購入不可の場合
        Backend ->> User: 購入不可通知
    end
``` 

## **2. 機能一覧**
| 機能 | 概要 |
|------|------|
| **商品検索** | 複数のECサイトを横断検索し、価格・在庫情報を取得 |
| **優先EC設定** | ユーザーが優先するECサイトを設定し、検索結果を最適化 |
| **注文自動化** | ECサイトのフォームをスクレイピングし、カート追加・注文入力を自動化 |
| **メール管理** | 各ECサイトの注文メールを一元管理（Gmail API） |
| **ポイント管理** | 各ECサイトのポイントを取得し、ユーザーに提供 |
| **売上管理** | 各ECサイトの売上情報を取得し、統合管理 |
| **API判定** | ECサイトのAPI提供の有無・有料/無料判定を実施 |
| **予約販売判定** | 商品が予約販売かどうかを判別し、データベースに記録 |
| **キャンペーン商品判定** | ユーザーが訪問した商品ページのみにバックグラウンドスクレイピングを実行 |
| **配送状況管理** | 配送情報を取得し、ECごとに記録 |
| **価格比較分析** | 複数販売店の価格をリアルタイムで比較し、最適価格を提示 |
| **レビューと評価管理** | 購入者のレビューを分析し、信頼性の高い情報を提供 |
| **ランキング機能** | 人気商品やトレンドをランキング化し、ユーザーに提案 |
| **商品スペック比較** | 複数商品の仕様や性能を直感的に比較可能にする |
| **外部カート購入** | 複数ECサイトの商品を一括でカートに追加し、購入を最適化 |
| **サービス比較（保険・通信・金融）** | 商品以外のサービス（保険、光回線、クレジットカード等）の比較 |

## **3. システムアーキテクチャ**
### **3.1 使用技術**
| 項目 | 使用技術 |
|------|------|
| **フロントエンド** | React (Next.js) |
| **バックエンド** | Node.js (Express) |
| **スクレイピング** | Puppeteer |
| **データベース** | PostgreSQL / MongoDB |
| **認証** | OAuth2 / Firebase Auth |
| **メール管理** | Gmail API / Mailgun |
| **決済管理** | Stripe API |
| **検索エンジン** | Elasticsearch |
| **マップ連携** | Google Maps API |
| **クラウドホスティング** | Indigo Webarea |

## **4. 詳細機能仕様**
### **4.1 商品検索と価格比較**
- **複数のECサイト（楽天、Amazon、Yahoo!ショッピングなど）を横断検索**
- **スクレイピング & 公式APIの切り替え対応**
- **商品情報、価格、在庫、ポイント還元率を取得**
- **Google Mapsとの連携による店舗情報の表示**
- **価格推移の可視化、購入タイミングの提案**

### **4.2 注文自動化**
- **フォーム入力の自動化（ログイン、カート追加、注文処理）**
- **CAPTCHA対応（手動認証補助）**
- **注文履歴の管理と統合**

### **4.3 ユーザーレビューと評価管理**
- **購入者のレビューを収集・分析**
- **信頼性の低いレビューをフィルタリング**
- **AIによるレビューの要約と評価スコア算出**

### **4.4 売上管理**
- **注文履歴をスクレイピング or APIで取得**
- **商品ごとの売上情報をデータベースに記録**
- **月別・年別の売上分析**

### **4.5 配送状況管理**
- **配送状況を提供するECサイトを判定**
- **注文履歴ページから配送状況を取得**
- **配送データをデータベースに保存し、ユーザーに提供**

## **5. 収益化モデル**
| モデル | 収益化手法 |
|------|------|
| **サブスクリプション課金** | プレミアム機能（月額 ¥980～） |
| **決済手数料** | Stripe決済時に1～5%の手数料を徴収 |
| **アフィリエイト収益** | Amazon、楽天、Yahoo!ショッピング経由の手数料 |
| **スポンサー広告** | 優先ECサイトのプロモーション枠 |
| **企業向けAPI提供** | 商品検索API・売上管理APIの提供（¥10,000/月～） |

## **6. まとめ**
- **EC横断型の購入管理を実現**
- **ポイント・売上・配送・注文情報を一元管理**
- **スクレイピング & APIのハイブリッドアプローチで安定運用**
- **収益化モデルを多角的に展開し、ビジネス化を実現**

---

# 構成
## 構成のポイント
	1. フルスタックアーキテクチャ
	  - バックエンドはNode.js（Express）で構築し、スクレイピング（Puppeteer）やAPIデータ取得を実施。
	  - フロントエンドはReact (Next.js) で構築し、TailwindCSSでデザインを適用。
	  - データベースはmicroCMSを使用して、動的なコンテンツ管理を実現。
	2. スクレイピング＆APIの自動判定
	  - Puppeteerを活用してECサイトの情報を取得。
	  - 各ECサイトのAPIを判定し、利用可否をデータベースに格納。
	3. 一元管理機能
	  - ユーザーごとのGmailアカウントをAPIで管理し、ECサイトの会員登録を統一。
	  - 購入履歴・ポイント・配送状況・キャンセル状況をダッシュボードで可視化。
	4. レコメンド検索機能
	  - 優先したECサイトの商品を検索結果で優先的に表示。
	  - Google Maps APIと連携し、リアル店舗の在庫状況を表示。

---

# server起動
```
npm run build && npm start
```

```
> phis-admin@1.0.0 build
> node esbuild.config.mjs

(node:45200) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time (Use `node --trace-warnings ...` to show where the warning was created)

> phis-admin@1.0.0 start
> node dist/src/d1Server.js
```

⚠️ 注意点（今後の対応）
	- ExperimentalWarning: Importing JSON modules... は Node.js の仕様によるもので、動作に支障はありません
	- 消したい場合は NODE_NO_WARNINGS=1 を使うか、
  - .mjs を .cts に変えて CJS へ移行する方法もあります（ただし非推奨）

---

# LISTEN確認
```
lsof -i -P -n | grep LISTEN
node    12345 user   20u  IPv4 0x12345678      0t0  TCP *:3000 (LISTEN)
```

---

# git デプロイ
```mermaid
graph TD
  A[Git Repo: develop] -->|push| R[bare repo (hooks/post-receive)] --> D1[/var/www/phis-develop]
  B[Git Repo: staging] -->|push| R --> D2[/var/www/phis-staging]
  C[Git Repo: main] -->|push| R --> D3[/var/www/phis-production]
```

# system deploy
```mermaid
graph TD
  GitRepo[Git 管理リポジトリ]
  DeployScript[deploy-config.sh]
  VPSSystemd[/etc/systemd/system/backend.service]
  VPSBin[/usr/local/bin/switch_maintenance.sh]

  GitRepo -->|変更検知| DeployScript
  DeployScript --> VPSSystemd
  DeployScript --> VPSBin
  DeployScript -->|再読み込み| Reload[systemctl daemon-reload + restart]
```

## directory
```
config-repo/
├── systemd/
│   └── backend.service
├── scripts/
│   └── switch_maintenance.sh
├── deploy-config.sh ← 自動設置スクリプト
```

# cloudflare d1

## 必要な商品管理テーブル項目

| 項目 | 説明 |
|------|------|
| **商品ID** *必須 | 商品の一意識別子（ASINなど） |
| **ショップID** *必須 | 商品が所属するECサイト |
| **商品名** *必須 | 商品の名称 |
| **カテゴリ** *必須 | JSON形式でカテゴリ情報を保持 |
| **商品価格** *必須 | 商品の通常価格 |
| **現割引価格** | 割引後の価格 |
| **割引率** | 割引率（%） |
| **割引履歴** | JSON形式で割引履歴を保持 |
| **商品画像** | 商品の画像URL |
| **商品リンク** *必須 | 商品ページのリンク |
| **アソシエイトリンク** | アフィリエイト用のリンク |
| **商品概要** | 商品の説明（段落形式） |
| **平均評価** | ユーザーの平均評価（星評価など） |
| **レビュー数** | レビューの総数 |
| **在庫状況** *必須 | 商品の在庫情報（在庫あり/なしなど） |
| **配送情報** *必須 | 配送に関する情報（配送日数・配送業者など） |
| **販売元** *必須 | 商品の販売元情報 |
| **商品特長** | JSON形式で商品特長を管理 |
| **保証情報** | 保証に関する情報 |
| **可変スペック情報** | JSON形式で可変スペック情報を管理 |
| **獲得ポイント数** | 購入時に獲得できるポイント数 |
| **ポイント還元率** | ポイント還元率（%） |
| **ポイント有効期限** | 獲得ポイントの有効期限 |
| **ポイント獲得の条件** | ポイント獲得に関する条件 |
| **定期便** | 異なる定期おトク便の名称、配送条件、価格、日数、在庫状況、配送頻度を適切に管理 |
| **ブランド名** | 商品のブランド名 |
| **梱包サイズ** | 商品の梱包サイズ |
| **メーカー製造中止** | メーカーによる製造中止情報 |
| **商品タイプ** | 商品の種類（食品、家電、衣類など） |
| **カフェインの有無** | カフェイン含有の有無 |
| **メーカー名** | メーカーの名称 |
| **原産国** | 商品の原産国 |
| **商品の重量（kg）** | 商品の重量（kg単位） |
| **ストア売れ筋ランキング** | ストアでの売れ筋ランキング情報 |
| **ストア取扱開始日** | ストアでの取扱開始日 |

スクレイピングデータモデル 
## sites テーブル
| 項目 | 説明 | データ型 |
|------|------|------|
| id | サイト識別子 | string
| name | ECサイト名 | string
| base_url | 基本URL | string
| selectors | スクレイピング用セレクタ情報 | object
| created_at | 作成日時 | datetime

## scraped_products
| 項目 | 説明 | データ型 |
|------|------|------|
| id | 一意の識別子 |	string |
| site_id |	sites テーブルのid |string (relation) |
| product_url |	商品ページURL	| string |
| scraped_data | 取得データ（サイトごとの構造）| object |
| last_scraped_at |	スクレイピング日時 | datetime |

## japan_categories テーブル（日本標準商品分類）
| フィールド | 説明　| データ型　|
|------|------|------|
| `id` | カテゴリID（JSICコード or JICFSコード） | `string` |
| `name` | カテゴリ名 | `string` |
| `parent_category` | 上位カテゴリ（親カテゴリID）| `string` (relation) |
| `level` | 階層レベル（大分類＝1, 中分類＝2, 小分類＝3） | `number` |
| `alternative_names` | 別名（ECサイトごとのカテゴリ名）| `array` |


---

## 価格コム分析
### 商品カテゴリ別の比較機能
#### 目的
ユーザーが特定の製品カテゴリ（家電、PC、スマートフォンなど）の中から商品を比較しやすくする。
#### 特徴
- カテゴリ分類
- 家電、IT関連商品、サービス（保険、旅行など）を細かく分類。
- カテゴリ間の階層が分かりやすく、目的の商品にたどり着きやすい設計。
- フィルター機能
ブランド、価格帯、機能、性能、レビュー評価などで絞り込み可能。
#### 実現方法
- データベース構造：商品情報はカテゴリごとに分割されたテーブルに格納。
- 検索機能：Elasticsearchなどの検索エンジンを使用して高速検索を実現。
### 価格比較
#### 目的
複数の販売店の価格を一覧表示し、最安値を提示。
#### 特徴
- リアルタイム更新
- 各店舗からの価格データをAPIやスクレイピングで定期的に更新。
- 価格推移グラフ
- 過去の価格履歴を可視化し、購入タイミングを判断しやすくする。
#### 実現方法
- 価格データ取得：販売店との提携により、APIを通じて価格データを自動取得。
- 価格更新の効率化：変更が頻繁な商品のみ更新し、全商品の更新負荷を軽減。
### レビューと評価
#### 目的
実際の購入者からのフィードバックを集約し、購入の参考にする。
#### 特徴
- レビューの質を管理
- 購入者のみレビュー可能、または評価に基づくレビューの信頼度ランキング。
- 評価項目の細分化
- 性能、デザイン、使いやすさ、コストパフォーマンスなど多角的な視点。
#### 実現方法
- スパム対策：不正なレビューを検出するため、機械学習やモデレーションシステムを導入。
- レビューデータの活用：レビュー内容を自然言語処理（NLP）で解析し、人気のトピックを可視化。
### ランキング機能
#### 目的
人気商品やトレンド商品を一覧化し、ユーザーに提案。
#### 特徴
- ランキングの多様性
- 売れ筋ランキング、レビュー評価ランキング、価格ランキング。
- パーソナライズ
- ユーザーの閲覧履歴や検索履歴に基づくランキングカスタマイズ。
#### 実現方法
- アルゴリズム：ランキングは閲覧数、購入数、レビュー数などを基にスコアリングして算出。
- AI活用：ユーザーの嗜好に応じたレコメンド。
### 商品のスペック比較
#### 目的
複数商品の仕様や性能を視覚的に比較。
#### 特徴
- スペック表
- 複数商品の性能を表形式で表示。
- 視覚的な差別化
- 重要な違いをハイライト表示し、直感的に理解できる。
#### 実現方法
- データ管理：JSONやスプレッドシート形式でスペックを一元管理。
- 動的比較ツール：Vue.jsやReactなどのフロントエンドフレームワークを活用して、ユーザーインタラクションを向上。
### 購入先リンク
#### 目的
ユーザーが最適な販売店に直接アクセスできるようにする。
#### 特徴
- 販売店情報の充実
- 価格以外に送料、在庫、ポイント還元情報を併記。
- アフィリエイト収益化
- 購入リンクにアフィリエイトコードを付与。
#### 実現方法
- アフィリエイトネットワーク：各販売店との提携による収益化。
- トラッキングツール：Google Analyticsなどでクリック率や購買データを分析。
### 比較ツールのUI/UX
#### 目的
初心者でも簡単に使えるインターフェースを提供。
#### 特徴
- レスポンシブデザイン
- スマートフォンやタブレットにも最適化。
- シンプルで直感的なデザイン
- 比較ボタン、カート追加ボタンが目立つ位置に配置。
#### 実現方法
- フロントエンド技術：React.jsやNext.jsで高性能なUIを構築。
- ユーザビリティテスト：UI改善のために定期的にA/Bテストを実施。
### サービス比較（保険、通信、金融など）
#### 目的
商品だけでなく、サービス（保険、光回線、クレジットカードなど）を比較。
#### 特徴
- プラン別比較
- 月額料金、キャンペーン、利用可能地域などを比較。
- 診断ツール
- ユーザーの入力情報に基づいて最適なプランを提案。
#### 実現方法
- 動的フォーム：リアルタイムで条件を変えられるインターフェース。
- バックエンド処理：複雑な料金体系をスクリプトで計算。
### ユーザーアカウント機能
#### 目的
- ユーザーの利便性を向上させるためのパーソナライズ。
#### 特徴
- お気に入り登録
- 気になる商品を保存。
- 通知機能
- 価格変動やセール情報を通知。
#### 実現方法
- データベース設計：各ユーザーに関連付けたデータを効率的に管理。
- プッシュ通知：FirebaseやSNS連携を活用。

### 比較の問題点
#### 商品毎の価格比較になっている
- 可能であれば商品別に比較を行う
- キャンペーン別に比較を行う
- セール別に比較を行う

### 外部カート商品購入機能
#### 目的
- 外部の複数ECで買い物を行う
#### 特徴
- 外部アカウントの登録
- 指定商品を自動でカートに入れる
- 購入後メールをまとめる
- 住所などを自動入力
- puppeteerを利用
- SSOの利用
- React + Authentication OpenIDConnect 認証

#### コマース
- マルチチャネルコマース (Multi-channel Commerce)
 複数のチャネル（ECサイト、マーケットプレイス、SNSなど）を通じて商品を購入・販売する仕組み。
- クロスモールコマース (Cross-mall Commerce)
 複数のECモール（例：Amazon、楽天、Yahoo!ショッピングなど）をまたいで商品を購入できる仕組み。
- オムニチャネルコマース (Omnichannel Commerce)
 オンライン・オフラインを含むあらゆるチャネルで統合的に商品を購入・提供する仕組み。
- メタショッピング (Meta Shopping)
 複数のECサイトを横断して価格や商品を比較し、購入を支援する仕組み。
- アグリゲートコマース (Aggregate Commerce)
 異なるECプラットフォームの商品を1つのプラットフォームやサービスでまとめて購入可能にする仕組み。

---

# api
## pages/api/hello.js
- Next.js API route support: [https://nextjs.org/docs/api-routes/introduction](https://nextjs.org/docs/api-routes/introduction)

``` js
export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
```

``` sh
curl http://localhost:3000/api/hello
{"name":"John Doe"}
```

---

# branches rule
  - backend_ や frontend_ の接頭辞を使わず、階層的な命名をする
  - 長いブランチ名を避け、ディレクトリ構造と一致させる
  - ケバブケース（-）
  - 例: backend-config-database, frontend-components-layout

---

# prefix branches
  - prefix | 各機能や全体をまとめるブランチ(メインブランチ)

  ## main 本番環境
    - stagingのデプロイのみの本番環境

  ## staging ステージング環境
    - devのデプロイのみのステージング環境

  ## dev 開発環境
    - prefixをまとめた、開発環境用のブランチ

---

# github actions
```
tag.yml: release/ver⚪︎.⚪︎.⚪︎ # 自動タグ
```

---

# backend起動方法
### typescriptをビルド
npx tsc

---

# D1起動方法
```
npx wrangler d1 create pup 
npx wrangler d1 execute my-database --file=setup.sql
npx wrangler d1 list 
npx wrangler dev
npx wrangler dev src/index.ts
npx wrangler dev --config wrangler.toml
```

## カラム情報の確認
```
npx wrangler d1 execute <DATABASE_NAME> \
  --local \
  --command "PRAGMA table_info('products')"

npx wrangler d1 execute products --local --command "PRAGMA table_info('products')"
```

## テーブルが作成されたか確認
```
npx wrangler d1 execute pup --command="SELECT name FROM sqlite_master WHERE type='table';"
```

## テーブルデータ確認
```
npx wrangler d1 execute pup --command="SELECT name FROM sqlite_master WHERE type='table';"
```

## リモートデータベース適用
```
npx wrangler d1 execute pup --file=setup.sql --remote
```

---

# マルチアカウントデータベース

## 接続確認用
```
npx wrangler d1 execute PRODUCTS_DB \
  --local \
  --config src/d1-worker/products/wrangler-develop.toml \
  --env develop \
  --file ./sql/check.sql
```

## プロファイル本番環境
```
npx wrangler d1 execute PROFILE_DB \
  --local \
  --config src/d1-worker/profile/wrangler-production.toml \
  --env production \
  --file ./sql/init.sql
```

## PROFILE_DB

develop DB 確認
```
npx wrangler d1 execute PROFILE_DB --env=develop --local --config=src/d1-worker/profile/wrangler-develop.toml --command="SELECT name FROM sqlite_master WHERE type='table';"
```

```
npx wrangler d1 execute PROFILE_DB \
  --local \
  --file ./sql/user_profiles.sql \
  --config ./src/d1-worker/profile/wrangler-production.toml \
  --env production
```

```
npx wrangler d1 execute PROFILE_DB \
  --remote \
  --file ./sql/user_profiles.sql \
  --config ./src/d1-worker/profile/wrangler-production.toml \
  --env production
```

## マイグレーション
```
npx wrangler d1 migrations create <DATABASE_NAME> <MIGRATION_NAME>
npx wrangler d1 migrations create PROFILE_DB create_profile_table \
  --config ./src/d1-worker/profile/wrangler-production.toml \
  --env production
```

## PRODUCT_DB
develop DB 確認
```
cd backend
npx wrangler d1 execute PRODUCTS_DB --env=develop --local --config=src/d1-worker/products/wrangler-develop.toml --command="SELECT name FROM sqlite_master WHERE type='table';"
```

SQL実行
```
npx wrangler d1 execute PRODUCTS_DB \
  --local \
  --config=src/d1-worker/products/wrangler-develop.toml \
  --env=develop \
  --file ./sql/products.sql
```

テーブル確認
```
npx wrangler d1 execute PRODUCTS_DB \
  --local \
  --config=src/d1-worker/products/wrangler-develop.toml \
  --env=develop \
  --command "PRAGMA table_info(products);"
```

カラム更新
```
npx wrangler d1 execute PRODUCTS_DB \
  --local  \
  --env=develop \
  --config=src/d1-worker/products/wrangler-develop.toml \
  --command "ALTER TABLE products ADD COLUMN own BOOLEAN DEFAULT 0;"
```

カラム削除
直接カラムを削除する ALTER TABLE ... DROP COLUMN はサポートされていません。
代替手順として 新しいテーブルを作成してデータを移行する
```
npx wrangler d1 execute PRODUCTS_DB \
  --local \
  --env=develop \
  --config=src/d1-worker/products/wrangler-develop.toml \
  --file ./sql/remove_own_column.sql
```

## CURL POST 追加
```
curl -X POST http://localhost:8787/api/contents \
     -H "Content-Type: application/json" \
     -d '{"title":"新規データ","body":"これはテストデータです","visible":true}'
```

## 削除手順
### データーベース全体の削除
※ wrangler からデータベースを削除するコマンドは提供されていない
	1.	Cloudflare Dashboard にログイン
	2.	Workers & Pages → D1 を開く
	3.	pup データベースを選択
	4.	Delete Database (データベースを削除) をクリック
	5.	確認プロンプトに pup を入力し削除

### 特定のテーブルを削除する
```
wrangler d1 execute pup --command="DROP TABLE contents;"
```

### テーブル内のデータのみ削除（初期化）
※ id の AUTOINCREMENT はリセットされない。
```
wrangler d1 execute pup --command="DELETE FROM contents;"
```

### TRUNCATE の代替（完全初期化）
```
wrangler d1 execute pup --command="DELETE FROM contents; VACUUM;"
```

### ローカルデータベースの削除
```
rm -rf .wrangler/state/v3/d1
```

# 本番 curl
```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZmVhNDUzOTA0MDJiODQxMGQ0ZTc5NGQ3MjRlMWUyYyIsImlhdCI6MTc1MTE0NTU1NiwiZXhwIjoxNzUxMTg4NzU2fQ.odQKu2HsaI6jiydSpPtH_fw5NgC6IH-Ho-UbYjYFtrs" https://searchlogs.phis.workers.dev/searchlogs/popular
```

# トークン作成
```
# シークレット作成
openssl rand -hex 32

# アカウントIDを指定して実行
npx tsx generate-jwt.ts account1
~~~

---

# Maintenance (メンテナンス)

```mermaid
flowchart TD
  Deploy[deploy-config.sh] -->|指定時刻を登録| Schedule[cron or systemd-timer]
  Schedule -->|時刻到達| StartScript[switch_maintenance.sh start_maintenance]
  Schedule -->|時刻到達| StopScript[switch_maintenance.sh stop_maintenance]
```

## 使用方法
```
bash ./deploy-config.sh 21:00 22:00
```

## 指定時刻にメンテナンスモードを自動的に起動・解除
- Git のブランチへの Push or Merge（例: maintenance/start-21-00_end-22-00）をトリガー

```mermaid
flowchart TD
    Developer[GitHub: 特定ブランチにPush/Merge]
    Webhook[GitHub Webhook]
    VPS[Webhook受信API (VPS)]
    CronGen[メンテ時間を抽出 & cron登録]
    ExecMaint[/usr/local/bin/switch_maintenance.sh 実行]

    Developer --> Webhook
    Webhook --> VPS
    VPS --> CronGen
    CronGen --> ExecMaint
```

### 実行方法
```
git checkout -b maintenance/start-21-00_end-22-00
git push origin maintenance/start-21-00_end-22-00
```

### GitHub Webhook を設定
GitHubリポジトリの Settings → Webhooks に以下を設定：
- Payload URL: https://your-vps-domain/api/webhook/maintenance
- Content-Type: application/json
- Events: push



---

# cloudflare D1にJSONデータを送信するAPI

```mermaid
sequenceDiagram
    participant Client as クライアント（拡張機能等）
    participant NextAPI as Next.js API
    participant cloudflare D1 as cloudflare D1

    Client->>NextAPI: JSONデータを送信 (POST /api/upload-json)
    NextAPI->>cloudflare D1: cloudflare D1にデータを保存
    cloudflare D1->>NextAPI: 保存結果を返す
    NextAPI->>Client: 保存完了メッセージを返す
```

# D1にJSONデータを送信するAPI

```mermaid
sequenceDiagram
    participant Client as クライアント（拡張機能等）
    participant NextAPI as Next.js API
    participant d1 as d1

    Client->>NextAPI: JSONデータを送信 (POST /api/upload-json)
    NextAPI->>d1: d1にデータを保存
    d1->>NextAPI: 保存結果を返す
    NextAPI->>Client: 保存完了メッセージを返す
```

---

# 30日ごとの認可コード再取得

```mermaid
graph TD
    A[起動時にトークン確認] --> B{期限切れか？}
    B -- Yes --> C[Puppeteerで再取得]
    B -- No --> D[既存トークン使用]
    C --> E[DBに新トークン保存]
    E --> D
```

### APIルート

```mermaid
graph TD
    A[Client fetches token] --> B[/api/token GET/]
    A2[Client saves token] --> C[/api/token POST/]
    A3[Client updates token] --> D[/api/token PUT/]
    A4[Client deletes token] --> E[/api/token DELETE/]
    B --> F[Cloudflare D1 SELECT]
    C --> G[Cloudflare D1 INSERT]
    D --> H[Cloudflare D1 UPDATE]
    E --> I[Cloudflare D1 DELETE]
```

---

# メール確認コードを自動取得・入力する流れ

```mermaid
graph TD
  A[Puppeteerでログイン試行] --> B[BASEから確認コードがメール送信される]
  B --> C[メール受信サーバで確認コードを取得-GmailApi]
  C --> D[Puppeteerでコード入力欄に自動入力]
  D --> E[ログイン・認可完了]
```

### 設計

```mermaid
graph TD
  A[Puppeteer or Frontend] -->|fetch| B[d1Client.ts]
  B -->|呼び出し| C[Hono API Routes : d1Server.ts]
  C -->|D1操作| D[Cloudflare D1]
```

- d1Server.ts: D1のAPIエンドポイント定義 (GET /token, POST /token etc)
- d1Client.ts: fetch を抽象化して API 経由でデータ操作する（再利用性高）
- scrape.ts（Puppeteer等）やフロントエンドから d1Client.ts を呼び出す

---

### テスト

```
project-root/
├── backend/
│   ├── __test__/**
```

```
npm run test
npm run test __test__/products.ts
```

```mermaid
graph TD
  A[テストの目的] --> B[Gmail API連携]
  A --> C[認証コード抽出]
  A --> D[Puppeteer操作]
  A --> E[BASE認可コードの取得]
  A --> F[トークン保存]

  B --> B1[Gmailから正しくメール取得できる]
  C --> C1[本文から6桁コードを抽出できる]
  D --> D1[メール・パス・コードが自動入力される]
  E --> E1[URLから?code=...を取得できる]
  F --> F1[D1にトークンが保存・更新される]
```

#### BASE認可コード自動取得処理のテスト手順

1. `.env` が正しいことを確認（GmailとBASE）
2. `fetchVerificationCode()` 単体で認証コードを取得
3. `scrapeBaseAuth()` を実行し、自動ログイン＋認証＋トークン取得を検証
4. Cloudflare D1 のトークン保存が `/api/token` で確認できること
5. エラー時は Puppeteer の操作対象セレクタ・Gmailのメール件名などを見直す

---

# スクレイピングした画像を BASEに登録し、画像をCDNとして再利用する。

- puppeteer: ECショップから画像取得
- backend: BASE API 経由で画像登録
- BASE: 画像ホスティング (CDN的に利用)

```mermaid
flowchart TD
  A[スクレイピング対象ECショップ] --> B[puppeteerで画像を取得]
  B --> C[画像を一時保存]
  C --> D[BASE APIで画像をアップロード]
  D --> E[BASE側で画像URL発行]
  E --> F[Cloudflare D1にURL保存]
  F --> G[フロントでCDN画像URLとして再利用]
```

---

# タオバオの国際送料計算機

```
project-root/
├── backend/
│   ├── controllers/
│   │   └── shippingController.js
│   ├── services/
│   │   ├── taobaoApiService.js
│   │   └── shippingCalculator.js
│   └── routes/
│       └── shippingRoutes.js
└── frontend/
    ├── components/
    │   └── ShippingCalculator.jsx
    └── pages/
        └── index.jsx
```

---

# JAN CODE API

```mermaid
flowchart TD
  A[カメラ起動] --> B[バーコード検出API]
  B --> C{JANコード検出}
  C -- 検出成功 --> D[APIで商品情報取得]
  D --> E[商品情報表示]
  C -- 検出失敗 --> B
```

- JANCODEをAPIで検索して商品情報を取得する機能を実装。
- ブラウザからバーコードを読み取り、JANCODEを取得する機能を実装。
- 使用技術：フロントエンドはReact（Astro）、バックエンドはNode.js、APIは無料の外部JAN検索API、バーコード検出には Barcode Detection API を利用。

- JANコード検索API
- GET https://www.jancode.xyz/api/jan/{JANコード}
- レスポンス：商品名、メーカー、カテゴリなど
  
---

# 商品存在チェック＋検索数更新

```mermaid
flowchart TD
  A[JANコード検索] --> B[商品情報取得]
  B --> C[BASE商品検索 (JAN一致)]
  C -- 既存あり --> D[description から検索回数抽出]
  D --> E[検索回数 +1 にしてPUT更新]
  C -- 新規 --> F[description に検索回数: 1回を含めて POST登録]
  E & F --> G[登録 or 更新完了]
```

# getBaseCategory

```mermaid
flowchart TD
  A[BASEカテゴリ一覧取得] --> B["親カテゴリ: JAN検索商品 を検索"]
  B --> C{同名の子カテゴリが存在？}
  C -- Yes --> D[子カテゴリIDを返却]
  C -- No --> E[BASE APIで子カテゴリを新規作成]
  E --> F[新規カテゴリIDを返却]
```

---

# frontend

## frontend構成

```
project-root/
├── frontend/
│   ├── .astro/                    # Astroビルドキャッシュ（自動生成）
│   ├── .vscode/                   # VSCode設定
│   ├── node_modules/              # フロントエンド依存パッケージ
│   ├── public/                    # 静的ファイル
│   └── src/
│       ├── assets/               # 画像・フォントなど
│       ├── components/           # UIコンポーネント
│       ├── config/               # 設定ファイル（多言語対応など）
│       ├── layouts/              # レイアウトテンプレート
│       ├── pages/                # ページ単位のAstroファイル
│       │   └── products.astro    # 商品一覧・登録・編集UI
│       ├── styles/               # CSS／Tailwindなどのスタイル定義
│       └── types/                # 型定義（フロント用）
```

## style build
```
npx tailwindcss -i ./src/styles/style.css -o ./public/style.css --minify
```

## 無限スクロール + pushState
```mermaid
sequenceDiagram
  User->>Browser: Scroll to bottom
  Browser->>Frontend: loadPage(page+1)
  Frontend->>history: pushState({page})
  User->>Browser: Click Back
  Browser->>Frontend: popstate → loadInitial
  Frontend->>API: fetch offset=(page-1)*30
```

### 戻る操作でスクロール位置＋一覧内容を復元
- 履歴復元: popstate 時にスクロール位置とアイテムリストを完全復元
- 技術: history.pushState(state) に items + scrollY を含めて保存
- スクロール: window.scrollTo(0, scrollY) で自動復元
```mermaid
sequenceDiagram
  User->>Browser: scrolls & loads page 2
  Frontend->>History: pushState({ page: 2, items: [...], scrollY: 1800 })
  User->>Browser: clicks back
  Browser->>Frontend: popstate
  Frontend->>DOM: restore items
  Frontend->>Window: scrollTo(scrollY)
```

### ダイレクトアクセス時の 対象位置スクロール＋優先読み込み 対応
- /page/3 直アクセス時: ページ3のみを最初に読み込む（1〜2ページは後回し）
- スクロール: ページ3の先頭位置へ（レンダリング後に）スムーズにスクロール
- 技術構成: window.scrollTo + await loadPage(p) + レンダリング完了検知
  - loadPage(3) → scrollTo(item_60) → 後続でloadPage(1), (2), ...
```mermaid
sequenceDiagram
  User->>Browser: /page/3 にアクセス
  Frontend->>API: loadPage(1), loadPage(2), loadPage(3)
  Frontend->>DOM: render items
  Frontend->>Window: scrollTo(N件目位置)
```
### 対象ページのみを優先して先に読み込む
```mermaid
sequenceDiagram
  User->>Browser: アクセス /page/3
  Frontend->>API: fetch page 3 only
  Frontend->>DOM: render items (page 3)
  Frontend->>Window: scrollTo(top of page 3)
  Frontend-->>API: async fetch page 1, 2
```

### SSR & SPA統合構成
```mermaid
graph TD
  route1[/page/3 (SSR)] -->|最初のHTML描画| astro[Astro Server]
  astro -->|fetch pins| api[/api/pins]
  astro --> html[生成済みHTML]

  html -->|Hydration| SPA[Client-side React + PinGrid]
  SPA -->|scroll| more[/api/pins?offset=...]
```

### SSR Meta / OGP, 詳細導線, 中央スクロール
- SSR Meta / OGP: <meta> や OGPタグ、JSON-LDを page/[page].astro に埋め込み
- 詳細導線: /products/[id] 詳細ページへリンクまたは遷移
- 中央スクロール: 優先アイテムが 画面中央に表示されるようにスクロール調整

```mermaid
graph TD
  SSR[/page/[page].astro] --> HTML[OGP + JSON-LD + title]
  HTML --> PinGrid
  PinGrid -->|click| ProductDetail
  ProductDetail -->|詳細| /products/[id]
  /page/[page] -->|scroll| scrollToCenter
```
---

## analytics
| 対象項目    | GA4 イベント名例         | トリガータイミング        |
| ------- | ------------------ | ---------------- |
| 初期表示    | `page_view`        | `/page/:id` 到達時  |
| スクロール読み | `scroll_page_load` | 次ページ読み込み成功後      |
| 商品クリック  | `product_click`    | ピン選択時            |
| 詳細表示    | `product_expand`   | 詳細パネル展開ボタンを押したとき |

```mermaid
graph TD
  UI[無限スクロールUI] -->|scroll| track("scroll_page")
  UI -->|click| track("click_product")
  track --> /api/analytics
  /api/analytics --> analytics[(Cloudflare D1)]
```

## Search component

```mermaid
graph TD
  A[検索実行] --> B[検索ワードで商品DB検索]
  A --> C[検索語ログをD1に保存]
  B --> D[検索結果表示]
  D --> E[ユーザーが商品クリック]
  E --> F[検索語 + 商品IDをD1に保存]
  G[管理画面で人気ワード表示] --> H[search_logsから集計]
```

## 再設定リンク送信　API

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Frontend as フロントエンド
    participant Backend as バックエンド
    participant DB as データベース
    participant MailServer as メールサーバ

    User ->> Frontend: 再設定リクエスト（メールアドレス）
    Frontend ->> Backend: POST /auth/request-reset
    Backend ->> DB: リセットトークン生成・保存
    Backend ->> MailServer: リセットリンクを送信
    MailServer -->> User: リセットリンク受信
```

# product
商品管理ページ

```
project-root/
├── frontend/
│   └── pages/
│       └── products.astro         # 商品一覧・登録・編集UI
├── backend/
│   ├── api/
│   │   └── products/
│   │       ├── index.ts           # GET一覧 / POST新規
│   │       └── [id].ts            # PUT更新 / DELETE削除
│   ├── models/
│   │   └── productModel.ts        # D1クエリ操作
│   ├── types/
│   │   └── product.ts             # 型定義
│   └── utils/
│       └── d1.ts                  # D1接続ヘルパー
```

## product 構成
```mermaid
flowchart TD
  UI[商品管理画面] -->|一覧取得| API1[/api/products GET/]
  UI -->|新規登録| API2[/api/products POST/]
  UI -->|更新| API3[/api/products/:id PUT/]
  UI -->|削除| API4[/api/products/:id DELETE/]
  API1 & API2 & API3 & API4 -->|D1接続| DB[(Cloudflare D1)]
```

```mermaid
graph TD
  route[routes/products.ts] -->|登録| api[api/products.ts]
  api -->|呼び出し| controller[controllers/productController.ts]
  controller --> model[models/productModel.ts]
```

## ec_data json構成
- 価格差/priceDiff
- 自動値下げフラグ/autoDiscount
- カート追加数/cartCount
- 売上件数/salesCount
- ユーザー設定優先度/userPriority
- カテゴリ優先度/categoryPriority

---

# profile

```mermaid
erDiagram
  user_profiles ||--o{ external_accounts : has

  user_profiles {
    TEXT user_id PK
    TEXT nickname
    TEXT bio
    TEXT avatar_url
    TEXT updated_at
  }

  external_accounts {
    TEXT id PK
    TEXT user_id FK
    TEXT provider
    TEXT external_user_id
    TEXT access_token
    TEXT refresh_token
    TEXT expires_at
    TEXT linked_at
  }
```

---

# PayPal

## PayPal OAuthを用いた本人認証

```mermaid
flowchart TD
  A[ユーザーが認証ページにアクセス] --> B[PayPal認証リンクをクリック]
  B --> C[PayPalでOAuth認証]
  C --> D[code付きでリダイレクト]
  D --> E[access_token取得]
  E --> F[ユーザー情報取得]
  F --> G[DBでverified=trueに更新]
  G --> H[成功画面へリダイレクト]
```

```
project-root/
├── backend/
│   ├── auth/
│   │   └── paypal.ts
│   ├── routes/
│   │   ├── verify/
│   │   │   ├── status/
│   │   │   │   └── [userId].ts        # 認証状態取得
│   │   │   ├── expired/
│   │   │   │   └── [userId].ts        # 再認証が必要か
│   │   │   ├── start/
│   │   │   │   └── [userId].ts        # 認証開始（OAuth連携）
│   │   │   ├── paypal.ts 
│   │   │   └── complete.ts            # 認証完了処理（PayPalコールバック）
│   ├── services/
│   │   └── oauthService.ts
│   ├── utils/
│   │   └── verifyHelper.ts
```
      
## paypal OAuth 構成

```mermaid
flowchart TD
  A[ユーザーが電話番号変更を希望] --> B[PayPal OAuth によるログイン認証開始]
  B --> C{OAuth認証 成功？}
  C -- No --> D[変更不可：中断または失敗]
  C -- Yes --> E[PayPalから<br/>verified_account + 電話番号 取得]
  E --> F[認証情報を元に<br/>Cloudflare D1の電話番号を更新]
```
PayPal OAuthを用いた本人認証機能を以下の構成で実装：
- フロントエンド：Astro、国際化対応 (messageConfig.ts)
- バックエンド：TypeScript、OAuth連携・本人認証状態の更新
- 認証完了後、「本人認証OK」のステータスに更新

## [userId].ts

```mermaid
sequenceDiagram
  participant Client
  participant RouteHandler ([userId].ts)
  participant Controller (verifyController.ts)
  participant AuthUtil (getAndAssertUserId)
  participant DB

  Client->>RouteHandler: GET /verify/[userId]
  RouteHandler->>Controller: handleGetVerifiedStatus(req, env)
  Controller->>AuthUtil: getAndAssertUserId(req, env)
  AuthUtil-->>Controller: userId
  Controller->>DB: getVerifiedStatus(userId)
  DB-->>Controller: { verified: true }
  Controller-->>RouteHandler: Response
  RouteHandler-->>Client: 200 OK
```

## Access Tokenを作成

### サンプルリクエスト
```
curl -v https://api-m.sandbox.paypal.com/v1/oauth2/token \
-H "Accept: application/json" \
-H "Accept-Language: en_US" \
-u "<client_id>:<secret>" \
-d "grant_type=client_credentials"
```

### サンプルレスポンス
```
{
    "access_token": "A21AAGk9mYWDNvy-OzYmU985kgwscf16by3R_97_RF-t90y_0TFTFQIhSndxdUcpfuY9dnMOpbwuNkmOZrsfnlmVSIPIOGraQ",
    "app_id": "APP-804485P543195W28T",
    "expires_in": 32400,
    "nonce": "2019-12-04T09:29:10Z01fPaJg9ztZoKhcsgIG1cjlWPxTy_HCiHPIDtPKvfDs",
    "scope": "https://uri.paypal.com/services/invoicing https://uri.paypal.com/services/disputes/read-buyer https://uri.paypal.com/services/payments/realtimepayment https://uri.paypal.com/services/disputes/update-seller https://uri.paypal.com/services/payments/payment/authcapture openid https://uri.paypal.com/services/disputes/read-seller https://uri.paypal.com/services/payments/refund https://api.paypal.com/v1/vault/credit-card https://api.paypal.com/v1/payments/.* https://uri.paypal.com/payments/payouts https://api.paypal.com/v1/vault/credit-card/.* https://uri.paypal.com/services/subscriptions https://uri.paypal.com/services/applications/webhooks",
    "token_type": "Bearer"
}
```

# Paypal ログイン
```mermaid
sequenceDiagram
    participant PayPal
    participant Frontend (/callback.ts)
    participant Backend (/auth/paypal/callback)
    participant D1 (user_profiles など)

    PayPal ->> Frontend: ?code=xxx
    Frontend ->> Backend: POST /auth/paypal/callback (codeを送信)
    Backend ->> PayPal: codeからaccess_token取得
    Backend ->> PayPal: ユーザー情報取得（email, name）
    Backend ->> D1: user_profiles に保存 or ログイン
    Backend -->> Frontend: セッション or JWT 発行
    Frontend ->> Frontend: /mypage にリダイレクト
```

## callback
```mermaid
sequenceDiagram
    participant PayPal
    participant Frontend(callback.ts)
    participant API(/auth/paypal/callback)
    participant Controller(paypalController.ts)
    participant D1(user_profiles)

    PayPal ->> Frontend: /callback?code=XXX
    Frontend ->> API: POST /auth/paypal/callback { code }
    API ->> Controller: handlePaypalCallback(code)
    Controller ->> PayPal: token exchange
    Controller ->> PayPal: get userinfo
    Controller ->> D1: upsert user_profiles
    Controller -->> API: login OK + JWT
    API -->> Frontend: 200 OK
    Frontend ->> Frontend: リダイレクト /mypage
```

---
# PayPal Checkout を使った決済フロー
  - フロントエンド: Astro（カートUIとPayPalボタン表示）
  - バックエンド: TypeScript（サーバー側で注文生成と検証）
  - 決済プロバイダ: PayPal Smart Payment Buttons
  - 分離構成: frontend/, backend/
(Paypal Checkout)[https://www.paypal.com/jp/brc/article/set-up-latest-paypal-checkout]

```
project-root/
├── frontend/
│   ├── src/middleware/cors.ts       ← CORS制御
│   ├── src/middleware/csrf.ts       ← CSRF検証
│   ├── src/pages/cart.astro         ← カートページ（PayPalボタン含む）
│   └── src/config/paypalConfig.ts   ← クライアントIDなど
├── backend/
│   ├── api/paypal/createOrder.ts    ← 注文作成
│   └── api/paypal/captureOrder.ts   ← 決済確定
```

```mermaid
sequenceDiagram
  participant User
  participant Frontend (Astro)
  participant Backend (TypeScript)
  participant PayPal API

  User->>Frontend (Astro): カートページ訪問
  Frontend (Astro)->>PayPal API: JS SDK 読み込み
  User->>Frontend (Astro): ボタン押下
  Frontend (Astro)->>Backend: POST /create-order
  Backend->>PayPal API: 注文作成
  PayPal API-->>Backend: orderID 発行
  Backend-->>Frontend (Astro): orderID 返却
  User->>Frontend (Astro): 購入承認
  Frontend (Astro)->>Backend: POST /capture-order
  Backend->>PayPal API: 決済確定
  PayPal API-->>Backend: ステータス返却
  Backend-->>Frontend: 完了ステータス返却
```

---

# PDAPI(phis db api)
## CDN + API + SQL
```
vps-app/
├── public/
├── src/
│   ├── api/              # REST APIエンドポイント
│   ├── cache/            # CDN風キャッシュ処理（Redis等）
│   ├── db/               # SQLite操作ラッパー（D1風）
│   ├── pages/            # ページ（Next.js or Astro）
│   ├── utils/            # 共通ユーティリティ
├── scripts/              # バッチやCLIツール
├── config/               # 設定ファイル（DB・Redis）
├── .env
├── package.json
└── sqlite.db             # SQLite DBファイル
```

- CDN風キャッシュ : Redis（node-redis） or Edge Cache風処理
- API処理 : Fastify / Express / Hono
- DB : SQLite（better-sqlite3 or prisma）
- DB高速化 : Indexed Redis or LRUキャッシュ
- セキュリティ : APIキー + RateLimiter

---

# 画像圧縮
SVG→PNG→WebPに変換して画像を最適化
webp : png -> Webp
inkspace: svg -> png

```mermaid
graph TD
  A[画像ファイルパス引数受取] --> B[拡張子判定]
  B -->|SVG| C[sharpでPNG/WebP変換 + コピー]
  B -->|PNG/JPG| D[sharpでWebP変換 + コピー]
  C & D --> E[./output に保存]
```

```
node --loader ts-node/esm scripts/imageConvert.mts '/Users/higemaru/phis-admin/frontend/static/assets/sale.png'
```
*注意点
20250709時点ではassets/img では404になり、assets/ で200となる
言語リダイレクトによる影響と、nextのassets/imgの扱いによるバグかも

# ミドルウェアによるlang切り替え
frontend -> build
./lang/ npm run lang:start
http://localhost:3000

langをブラウザから自動取得して以下を変換
/frontend/src/layouts/DefaultLayout.astro
<html lang="__PLACEHOLDER__" dir="ltr">
↓
<html lang="en" dir="ltr" data-astro-cid-qup72gqn="">

---

# スライドナビゲーション
```mermaid
sequenceDiagram
  participant User
  participant DOM
  participant App as SlideNavigator
  participant Hook as usePathStateWithDirection
  participant History

  User->>DOM: PushLink click → /page2
  DOM->>History: pushState("/page2")
  History->>Hook: popstate
  Hook->>App: direction = in → transform = translateX(0)

  User->>DOM: スワイプ右→左
  DOM->>History: history.back()
  History->>Hook: popstate
  Hook->>App: direction = out → transform = translateX(100%)
```

## ヘルプ表示
```mermaid
graph TD
  Load[ページロード]
  Check[window.innerWidth >= 768]
  Yes[PC] --> Show[← 戻るボタンを表示]
  No[スマホ] --> Hide[ヘルプ非表示]
  Click[← クリック] --> Back[history.back()]
```
### 表示フロー（初回のみ）
```mermaid
graph TD
  A[ページロード]
  B[PC判定] --> C{localStorage.slideHelpShown}
  C -- 未設定 --> D[showHelp = true, localStorageに記録]
  C -- 記録済み --> E[showHelp = false]
```

---

# 言語別HTMLキャッシュ × Cloudflare KV
```mermaid
flowchart TD
    subgraph Client
        BROWSER[ユーザー（ja/en...）]
    end
    subgraph Edge
        WORKER[Cloudflare Worker/Functions]
        KV[(Cloudflare KV<br>言語別HTML格納)]
    end
    subgraph Origin
        BUILD[SSG/ISRビルドサーバー]
    end

    BROWSER-->|リクエスト: /ja/xxx|WORKER
    WORKER-->|GET /ja/xxx|KV
    KV-->|ヒット: HTML返却|WORKER
    WORKER-->|HTML返却|BROWSER

    KV-->|ミス: fallback|WORKER
    WORKER-->|Origin fetch|BUILD
    BUILD-->|HTML生成→KV書込|KV
    BUILD-->|HTML返却|WORKER
    WORKER-->|HTML返却|BROWSER
```

---

# Redisによる一時キャッシュでリクエスト削減
```mermaid
graph TD
  FE[Frontend: 商品表示/クリック] --> API
  API -->|表示/クリックごと| Redis
  Timer[定期バッチ] --> Redis
  Timer -->|バルク保存| D1["Cloudflare D1: searchlogs"]
```

## Redis本体のインストール（macOS）
```
brew install redis
brew services start redis
```

## 起動確認:
```
redis-cli ping
```

---

# Amazonログイン
1. Amazon Developer Console 設定
2. OAuth認証処理の導入
3. バックエンド /auth/amazon & /auth/amazon/callback 実装
4. ユーザー情報の取得
5. フロントエンドログインボタン設置

## Amazon Developer Console 設定
1. https://developer.amazon.com/login にてログイン
2. 新規Security Profile作成
3. Web Settings に以下を登録：
```
Allowed Return URLs:
  http://localhost:3000/auth/amazon/callback
  https://phis.jp/auth/amazon/callback
```

## 認証フロー構成
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Amazon

    User->>Frontend: Amazon Loginボタン押下
    Frontend->>Backend: /auth/amazon にリダイレクト
    Backend->>Amazon: OAuth認証開始
    Amazon-->>User: 認証画面表示
    User->>Amazon: 認証許可
    Amazon->>Backend: /auth/amazon/callback (code付き)
    Backend->>Amazon: codeをtokenに交換
    Amazon-->>Backend: access_token, profile情報
    Backend-->>Frontend: セッション発行 or JWT発行
```

---

# Paypalにおける決済
PayPalに商品を事前登録する必要はありません。
代わりに、支払い作成（/v2/checkout/orders）時に 商品情報（名前・価格など）をリクエストボディに含める方式です。

## POST /v2/checkout/orders のリクエスト
```
POST /v2/checkout/orders
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

```mermaid
sequenceDiagram
  participant User
  participant Frontend
  participant Backend
  participant PayPal

  User->>Frontend: 商品購入クリック
  Frontend->>Backend: /api/paypal/create-order
  Backend->>PayPal: POST /v2/checkout/orders
  PayPal-->>Backend: approval_link, order_id
  Backend-->>Frontend: approval_link
  Frontend->>User: PayPal画面へ遷移
  User->>PayPal: 支払い承認
  PayPal-->>Frontend: return_urlにリダイレクト
  Frontend->>Backend: /api/paypal/capture-order?token=xxx
  Backend->>PayPal: POST /v2/checkout/orders/:id/capture
  PayPal-->>Backend: 決済成功情報
  Backend-->>Frontend: 完了表示
```

## 注意点
| 項目     | 内容                                   |
| ------ | ------------------------------------ |
| 商品登録   | 不要。API内 `purchase_units.items` に直接記述 |
| 価格     | `amount.value` に税込みで指定               |
| 商品複数   | `items[]` に配列で渡す（最大10件）              |
| 商品画像   | 表示できない（PayPal画面に画像を出すことは不可）          |
| ユーザー情報 | `application_context` で言語、戻り先URLなど設定 |

## 関連API
| API                               | 説明                 |
| --------------------------------- | ------------------ |
| `/v2/checkout/orders`             | 注文作成（Create Order） |
| `/v2/checkout/orders/:id/capture` | 支払い確定（Capture）     |
| `/v2/checkout/orders/:id`         | 注文情報取得             |
