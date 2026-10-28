import { recommendedConfig } from './configs/recommended';
import { noDiscardResult } from './rules/no-discard-result';

/**
 * ESLint plugin result for \@sapphire/result package
 *
 * @example
 * ```js
 * import eslintPluginResult from '@sapphire/eslint-plugin-result';
 * export default [eslintPluginResult.configs.recommended];
 * ```
 * @example
 * ```js
 * export default [{
 *   plugins: { '@sapphire/result': eslintPluginResult },
 *   rules: { '@sapphire/result/no-discard-result': 'error' }
 * }];
 * ```
 */
const eslintPluginResult: {
	configs: Record<string, object>;
	meta: { name: string };
	rules: { 'no-discard-result': typeof noDiscardResult };
} = {
	meta: { name: '@sapphire/eslint-plugin-result' },
	rules: {
		'no-discard-result': noDiscardResult
	},
	configs: {}
};

eslintPluginResult.configs.recommended = {
	plugins: {
		'@sapphire/result': eslintPluginResult
	},
	...recommendedConfig
};

export { eslintPluginResult };
export default eslintPluginResult;
