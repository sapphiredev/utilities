import type { Config } from 'prettier';

/**
 * Standard Prettier config for the Sapphire Community
 * @example
 * ```json
 * {
 *   "prettier": "@sapphire/prettier-config"
 * }
 * ```
 */
const prettierConfig: Config = {
	endOfLine: 'lf',
	printWidth: 150,
	quoteProps: 'as-needed',
	semi: true,
	singleQuote: true,
	tabWidth: 4,
	trailingComma: 'none',
	useTabs: true,
	overrides: [
		{
			files: '*.yml',
			options: {
				tabWidth: 2,
				useTabs: false
			}
		}
	]
};

export default prettierConfig;
