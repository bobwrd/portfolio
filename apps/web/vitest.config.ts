import path from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    // Force OneBook's dashboard tests into standalone mode. Without this,
    // Vite loads .env.local and the suite makes live calls to the deployed
    // Worker — slow, flaky, and dependent on someone else's uptime.
    env: { VITE_API_ORIGIN: "" },
  },
});
