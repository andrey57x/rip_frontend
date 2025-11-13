import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {
  FRONT_HOST,
  FRONT_PORT,
  LOCAL_BACKEND_URL,
  LOCAL_MINIO_URL,
} from "./src/config/sharedConfig";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    host: FRONT_HOST,
    port: FRONT_PORT,
    proxy: {
      "/api": {
        target: LOCAL_BACKEND_URL,
        changeOrigin: true,
        secure: false,
      },
      "/minio": {
        target: LOCAL_MINIO_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/minio/, ""),
      },
    },
  },
});
