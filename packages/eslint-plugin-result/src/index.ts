import { recommendedConfig } from './configs/recommended';
import { noDiscardResult } from './rules/no-discard-result';

/**
 * ESLint plugin result for @sapphire/result package
 * @example
 * ```json
 * {
 *   "extends": "plugin:@sapphire/result/recommended"
 * }
 * ```
 * @example
 * ```json
 * {
 *   "plugins": ["@sapphire/result"],
 *   "rules": {
 *     "@sapphire/result/no-discard-result": "error"
 *   }
 *}
 *```
 */
const eslintPluginResult = {
	rules: {
		'no-discard-result': noDiscardResult
	},
	configs: {
		recommended: recommendedConfig
	}
};

module.exports = eslintPluginResult;
