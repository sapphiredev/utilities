import type { PrettierSchema } from './schema';
/**
 * Default Prettier configuration for Sapphire Projects
 * @example
 * ```json
 * {
 *   "prettier": "@sapphire/prettier-config"
 * }
 * ```
 */
export const config: PrettierSchema = {
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
		}
	]
};

module.exports = config;
export default config;
