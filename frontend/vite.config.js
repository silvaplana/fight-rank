import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // En build (Dockerfile de prod), l'app est servie sous /fight-rank/ sur
  // silvaplana.cloud : le Caddy "gateway" partagé du VPS route ce chemin
  // vers ce conteneur (voir ~/gateway sur le VPS). Sans ce "base", les
  // fichiers JS/CSS générés seraient référencés depuis la racine du
  // domaine et ne seraient pas trouvés.
  // En dev local (`npm run dev`), on reste à la racine pour plus de simplicité.
  base: command === 'build' ? '/fight-rank/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/media': 'http://localhost:8000',
    },
  },
}))
