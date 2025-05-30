import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    cors: true
  },
  base: './', // Utilisation de chemins relatifs pour plus de compatibilité
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2015', // Compatibilité plus large pour les mobiles
    sourcemap: true,
    minify: false // Désactiver la minification pour le debug
  }
});
