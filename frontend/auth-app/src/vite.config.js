import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import history from 'connect-history-api-fallback';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5001,
    strictPort: true,
    middlewareMode: true,
    setupMiddlewares: (middlewares, { app }) => {
      app.use(history());
      return middlewares;
    },
  },
  preview: {
    port: 5001,
    strictPort: true,
  },
  plugins: [
    react(),
    federation({
      name: 'authApp',
      filename: 'remoteEntry.js',
      exposes: {
        './Login': './src/components/Login.jsx',
        './Register': './src/components/Register.jsx',
        './AuthProvider': './src/components/AuthWrapper.jsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@apollo/client'],
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: resolve(__dirname, 'src/main.jsx'),
    },
  },
  base: '/',
});
