import type { Parameter } from '../lexer/streams/ParameterStream';
import type { Parser } from './Parser';
import type { IUnorderedStrategy } from './strategies/IUnorderedStrategy';

export class ParserResult {
	public readonly ordered: Parameter[] = [];
	public readonly flags = new Set<string>();
	public readonly options = new Map<string, string[]>();
	private readonly strategy: IUnorderedStrategy;

	public constructor(parser: Parser) {
		this.strategy = parser.strategy;
	}

	public parse(parameters: Iterable<Parameter>) {
		for (const parameter of parameters) {
			this.parsePossibleFlag(parameter) || this.parsePossibleOptions(parameter) || this.parseOrdered(parameter);
		}

		return this;
	}

	private parsePossibleFlag(parameter: Parameter): boolean {
		return this.strategy
			.matchFlag(parameter.value)
			.inspect((value) => this.flags.add(value))
			.isSome();
	}

	private parsePossibleOptions(parameter: Parameter): boolean {
		return this.strategy
			.matchOption(parameter.value)
			.inspect(([key, value]) => {
				const existing = this.options.get(key);
				if (existing) existing.push(value);
				else this.options.set(key, [value]);
			})
			.isSome();
	}

	private parseOrdered(parameter: Parameter): boolean {
		this.ordered.push(parameter);
		return true;
	}
}
