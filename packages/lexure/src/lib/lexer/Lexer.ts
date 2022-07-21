import { ParameterStream } from './streams/ParameterStream';
import { TokenStream } from './streams/raw/TokenStream';

export class Lexer {
	public readonly quotes: readonly [open: string, close: string][];
	public readonly separator: string;

	public constructor(options: Lexer.Options = {}) {
		this.quotes = options.quotes ?? [];
		this.separator = options.separator ?? ' ';
	}

	public run(input: string) {
		return new ParameterStream(this.raw(input));
	}

	public raw(input: string) {
		return new TokenStream(this, input);
	}
}

export namespace Lexer {
	export interface Options {
		separator?: string;
		quotes?: readonly [open: string, close: string][];
	}
}
