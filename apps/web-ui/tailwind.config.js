const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const TailwindConfig = require('../../frontend-libs/components/tailwind.config');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...TailwindConfig,
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    ...TailwindConfig.content,
  ],
};
