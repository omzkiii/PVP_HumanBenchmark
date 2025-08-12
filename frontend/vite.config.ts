import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "./", // Use relative paths
  build: {
    cssCodeSplit: true, // Ensure CSS is generated
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000", // Forward to Go
    },
    watch: {
      usePolling: true, // Required for Docker
      interval: 1000, // Check for changes every 1s
    },
    host: true, // Allow external connections (e.g., Docker network)
  },
  plugins: [react()],
});
