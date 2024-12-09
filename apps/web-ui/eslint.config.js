const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.js');
const pluginRouter = require('@tanstack/eslint-plugin-router');
module.exports = [
  ...baseConfig,
  ...nx.configs['flat/react'],
  ...pluginRouter.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
