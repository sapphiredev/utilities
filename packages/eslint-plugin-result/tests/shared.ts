import { ESLintUtils } from '@typescript-eslint/utils';

export const ruleTester = new ESLintUtils.RuleTester({
	parserOptions: {
		ecmaVersion: 2020,
		tsconfigRootDir: __dirname,
		project: './tsconfig.json'
	},
	parser: '@typescript-eslint/parser'
});
