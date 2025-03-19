import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      remotes: {
        authApp: 'http://localhost:5001/authApp.js',
        vitalApp: 'http://localhost:5002/vitalApp.js'
      }
    })
  ],
  server: {
    proxy: {
      '/authApp.js': 'http://localhost:5001',
      '/vitalApp.js': 'http://localhost:5002'
    }
  }
});