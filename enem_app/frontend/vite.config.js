import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080', // backend (host)
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // mantém o mesmo path
        configure: (proxy) => {
          proxy.on('error', (err) => console.error('Proxy error:', err));
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'http://localhost:5173');
          });
        }
      },
      '/api': {
        target: 'http://localhost:8080', // backend (host)
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy) => {
          proxy.on('error', (err) => console.error('Proxy error:', err));
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'http://localhost:5173');
          });
        }
      }
    }
  }
});
