import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'authApp',
      filename: 'remoteEntry.js',
      exposes: {
        './Login': './src/components/Login.jsx',
        './Register': './src/components/Register.jsx'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    port: 5174,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  build: {
    target: 'esnext',
    modulePreload: false
  }
});