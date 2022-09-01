import path from 'node:path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: path.resolve(__dirname, './dist/'),
  build: {
      outDir: './dist/'
  },
  plugins: [
      vue(),
      ElementPlus()
  ],
  server: {
      port: 3000
  }
})
