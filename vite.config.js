import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // target: 'https://darkblue-pig-554261.hostingersite.com',
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
