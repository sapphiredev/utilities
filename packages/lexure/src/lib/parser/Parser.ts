import type { Parameter } from '../lexer/streams/ParameterStream.js';
import type { IUnorderedStrategy } from './strategies/IUnorderedStrategy.js';
import { ParserResult } from './ParserResult.js';
import { EmptyStrategy } from './strategies/EmptyStrategy.js';

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
