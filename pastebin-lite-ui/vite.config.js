import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/PasteBin/',  // Note: this affects frontend asset paths
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://pastebin-production-dd5f.up.railway.app')
  }
})
