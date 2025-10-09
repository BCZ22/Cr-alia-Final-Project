import next from 'eslint-config-next';

export default [
  ...next,
  {
    rules: {
      // Désactiver temporairement les règles problématiques
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
