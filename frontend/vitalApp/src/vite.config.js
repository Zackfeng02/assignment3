import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'vitalApp',
      filename: 'remoteEntry.js',
      exposes: {
        './VitalList': './src/components/VitalList.jsx',
        './VitalForm': './src/components/VitalForm.jsx'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    port: 5175,
    strictPort: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    fs: {
      strict: false
    }
  },
  build: {
    target: 'esnext',
    modulePreload: false,
    assetsDir: 'assets'
  }
});