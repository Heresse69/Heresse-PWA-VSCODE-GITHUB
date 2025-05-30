import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Configuration simplifiée basée sur ce qui fonctionne sur mobile
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    cors: true, // CORS simplifié
    // Suppression des headers problématiques pour mobile
    hmr: {
      clientPort: 5174
    }
  },
  base: '/', 
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2015', // Meilleure compatibilité mobile
    sourcemap: true
  },
  // Suppression du logger personnalisé qui causait des problèmes
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
