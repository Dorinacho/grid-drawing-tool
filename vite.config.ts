// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import astro from '@astrojs/vite-plugin-astro';

export default defineConfig({
  plugins: [
    astro(),
    react(),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  },
});
