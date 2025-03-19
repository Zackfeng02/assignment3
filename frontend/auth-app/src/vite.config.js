import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  server: {
    port: 5001,
    strictPort: true,
    historyApiFallback: true
  },
  preview: {
    port: 5001,
    strictPort: true
  },
  plugins: [
    react(),
    federation({
      name: 'authApp',
      filename: 'authApp.js',
      exposes: {
        './Login': './src/components/Login.jsx',
        './Register': './src/components/Register.jsx',
        './AuthProvider': './src/components/AuthWrapper.jsx'
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@apollo/client']
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/main.jsx'
    }
  },
  base: '/'
});