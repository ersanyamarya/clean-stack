/// <reference types="vitest" />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

// import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
// import { join } from 'path';

import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/web-ui',
  server: {
    port: 4200,
    host: '0.0.0.0',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [
    // TanStackRouterVite({
    //   routesDirectory: join(__dirname, 'src/routes'),
    //   generatedRouteTree: join(__dirname, 'src/routeTree.gen.ts'),
    //   routeFileIgnorePrefix: '-',
    //   quoteStyle: 'single',
    // }),
    viteReact(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../dist/apps/web-ui',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/web-ui',
      provider: 'v8',
    },
  },
});
