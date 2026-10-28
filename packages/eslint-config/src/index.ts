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
			]
		}
	},
	eslintPluginPrettierRecommended
];

export default eslintConfig;
