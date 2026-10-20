import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { skillsprintApi } from './server/apiPlugin.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), skillsprintApi()],
})
