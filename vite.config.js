import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração para o Vite entender o caminho do GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/gerenciador-de-estudos/',
})