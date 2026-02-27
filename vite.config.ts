import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  base: (() => { const b = process.env.BASE_URL ?? '/'; return b.endsWith('/') ? b : `${b}/`; })(),
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'vendor-react'
          }

          if (id.includes('@radix-ui') || id.includes('cmdk') || id.includes('vaul') || id.includes('embla-carousel')) {
            return 'vendor-ui'
          }

          if (id.includes('@phosphor-icons') || id.includes('lucide-react') || id.includes('@heroicons')) {
            return 'vendor-icons'
          }

          if (id.includes('framer-motion')) {
            return 'vendor-motion'
          }

          if (id.includes('jszip') || id.includes('marked')) {
            return 'vendor-utils'
          }

          if (id.includes('@github/spark')) {
            return 'vendor-spark'
          }

          return 'vendor-misc'
        },
      },
    },
  },
});
