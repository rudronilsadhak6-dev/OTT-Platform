import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // host: true lets other computers on the same Wi-Fi open http://<your-ip>:5173
  server: { host: true },
});
