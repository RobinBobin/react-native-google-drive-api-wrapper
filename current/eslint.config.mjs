import eslintConfig from '@robinbobin/ts-eslint-prettier/eslint.config.mjs'

export default [
  ...eslintConfig,
  {
    rules: {
      // typescript-eslint
      '@typescript-eslint/prefer-readonly-parameter-types': [
        'error',
        {
          allow: [
            { from: 'lib', name: 'ProgressEvent' },
            { from: 'lib', name: 'Request' }
          ],
          ignoreInferredTypes: true
        }
      ],
      // '@typescript-eslint/switch-exhaustiveness-check': [
      //   'error',
      //   {
      //     requireDefaultForNonUnion: true
      //   }
      // ],

      // @eslint/js
      'id-length': ['error', { exceptions: ['q'], max: 30, min: 2 }]
    }
  }
]
