import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// Dedicated Vitest config, kept separate from vite.config.ts so the
// production build pipeline (npm run build) is never touched by test tooling.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/utils/**', 'src/types/form.ts', 'src/data/**'],
      exclude: ['src/**/*.test.ts', 'src/test/**'],
    },
  },
})
