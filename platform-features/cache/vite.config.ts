import { defineConfig } from 'vite';

import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/framework/cache',

  plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      enabled: true,
      exclude: ['**/*.d.ts', '**/*.spec.*', 'src/index.ts', '*.config.ts', '*.config.js', '*.config.cjs'],
      reportsDirectory: '../../coverage/framework/cache',
      provider: 'v8',
      reporter: ['json', 'text'],
    },
  },
});
