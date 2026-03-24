import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    port: 8080,
    strictPort: true,
    // Diese Zeile erlaubt es Railway, die Seite anzuzeigen:
    allowedHosts: true 
  },
})
