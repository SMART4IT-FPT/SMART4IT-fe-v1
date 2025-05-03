import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, existsSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-staticwebapp-config',
      closeBundle() {
        const source = resolve(__dirname, 'staticwebapp.config.json');
        const target = resolve(__dirname, 'dist/staticwebapp.config.json');

        console.log('SOURCE PATH:', source);
        console.log('TARGET PATH:', target);

        if (existsSync(source)) {
          copyFileSync(source, target);
        } else {
          console.warn(`⚠️ Cannot copy staticwebapp.config.json — file not found at: ${source}`);
        }
      },
    },
  ],
});
