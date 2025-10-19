import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {
  BACKEND_PATH,
  FRONT_HOST,
  FRONT_PORT,
} from "./src/config/shared_config";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Reagent Mass Calculator",
        short_name: "Reagent Calculator",
        start_url: "/rip_frontend/",
        display: "standalone",
        background_color: "#fdfdfd",
        theme_color: "#db4939",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/rip_frontend/img/logo192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "/rip_frontend/img/logo512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
      },
    }),
  ],
  base: "/rip_frontend/",
  server: {
    host: FRONT_HOST,
    port: FRONT_PORT,
    proxy: {
      "/api": {
        target: BACKEND_PATH,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "secure/cert.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "secure/cert.crt")),
    },
  },
});
