import type { Lexer } from '../../Lexer';

export class TokenStream implements Iterable<Token> {
	private readonly input: string;
	private readonly quotes: readonly [string, string][];
	private readonly separator: string;
	private position = 0;

	public constructor(lexer: Lexer, input: string) {
		this.quotes = lexer.quotes;
		this.separator = lexer.separator;
		this.input = input;
	}

	public get finished() {
		return this.position >= this.input.length;
	}

	public *[Symbol.iterator](): Iterator<Token> {
		while (!this.finished) {
			yield this.getPossibleSeparator() ?? this.getPossibleQuotedArgument() ?? this.getParameter();
		}
	}

	private getPossibleSeparator(): SeparatorToken | null {
		if (this.input.startsWith(this.separator, this.position)) {
			this.position += this.separator.length;
			return { type: TokenType.Separator, value: this.separator };
		}

		return null;
	}

	private getPossibleQuotedArgument(): QuotedToken | null {
		for (const [open, close] of this.quotes) {
			if (!this.input.startsWith(open, this.position)) continue;

			const end = this.input.indexOf(close, this.position + open.length);
			if (end === -1) continue;

			const value = this.input.slice(this.position + open.length, end);
			this.position = end + close.length;

			return { type: TokenType.Quoted, value, open, close };
		}

		return null;
	}

	private getParameter(): WordToken {
		const index = this.input.indexOf(this.separator, this.position);
		const value = index === -1 ? this.input.slice(this.position) : this.input.slice(this.position, index);
		this.position += value.length;
		return { type: TokenType.Parameter, value };
	}
}

export enum TokenType {
	Parameter,
	Quoted,
	Separator
}

export type Token = WordToken | QuotedToken | SeparatorToken;

export interface WordToken {
	readonly type: TokenType.Parameter;
	readonly value: string;
}

export interface QuotedToken {
	readonly type: TokenType.Quoted;
	readonly value: string;
	readonly open: string;
	readonly close: string;
}

export interface SeparatorToken {
	readonly type: TokenType.Separator;
	readonly value: string;
}
