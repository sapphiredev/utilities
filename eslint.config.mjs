import eslintConfig from './packages/eslint-config/dist/index.mjs';
import eslintPluginResult from './packages/eslint-plugin-result/dist/index.mjs';

export default [
	{
		ignores: ['**/node_modules/**', '**/dist/**', '**/*.d.ts', '**/coverage/**']
	},
	...eslintConfig,
	eslintPluginResult.configs.recommended,
	{
		files: ['**/*.test.ts'],
		rules: {
			'@typescript-eslint/no-extraneous-class': 'off',
			'id-length': 'off',
			'unicorn/consistent-function-scoping': 'off',
			'func-style': 'off'
		}
	},
	{
		files: ['packages/discord.js-utilities/src/lib/PaginatedMessages/PaginatedMessage.ts'],
		rules: {
			'@typescript-eslint/member-ordering': 'off'
		}
	},
	{
		files: ['packages/utilities/src/lib/omitKeysFromObject.ts'],
		rules: {
			'@typescript-eslint/no-restricted-types': 'off'
		}
	},
	{
		files: ['packages/discord-utilities/src/lib/TwemojiRegex.ts'],
		rules: {
			'unicorn/better-regex': 'off',
			'unicorn/escape-case': 'off'
		}
	}
];
