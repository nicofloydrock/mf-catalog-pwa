import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { notifyOnRebuild } from "@antdevx/vite-plugin-hmr-sync";
import { moduleFederationConfig } from "./module.federation.config";

export default defineConfig({
  plugins: [
    react(),
    moduleFederationConfig(),
    {
      // Alias para /dist/assets/* en dev, se mantiene el comportamiento previo.
      name: "dist-alias",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url?.startsWith("/dist/assets/")) {
            req.url = req.url.replace("/dist/assets/", "/assets/");
          }
          next();
        });
      },
    },
    // Notifica al host cuando este remoto se recompila para forzar reload en el shell.
    notifyOnRebuild({
      appName: "catalog",
      hostUrl: "http://localhost:5173",
      endpoint: "/on-child-rebuild",
      notifyOnSuccessOnly: true,
    }),
  ],
  server: {
    port: 5001,
    host: "0.0.0.0",
    allowedHosts: true,
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["*"],
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
    middlewareMode: false,
  },
  preview: {
    port: 5001,
    host: "0.0.0.0",
    allowedHosts: ["mf-catalog-pwa-production.up.railway.app", ".railway.app", "all"],
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["*"],
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
  },
  build: {
    target: "esnext",
  },
});
