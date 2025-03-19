import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  server: { port: 5002 },
  preview: { port: 5002 },
  plugins: [
    react(),
    federation({
      name: 'vitalApp',
      filename: 'vitalApp.js',
      exposes: {
        './VitalForm': './src/components/VitalForm.jsx',
        './VitalList': './src/components/VitalList.jsx',
        './VitalProvider': './src/components/VitalProvider.jsx'
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@apollo/client']
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      input: './src/main.jsx'
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@apollo/client',
      'graphql',
      'formik',
      'yup',
      'react-bootstrap'
    ]
  }
});