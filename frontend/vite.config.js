import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [react(),tailwindcss()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  }
=======
  plugins: [react(), tailwindcss()],
>>>>>>> b1ce07c00e1dfd75fe32cf8b246fa7f01fca55fa
})
