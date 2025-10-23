import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";
import fs from "fs";
import path from "path";
import {
  FRONT_HOST,
  FRONT_PORT,
  ROUTER_BASENAME,
} from "./src/config/sharedConfig";

export default defineConfig({
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: "autoUpdate",
    }),
  ],
  base: ROUTER_BASENAME,
  server: {
    host: FRONT_HOST,
    port: FRONT_PORT,
    proxy: {
      "/api/v1": {
        target: "http://localhost:8006",
        changeOrigin: true,
        secure: false,
      },
      "/minio": {
        target: "http://localhost:8001",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/minio/, ""),
      },
    },
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "secure/cert.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "secure/cert.crt")),
    },
  },
});
