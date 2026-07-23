// The project uses the platform Vite wrapper for dev-server compatibility.
// Keep app-facing branding out of source/UI, but do not replace this with a
// hand-rolled plugin stack unless the deployment target changes.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
});
