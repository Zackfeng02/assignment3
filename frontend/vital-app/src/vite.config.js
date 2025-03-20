import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5002,
    strictPort: true,
    cors: true,
    proxy: {
      "/graphql": "http://localhost:4001" // Ensure GraphQL API requests are properly forwarded
    }
  },
  preview: {
    port: 5002,
    strictPort: true
  },
  plugins: [
    react(),
    federation({
      name: 'vitalApp',
      filename: 'remoteEntry.js', // Renamed for consistency with micro-frontends
      exposes: {
        './VitalForm': './src/components/VitalForm.jsx',
        './VitalList': './src/components/VitalList.jsx',
        './VitalProvider': './src/components/VitalProvider.jsx'
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@apollo/client']
    })
  ],
  build: {
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
    modulePreload: false,
    minify: 'terser', // Optimize final bundle
    cssCodeSplit: true, // Allow splitting CSS for better caching
    rollupOptions: {
      input: resolve(__dirname, 'src/main.jsx'),
      output: {
        format: 'esm'
      }
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
    ],
    exclude: ['vitalApp']
  }
});
