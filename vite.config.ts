import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 4173,
    fs: {
      allow: [__dirname, '/home/nireeksha-a-p/Rapid-Fire:globalai', '/home/nireeksha-a-p/Rapid-Fire:globalai/Rapid-Fire'],
    },
  },
});
