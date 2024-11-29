import eslintConfig from '@robinbobin/ts-eslint-prettier/eslint.config.mjs'
import { js } from '@robinbobin/ts-eslint-prettier/eslintRuleOptions/index.mjs'

export default [
  ...eslintConfig,
  {
    rules: {
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
      'id-length': ['error', { ...js.idLength, exceptions: ['q'] }]
    }
  }
]
