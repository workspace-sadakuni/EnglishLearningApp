## EnglishLearnigApp
英語を学ぶためのアプリケーション

#### 機能
- カテゴリー登録機能
- 英語登録機能（カテゴリーとの紐づけ、画像および音声データも登録可能）
- 登録された英語の画像や音声データ、意味をカテゴリーごとに確認可能

#### カテゴリー登録画面
<img width="932" alt="Image" src="https://github.com/user-attachments/assets/c7cb7fc9-93e9-4336-8989-92c8c47b5a11" />

#### 英語登録画面
<img width="905" alt="Image" src="https://github.com/user-attachments/assets/2246b4d3-de04-41c8-962c-8824d6445d3c" />

#### 英語表示画面
<img width="830" alt="Image" src="https://github.com/user-attachments/assets/c9788816-f69e-44ff-a180-56b805b1e5ea" />

## 環境構築

#### 前提
- Docker利用可能であること

#### 環境構築手順
1. Dockerコンテナビルド  
```
docker-compose up --build -d
```

#### 環境情報（一部のみ掲載）
- node.js: 22.17.0  
- react: 19.1.0  
- typescript: 5.8.3  
- vite: 7.0.0  
- Java: 17  
- Spring Boot: 3.4.7  
- MySQL: 8.0  

#### 備考
**コンテナ削除**  
```
docker-compose down -v
```
**キャッシュ、イメージ、コンテナ削除**  
```
docker-compose down --volumes --rmi all
```

**フロントエンド開発環境動作確認**  
> http://localhost:5173

**バックエンド動作確認**  
> http://localhost:5173/api/categories

**フロントエンドコンテナに入る**  
```
docker exec -it english-app-frontend bash
```

**フロントエンドコンテナログ監視**  
```
docker-compose logs -f frontend
```

**バックエンドコンテナに入る**  
```
docker exec -it english-app-backend bash
```

**バックエンドコンテナログ監視**  
```
docker-compose logs -f backend
```

**バックエンドテスト実行**  
/backendで実行  
```
mvn test
```
```
mvn clean test
```
backend/target/site/jacoco/index.html  
にカバレッジが作成される。

**バックエンド特定のテスト実行**  
/backendで実行  
```
mvn test -Dtest=CategoryServiceTest
```
```
mvn test -Dtest=*ServiceTest
```
```
mvn test -Dtest=Category*
```
```
mvn test -Dtest=CategoryServiceTest#updateCategory_success
```

**英単語登録ファイルへのアクセスを確認**  
ブラウザで、以下のURLにアクセスしてファイルが表示・再生されるか確認可能
- 画像: http://localhost:8080/files/ + （DBに保存されたimage_pathの値）
  - 例: http://localhost:8080/files/images/xxxxxxxx-xxxx.jpg
- 音声: http://localhost:8080/files/ + （DBに保存されたaudio_pathの値）
  - 例: http://localhost:8080/files/audios/xxxxxxxx-xxxx.mp3

#### git操作
ブランチを作成
```
git switch -c <新しいブランチ名> <作成元のブランチ名>
```