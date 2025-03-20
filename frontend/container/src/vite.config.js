// container/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'container',
      remotes: {
        authApp: 'http://localhost:5174/@vite-plugin-federation/authApp.js',
        vitalApp: 'http://localhost:5175/@vite-plugin-federation/vitalApp.js'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    port: 5173
  }
});