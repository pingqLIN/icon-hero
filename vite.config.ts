import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";
import fs from "node:fs";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const workspaceRoot = resolve(process.cwd())
const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname
const realProjectRoot = fs.realpathSync.native(projectRoot)

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  root: command === 'serve' ? realProjectRoot : undefined,
  base: (() => { const b = process.env.BASE_URL ?? '/'; return b.endsWith('/') ? b : `${b}/`; })(),
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    preserveSymlinks: command === 'serve',
    alias: {
      '@': resolve(command === 'serve' ? realProjectRoot : projectRoot, 'src'),
    }
  },
  server: {
    fs: {
      allow: [workspaceRoot, projectRoot, realProjectRoot],
    },
  },
  optimizeDeps: command === 'serve' ? {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-error-boundary',
      'i18next',
      'react-i18next',
      'html-parse-stringify',
      'void-elements',
    ],
  } : undefined,
  build: {
    minify: false,
  },
}));
