import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
  },
});
