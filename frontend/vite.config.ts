import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Dockerコンテナの外からアクセスできるようにする
    port: 5173, // Viteのデフォルトポート
    // Docker環境でホットリロードを有効にするための設定を追加
    watch: {
      usePolling: true,
    },
    proxy: {
      // '/api' で始まるリクエストをバックエンドに転送する
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
      },
    },
  },
})