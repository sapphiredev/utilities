import type { Parameter } from '../lexer/streams/ParameterStream';
import type { IUnorderedStrategy } from './strategies/IUnorderedStrategy';
import { ParserResult } from './ParserResult';
import { EmptyStrategy } from './strategies/EmptyStrategy';

export class Parser {
	public strategy: IUnorderedStrategy;

	public constructor(strategy?: IUnorderedStrategy) {
		this.strategy = strategy ?? new EmptyStrategy();
	}

	public setUnorderedStrategy(strategy: IUnorderedStrategy) {
		this.strategy = strategy;
		return this;
	}

	public run(input: Iterable<Parameter>): ParserResult {
		return new ParserResult(this).parse(input);
	}
}
