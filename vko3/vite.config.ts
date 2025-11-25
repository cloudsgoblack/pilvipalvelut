import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pilvipalvelut/vko3/',
  plugins: [react()],
})