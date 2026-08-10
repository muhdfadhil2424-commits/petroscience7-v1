import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // <--- PENTING: Tanda './' memastikan laluan assets diakses secara relative dari folder dist
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})