# EnglishLearningApp

英語を学ぶためのアプリケーション

## 概要

このアプリケーションは、英語学習をサポートするためのWebアプリケーションです。カテゴリー別に英語の単語やフレーズを管理し、画像や音声データと共に学習できる機能を提供します。

## 機能

- **カテゴリー登録機能**: 学習内容をカテゴリー別に整理
- **英語登録機能**: カテゴリーとの紐づけ、画像および音声データも登録可能
- **学習コンテンツ表示**: 登録された英語の画像や音声データ、意味をカテゴリーごとに確認可能
- **ログイン履歴表示機能**: ログイン履歴を可視化し、学習意欲の向上に

## スクリーンショット

### カテゴリー登録画面
<img width="932" alt="カテゴリー登録画面" src="https://github.com/user-attachments/assets/c7cb7fc9-93e9-4336-8989-92c8c47b5a11" />

### 英語登録画面
<img width="905" alt="英語登録画面" src="https://github.com/user-attachments/assets/2246b4d3-de04-41c8-962c-8824d6445d3c" />

### 英語表示画面
<img width="830" alt="英語表示画面" src="https://github.com/user-attachments/assets/c9788816-f69e-44ff-a180-56b805b1e5ea" />

### ログイン履歴画面
<img width="649" height="439" alt="Image" src="https://github.com/user-attachments/assets/031f8003-7e7e-466c-8a4d-9992d5d4771c" />

## 技術スタック

| 項目 | バージョン |
|------|------------|
| Node.js | 22.17.0 |
| React | 19.1.0 |
| TypeScript | 5.8.3 |
| Vite | 7.0.0 |
| Java | 17 |
| Spring Boot | 3.4.7 |
| MySQL | 8.0 |

## 環境構築

### 前提条件

- Dockerが利用可能であること

### セットアップ手順

1. **VITE_API_BASE_URLの値を自身のPCであるIPアドレスに変更**  
/frontend/.env.developmentファイル内「VITE_API_BASE_URL」の値をPCのIPアドレスに変更

2. **Dockerコンテナのビルドと起動**
   ```bash
   docker-compose up --build -d
   ```

3. **動作確認**
   - フロントエンド: http://localhost:5173
   - バックエンドAPI: http://localhost:5173/api/categories

## 開発・運用コマンド

### コンテナ管理

```bash
# コンテナ削除
docker-compose down -v

# キャッシュ、イメージ、コンテナ削除
docker-compose down --volumes --rmi all

# ビルドキャッシュの削除
docker builder prune -a -f
```

### ログ監視

```bash
# フロントエンドコンテナログ監視
docker-compose logs -f frontend

# バックエンドコンテナログ監視
docker-compose logs -f backend
```

### コンテナ内での操作

```bash
# フロントエンドコンテナに入る
docker exec -it english-app-frontend bash

# バックエンドコンテナに入る
docker exec -it english-app-backend bash
```

### テスト実行

バックエンドディレクトリ（`/backend`）で実行してください。

```bash
# 全テスト実行
mvn test

# クリーンビルド + テスト実行
mvn clean test

# 特定のテストクラス実行
mvn test -Dtest=CategoryServiceTest

# 特定のパターンのテスト実行
mvn test -Dtest=*ServiceTest
mvn test -Dtest=Category*

# 特定のテストメソッド実行
mvn test -Dtest=CategoryServiceTest#updateCategory_success
```

#### テストカバレッジ

テスト実行後、以下のファイルでカバレッジを確認できます：
```
backend/target/site/jacoco/index.html
```

## ファイルアクセス確認

ブラウザで以下のURLにアクセスしてファイルが表示・再生されるか確認可能です：

### 画像ファイル
```
http://localhost:8080/files/ + （DBに保存されたimage_pathの値）
```
例: `http://localhost:8080/files/images/xxxxxxxx-xxxx.jpg`

### 音声ファイル
```
http://localhost:8080/files/ + （DBに保存されたaudio_pathの値）
```
例: `http://localhost:8080/files/audios/xxxxxxxx-xxxx.mp3`

## Git操作

### ブランチ作成

```bash
git switch -c <新しいブランチ名> <作成元のブランチ名>
```

## ライセンス

このプロジェクトのライセンス情報については、プロジェクト管理者にお問い合わせください。