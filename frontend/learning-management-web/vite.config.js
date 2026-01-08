import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["@emotion/react", "@emotion/styled", "@mui/material/Tooltip"],
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  define: {
    global: {},
  },
  server: {
    allowedHosts: [
      'ac93-2405-201-e016-4106-8458-f65-5baf-add2.ngrok-free.app'
    ],
    port: 3000,
    host: "0.0.0.0",
    historyApiFallback: true,
  },
  build: {
    chunkSizeWarningLimit: 10000000,
  },
});
