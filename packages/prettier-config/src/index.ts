import type { PrettierSchema } from './schema';
/**
 * Standard Prettier config for the Sapphire Community
 * @example
 * ```json
 * {
 *   "prettier": "@sapphire/prettier-config"
 * }
 * ```
 */
const prettierConfig: PrettierSchema = {
	$schema: 'http://json.schemastore.org/prettierrc',
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
			files: '.all-contributorsrc',
			options: {
				parser: 'json'
			}
		},
		{
			files: '*.yml',
			options: {
				tabWidth: 2,
				useTabs: false
			}
		}
	]
};

module.exports = prettierConfig;
