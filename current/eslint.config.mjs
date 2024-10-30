import eslintJs from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginImportX from 'eslint-plugin-import-x'
// @ts-expect-error Could not find a declaration file for module 'eslint-plugin-promise'
import eslintPluginPromise from 'eslint-plugin-promise'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import {
  config as typescriptEslintConfig,
  configs as typescriptEslintConfigs
} from 'typescript-eslint'

import { NAMING_CONVENTION_OPTIONS } from './namingConventionOptions.mjs'

export default typescriptEslintConfig(
  eslintJs.configs.recommended,
  eslintConfigPrettier,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  eslintPluginPromise.configs['flat/recommended'],
  ...typescriptEslintConfigs.strictTypeChecked,
  ...typescriptEslintConfigs.stylisticTypeChecked,
  {
    ignores: ['js/']
  },
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        // @ts-expect-error Property 'dirname' does not exist on type 'ImportMeta'
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort
    },
    rules: {
      // typescript-eslint
      '@typescript-eslint/class-methods-use-this': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/max-params': ['error', { max: 4 }],
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        ...NAMING_CONVENTION_OPTIONS
      ],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        {
          ignoreArrowShorthand: true,
          ignoreVoidOperator: true
        }
      ],
      '@typescript-eslint/no-loop-func': 'error',
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignoreArrayIndexes: true,
          ignoreClassFieldInitialValues: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true
        }
      ],
      '@typescript-eslint/no-shadow': [
        'error',
        {
          builtinGlobals: true,
          // eslint-disable-next-line id-length
          ignoreFunctionTypeParameterNameValueShadow: false,
          ignoreTypeValueShadow: false
        }
      ],
      '@typescript-eslint/no-unnecessary-parameter-property-assignment':
        'error',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-use-before-define': [
        'error',
        { ignoreTypeReferences: false }
      ],
      '@typescript-eslint/no-useless-empty-export': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': [
        'error',
        {
          allow: [
            { from: 'lib', name: 'ProgressEvent' },
            { from: 'lib', name: 'Request' }
          ]
        }
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true }
      ],

      // @eslint/js
      'accessor-pairs': 'error',
      'array-callback-return': ['error', { checkForEach: true }],
      camelcase: 'error',
      complexity: 'error',
      'consistent-return': 'error',
      'consistent-this': 'error',
      curly: 'error',
      'default-case': 'error',
      'default-case-last': 'error',
      'dot-notation': 'error',
      eqeqeq: 'error',
      'func-name-matching': 'error',
      'func-names': 'error',
      'grouped-accessor-pairs': ['error', 'getBeforeSet'],
      'guard-for-in': 'error',
      'id-length': ['error', { max: 30, min: 2 }],
      'max-depth': 'error',
      'max-lines': 'error',
      'max-lines-per-function': ['error', { max: 65 }],
      'max-nested-callbacks': 'error',
      'max-statements': ['error', { max: 20 }],
      'new-cap': 'error',
      'no-array-constructor': 'error',
      'no-await-in-loop': 'error',
      'no-bitwise': 'error',
      'no-constructor-return': 'error',
      'no-div-regex': 'error',
      'no-else-return': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-implicit-coercion': 'error',
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-inline-comments': 'error',
      'no-invalid-this': 'error',
      'no-label-var': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-lonely-if': 'error',
      'no-multi-assign': 'error',
      'no-multi-str': 'error',
      'no-nested-ternary': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-object-constructor': 'error',
      'no-param-reassign': 'error',
      'no-promise-executor-return': 'error',
      'no-return-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-template-curly-in-string': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unneeded-ternary': 'error',
      'no-unreachable-loop': 'error',
      'no-unused-expressions': 'error',
      'no-useless-assignment': 'error',
      'no-useless-call': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-object-has-own': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-template': 'error',
      'require-atomic-updates': 'error',
      'require-await': 'error',
      'sort-keys': [
        'error',
        'asc',
        {
          allowLineSeparatedGroups: true,
          natural: true
        }
      ],
      'symbol-description': 'error',
      yoda: 'error',

      // eslint-plugin-import-x
      'import-x/consistent-type-specifier-style': 'error',
      'import-x/exports-last': 'error',
      'import-x/first': 'error',
      'import-x/group-exports': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-cycle': 'error',
      'import-x/no-deprecated': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-empty-named-blocks': 'error',
      'import-x/no-extraneous-dependencies': 'error',
      'import-x/no-mutable-exports': 'error',
      'import-x/no-self-import': 'error',
      'import-x/no-unassigned-import': 'error',
      'import-x/no-unused-modules': [
        'error',
        {
          missingExports: true
        }
      ],
      'import-x/no-useless-path-segments': 'error',

      //eslint-plugin-promise
      'promise/no-multiple-resolved': 'error',
      'promise/prefer-await-to-callbacks': 'error',
      'promise/prefer-await-to-then': 'error',
      'promise/spec-only': 'error',

      // eslint-plugin-simple-import-sort
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^@?\\w.*\\u0000$', '^[^.].*\\u0000$', '^\\..*\\u0000$'],
            ['^\\u0000'],
            ['^'],
            ['^\\.']
          ]
        }
      ]
    }
  }
)
