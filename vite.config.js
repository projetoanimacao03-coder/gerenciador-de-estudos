import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração corrigida com a barra inicial e final obrigatórias
export default defineConfig({
  plugins: [react()],
  base: '/gerenciador-de-estudos/',
})