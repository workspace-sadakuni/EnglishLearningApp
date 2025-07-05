import axios from 'axios';

// /api プレフィックス付きのAPI用インスタンス
const apiClient = axios.create({
  baseURL: '/api', // Vite/Nginxプロキシ経由でバックエンドの/apiに繋がる
  headers: {
    'Content-Type': 'application/json',
  },
});

// ファイル取得など、プロキシを通さない直接リクエスト用のインスタンス
export const directApiClient = axios.create({
  // baseURLは設定しない（または'/'やバックエンドのURLを設定）
  // 今回はViteプロキシを使わないので、Viteの環境変数を使うのが良い
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

// インターセプターは両方に設定する
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setAuthHeader = (config: any) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

apiClient.interceptors.request.use(setAuthHeader);
directApiClient.interceptors.request.use(setAuthHeader);

export default apiClient;