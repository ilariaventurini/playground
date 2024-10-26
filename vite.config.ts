import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@composable-maps': path.resolve(__dirname, './src/@composable-maps'),
      '@dashboard': path.resolve(__dirname, './src/@dashboard'),
    },
  },
  plugins: [react(), svgr()],
})
