import type { TSESLint } from '@typescript-eslint/utils';

export const recommendedConfig: TSESLint.FlatConfig.Config = {
	rules: {
		'@sapphire/result/no-discard-result': 'error'
	}
};
