import { Option } from '@sapphire/result';
import type { IUnorderedStrategy } from './IUnorderedStrategy';

export class PrefixedStrategy implements IUnorderedStrategy {
	public readonly prefixes: readonly string[];
	public readonly separators: readonly string[];

	public constructor(prefixes: readonly string[], separators: readonly string[]) {
		this.prefixes = prefixes;
		this.separators = separators;
	}

	public matchFlag(input: string): Option<string> {
		const prefix = this.prefixes.find((x) => input.startsWith(x));

		// If the prefix is missing, return None:
		if (!prefix) return Option.none;

		// If the separator is present, return None:
		if (this.separators.some((x) => input.includes(x, prefix.length))) return Option.none;

		return Option.some(input.slice(prefix.length));
	}

	public matchOption(input: string): Option<readonly [key: string, value: string]> {
		const prefix = this.prefixes.find((x) => input.startsWith(x));

		// If the prefix is missing, return None:
		if (!prefix) return Option.none;

		for (const separator of this.separators) {
			const index = input.indexOf(separator, prefix.length + 1);

			// If the separator is missing, skip:
			if (index === -1) continue;

			// If the separator is present, but has no value, return None:
			if (index + separator.length === input.length) return Option.none;

			const key = input.slice(prefix.length, index);
			const value = input.slice(index + separator.length);
			return Option.some([key, value] as const);
		}

		return Option.none;
	}
}
