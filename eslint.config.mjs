import eslintConfig from './packages/eslint-config/dist/index.mjs';
import eslintPluginResult from './packages/eslint-plugin-result/dist/index.mjs';

export default [
	{
		ignores: ['**/node_modules/**', '**/dist/**', '**/docs/**', '**/*.d.ts', '**/coverage/**']
	},
	...eslintConfig,
	{
		plugins: {
			'@sapphire/result': eslintPluginResult
		},
		rules: {
			'@sapphire/result/no-discard-result': 'error'
		}
	},
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
	}
];
