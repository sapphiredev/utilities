import type { TSESLint } from '@typescript-eslint/utils';
import sapphireEslintPluginResult from '../index';

const recommendedConfig: TSESLint.FlatConfig.Config = {
	plugins: {
		result: sapphireEslintPluginResult
	},
	rules: {
		'@sapphire/result/no-discard-result': 'error'
	}
};

export default recommendedConfig;
