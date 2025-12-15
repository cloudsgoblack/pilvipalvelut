import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pilvipalvelut/harjoitustyo/',
  server: {
    proxy: {
      "/api": {
        target: "https://jalostusnetti-production.up.railway.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
