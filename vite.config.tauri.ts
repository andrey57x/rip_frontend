import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { FRONT_HOST, FRONT_PORT } from "./src/config/sharedConfig";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [react(), VitePWA({ registerType: "autoUpdate" })],
  base: "/rip_frontend/",
  server: {
    host: FRONT_HOST,
    port: FRONT_PORT,
  },
  define: {
    "import.meta.env.TAURI_PLATFORM": JSON.stringify(
      process.env.TAURI_PLATFORM
    ),
  },
});
