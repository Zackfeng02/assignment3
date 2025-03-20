import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'container',
      remotes: {
        authApp: 'http://localhost:5001/assets/authApp.js',
        vitalApp: 'http://localhost:5002/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/assets/authApp.js': 'http://localhost:5001',
      '/assets/vitalApp.js': 'http://localhost:5002',
    },
  },
  build: {
    target: 'esnext',
  },
});
