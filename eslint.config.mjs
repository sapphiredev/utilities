import sapphireEslintConfig from './packages/eslint-config/dist/esm/index.mjs';

/**
 * @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray}
 */
const config = [
	{
		ignores: ['node_modules/', '**/dist/', '**/docs/', '**/*.d.ts', '**/coverage/']
	},
	...sapphireEslintConfig,
	{
		files: ['**/*.test.ts'],
		rules: {
			'@typescript-eslint/no-extraneous-class': 'off'
		}
	},
	{
		files: ['**/PaginatedMessage.ts'],
		rules: {
			'@typescript-eslint/member-ordering': 'off'
		}
	},
	{
		files: ['**/omitKeysFromObject.ts'],
		rules: {
			'@typescript-eslint/ban-types': 'off'
		}
	}
];

export default config;
