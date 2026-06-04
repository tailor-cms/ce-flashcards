import tailorConfig from '@tailor-cms/eslint-config';

export default [
  ...tailorConfig,
  {
    ignores: ['dist/**'],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
  },
  {
    rules: {
      // `Flashcard` is the natural name for a single card; the multi-word rule
      // only guards against HTML-tag collisions, which is a non-issue here.
      'vue/multi-word-component-names': ['error', { ignores: ['Flashcard'] }],
    },
  },
];
