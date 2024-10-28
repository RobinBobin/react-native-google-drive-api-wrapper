import eslintJs from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import typescriptEslint from 'typescript-eslint'

export default typescriptEslint.config(
  eslintJs.configs.recommended,
  eslintConfigPrettier,
  ...typescriptEslint.configs.strict,
  ...typescriptEslint.configs.stylistic,
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': ['error'],
      'no-throw-literal': ['error'],
      'prefer-promise-reject-errors': ['error']
    }
  }
)
