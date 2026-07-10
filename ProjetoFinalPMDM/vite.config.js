import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Evita erros de CORS ao chamar a football-data.org a partir do browser.
      // O pedido sai do browser para /api/football/... e o Vite reencaminha-o
      // para https://api.football-data.org/... do lado do servidor.
      '/api/football': {
        target: 'https://api.football-data.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/football/, ''),
      },
    },
  },
})
