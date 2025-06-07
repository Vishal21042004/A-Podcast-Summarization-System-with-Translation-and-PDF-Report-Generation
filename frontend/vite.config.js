import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // This makes it accessible on the local network
    port: 5173,       // Default Vite port (can be changed if needed)
  },
})
