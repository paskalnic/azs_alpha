import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Build du back-office, distinct de celui du site.
 *
 * Le code d'administration ne doit pas partir dans le bundle des visiteurs :
 * il a sa propre application, servie sous /admin/, et n'est jamais chargé par
 * les pages publiques.
 */
export default defineConfig({
  root: 'admin',
  base: '/admin/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../dist/admin',
    emptyOutDir: true,
  },
});
