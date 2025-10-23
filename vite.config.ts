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
  LOCAL_BACKEND_URL,
  LOCAL_MINIO_URL,
} from "./src/config/sharedConfig";

export default defineConfig({
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      manifest: {
        name: "Reagent Mass Calculator",
        short_name: "Reagent Calculator",
        start_url: ROUTER_BASENAME,
        display: "standalone",
        background_color: "#fdfdfd",
        theme_color: "#db4939",
        orientation: "portrait-primary",
        icons: [
          {
            src: `${ROUTER_BASENAME}/img/logo192.png`,
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: `${ROUTER_BASENAME}/img/logo512.png`,
            type: "image/png",
            sizes: "512x512",
          },
        ],
      },
    }),
  ],
  base: ROUTER_BASENAME,
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
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "secure/cert.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "secure/cert.crt")),
    },
  },
});
