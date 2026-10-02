import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  root: resolve(process.cwd(), "client"),
  // Single source of truth: the root .env is used by both server/preflight and Vite.
  // Only VITE_* variables are exposed to browser code by Vite.
  envDir: resolve(process.cwd()),
  plugins: [react()],
  build: {
    outDir: resolve(process.cwd(), "dist"),
    emptyOutDir: true
  },
  server: {
    port: 5173,
    proxy: { "/api": "http://localhost:3000" }
  }
});
