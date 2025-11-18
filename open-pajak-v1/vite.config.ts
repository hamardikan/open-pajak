import { URL, fileURLToPath } from 'node:url'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devtools(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
