import { RuleTester } from '@typescript-eslint/rule-tester';

export const ruleTester = new RuleTester({
	parserOptions: {
		ecmaVersion: 2020,
		tsconfigRootDir: __dirname,
		project: './tsconfig.json'
	},
	parser: '@typescript-eslint/parser'
});
