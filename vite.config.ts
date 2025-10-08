import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Адрес вашего бэкенда
        changeOrigin: true,
        secure: false,
        // Переписываем путь: убираем '/api' из начала
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
