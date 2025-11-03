import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  define: {
    'process.env': {}
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          fhevm: ['@zama-fhe/relayer-sdk'],
          ui: ['@rainbow-me/rainbowkit', 'wagmi']
        }
      }
    }
  }
})

