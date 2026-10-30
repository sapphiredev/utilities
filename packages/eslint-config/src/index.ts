import type { TSESLint } from '@typescript-eslint/utils';
import common from 'eslint-config-neon/common';
import node from 'eslint-config-neon/node';
import prettier from 'eslint-config-neon/prettier';
import typescript from 'eslint-config-neon/typescript';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export const eslintConfig: TSESLint.FlatConfig.ConfigArray = [
	{
		ignores: ['.yarn/**']
	},
	...common,
	...typescript,
	...prettier,
	...node,
	{
		languageOptions: {
			parserOptions: {
				project: 'tsconfig.eslint.json'
			}
		},
		rules: {
			'@typescript-eslint/consistent-type-definitions': 'off',
			'@typescript-eslint/prefer-literal-enum-member': 'off',
			'import-x/order': 'off',
			'jsdoc/check-param-names': 'warn',
			'sonarjs/no-inverted-boolean-check': 'off',
			'@typescript-eslint/dot-notation': [
				'error',
				{
					allowPrivateClassPropertyAccess: true
				}
			],
			'no-restricted-globals': 'off',
			'n/prefer-global/buffer': 'off',
			'n/prefer-global/console': 'off',
			'n/prefer-global/process': 'off',
			'n/prefer-global/text-decoder': 'off',
			'n/prefer-global/text-encoder': 'off',
			'n/prefer-global/url': 'off',
			'n/prefer-global/url-search-params': 'off'
		}
	},
	eslintPluginPrettierRecommended
];

export default eslintConfig;
