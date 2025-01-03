
# S3 と Lambda を使った Vite React アプリの構築

このプロジェクトは、Vite で構築された React アプリケーションで、AWS Lambda 関数と統合してサーバーレスなバックエンド通信を実現します。

このアプリケーションは、API Gateway を通じて AWS Lambda 関数からデータを取得できるシンプルな React フロントエンドで構成されています。最新の Web アプリケーションとサーバーレスなクラウドインフラの統合を示します。

主な機能は以下の通りです：
- Vite を使用した高速開発およびビルドのための React ベースのフロントエンド
- バックエンド処理用の AWS Lambda 関数
- HTTP リクエスト処理用の API Gateway
- セキュアな通信のためのクロスオリジンリソース共有（CORS）の設定

## リポジトリ構成

```
.
├── lambda
│   ├── lambda_function.py
│   └── serverless.yaml
└── my-app
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── README.md
    ├── src
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    └── vite.config.js
```

### 主なファイル：
- `lambda/lambda_function.py`：AWS Lambda 関数のハンドラーを含む。
- `lambda/serverless.yaml`：AWS Lambda デプロイ用の Serverless Framework 設定。
- `my-app/src/App.jsx`：Lambda 関数とやり取りするメインの React コンポーネント。
- `my-app/src/main.jsx`：React アプリケーションのエントリーポイント。
- `my-app/package.json`：プロジェクトの依存関係とスクリプトを定義。
- `my-app/eslint.config.js`：コードリンティング用の ESLint 設定。
- `my-app/vite.config.js`：Vite ビルドツール設定。

## 使用方法

### インストール

事前条件：
- Node.js（バージョン 14 以上）
- npm（バージョン 6 以上）
- Python 3.12
- AWS CLI（適切な資格情報で設定済み）
- Serverless Framework

プロジェクトをセットアップするには：

1. リポジトリをクローン：
   ```
   git clone <repository-url>
   cd <repository-name>
   ```

2. React アプリの依存関係をインストール：
   ```
   cd my-app
   npm install
   ```

### 開始方法

ローカルで React アプリを実行するには：

1. `my-app` ディレクトリに移動：
   ```
   cd my-app
   ```

2. 開発サーバーを起動：
   ```
   npm run dev
   ```

3. ブラウザを開いて `http://localhost:5173` にアクセスし、アプリを表示します。

Lambda 関数をデプロイするには：

1. `lambda` ディレクトリに移動：
   ```
   cd lambda
   ```

2. Serverless Framework を使用してデプロイ：
   ```
   serverless deploy
   ```

### 設定

Lambda 関数の API エンドポイントは `my-app/src/App.jsx` に設定されています。独自の Lambda 関数をデプロイした場合は、`fetchData` 関数内の URL を更新してください：

```javascript
const response = await fetch('https://your-api-gateway-url.amazonaws.com/lambda');
```

### よくある使用例

1. Lambda からデータを取得：
   - React アプリの「Fetch Data」ボタンをクリック。
   - アプリが Lambda 関数にリクエストを送信し、レスポンスを表示します。

例：
```javascript
const fetchData = async () => {
  setMessage('データ取得中...');
  try {
    const response = await fetch('https://cz6tlba49h.execute-api.ap-northeast-1.amazonaws.com/lambda');
    const data = await response.json();
    setMessage(`レスポンス：${data.message}`);
  } catch (error) {
    setMessage('データ取得エラー。');
    console.error(error);
  }
};
```

### トラブルシューティング

1. CORS の問題：
   - 問題：CORS エラーのために Lambda からデータを取得できません。
   - 解決策：Lambda 関数の CORS 設定がフロントエンドのオリジンに一致していることを確認してください。
   - デバッグ：
     1. ブラウザのコンソールで具体的な CORS エラーメッセージを確認。
     2. `serverless.yaml` 内の `allowedOrigins` にフロントエンドの URL が含まれていることを確認。
     3. 変更後、Lambda 関数を再デプロイ。

2. Lambda 関数のエラー：
   - 問題：Lambda 関数がエラーを返す、または予期しないレスポンスを返す。
   - 解決策：AWS CloudWatch で Lambda 関数のログを確認。
   - デバッグ：
     1. AWS コンソールで CloudWatch > Log groups に移動。
     2. Lambda 関数のロググループ（通常 `/aws/lambda/your-function-name`）を探す。
     3. 最近のログストリームでエラーメッセージや予期しない動作を確認。

3. React アプリのビルド問題：
   - 問題：`npm run build` が失敗する、または予期しない出力を生成する。
   - 解決策：リンティングエラーを確認し、すべての依存関係がインストールされていることを確認。
   - デバッグ：
     1. `npm run lint` を実行してコードスタイルの問題を確認。
     2. `node_modules` フォルダーと `package-lock.json` を削除してから、`npm install` を再実行。
     3. コンソール出力を確認し、個別のエラーメッセージに対処。

## データフロー

アプリケーションは簡単なリクエスト-レスポンスフローに従います：

1. ユーザーが React フロントエンドで「Fetch Data」ボタンをクリック。
2. React アプリが API Gateway エンドポイントに HTTP GET リクエストを送信。
3. API Gateway がリクエストを AWS Lambda 関数に転送。
4. Lambda 関数がリクエストを処理し、レスポンスを返す。
5. レスポンスが API Gateway を通じて React アプリに戻る。
6. React アプリが受信したデータで状態を更新し、ユーザーに表示。

```
[User] -> [React App] -> [API Gateway] -> [Lambda Function]
                                                |
[User] <- [React App] <- [API Gateway] <- [Lambda Function]
```

注意：CORS を適切に設定し、フロントエンドとバックエンドの間でシームレスな通信を確保してください。

## インフラストラクチャ

このプロジェクトは、Serverless Framework を使用して AWS CloudFormation 経由でインフラストラクチャを定義および管理します。主なリソースは以下の通りです：

### Lambda:
- 関数：`lambda_api`
  - ハンドラー：`lambda_function.lambda_handler`
  - ランタイム：Python 3.12
  - タイムアウト：30秒

### API Gateway:
- CORS 設定を含む HTTP API
- エンドポイント：`/lambda`（GET メソッド）

### 環境変数：
- `PYTHONPATH`：Lambda 実行のために "/var/task/src:/opt/python" に設定

### カスタム設定：
- Python 要件のパッケージング
- ローカル開発用の Serverless Offline
