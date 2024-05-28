import recommendedConfig from './configs/recommended';
import { noDiscardResult } from './rules/no-discard-result';
import type { TSESLint } from '@typescript-eslint/utils';

/**
 * ESLint plugin result for @sapphire/result package
 * @example
 * file: `eslint.config.mjs`
 * ```typescript
 * import sapphireEslintPluginResult from '@sapphire/eslint-plugin-result/recommended';
 *
 * const config = [
 * 	sapphireEslintPluginResult,
 * ];
 *
 * export default config;
 * ```
 *
 * @example
 * file: `eslint.config.mjs`
 * ```typescript
 * import sapphireEslintPluginResult from '@sapphire/eslint-plugin-result';
 *
 * const config = [
 * 	{
 * 		plugins: { result: sapphireEslintPluginResult },
 * 		rules: { '@sapphire/result/no-discard-result': 'error' }
 * 	},
 * ];
 *
 * export default config;
 * ```
 *
 * Optionally, you can type the config object as
 * ```
 * import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray
 * ```
 */
const eslintPluginResult: TSESLint.FlatConfig.Plugin = {
	meta: {
		name: '@sapphire/eslint-plugin-result',
		version: '[VI]{{inject}}[/VI]'
	},
	rules: {
		'no-discard-result': noDiscardResult
	},
	configs: {
		recommended: recommendedConfig
	}
};

export default eslintPluginResult;
