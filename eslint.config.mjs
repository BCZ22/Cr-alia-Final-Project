// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import next from 'eslint-config-next';

export default [...next, {
  rules: {
    // Désactiver temporairement les règles problématiques
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
}, ...storybook.configs["flat/recommended"]];
