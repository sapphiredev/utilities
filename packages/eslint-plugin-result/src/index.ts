import { recommendedConfig } from './configs/recommended';
import { noDiscordResultRule } from './rules/no-discard-result';

export = {
	rules: {
		'no-discard-result': noDiscordResultRule
	},
	configs: {
		recommended: recommendedConfig
	}
};
