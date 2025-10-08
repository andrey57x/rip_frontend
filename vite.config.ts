import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { BACKEND_PATH } from "./src/utils/constants";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": BACKEND_PATH,
    },
  },
});
