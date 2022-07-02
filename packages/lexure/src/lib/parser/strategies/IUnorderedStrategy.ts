import type { Option } from '@sapphire/result';

export interface IUnorderedStrategy {
	/**
	 * Matches a flag.
	 * @param input The string to match.
	 */
	matchFlag(input: string): Option<string>;

	/**
	 * Matches an option.
	 * @param input The string to match.
	 */
	matchOption(input: string): Option<readonly [key: string, value: string]>;
}
