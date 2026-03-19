import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import commonjs from 'vite-plugin-commonjs';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [commonjs(), tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    port: 3000,
    cors: {
      origin: '*',
    },
    allowedHosts: true,
  },
});
