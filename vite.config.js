import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import path from 'path';

export default defineConfig({
  server: {
    port: 5175,
    origin: 'http://localhost:5175', // Prevents Vite from exposing full paths
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  base: '/metronic/tailwind/react', // Ensure proper asset handling
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // Alias for 'src'
      '@assets': path.resolve(__dirname, 'src/assets'), // Alias for assets
      '@components': path.resolve(__dirname, 'src/components'), // Alias for components
      '@styles': path.resolve(__dirname, 'src/components/keenicons/assets'), // Alias for styles
    },
  },
  build: {
    sourcemap: false, // Remove source maps to hide paths in production
    chunkSizeWarningLimit: 3000, // Increase chunk limit to avoid warnings
  },
});
