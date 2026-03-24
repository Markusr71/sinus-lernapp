import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    // Wir lassen den Port weg, damit Vite den von Railway nutzt
    allowedHosts: true 
  },
})
