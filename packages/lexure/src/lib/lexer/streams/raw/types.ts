export enum TokenType {
	Parameter,
	Quoted,
	Separator
}

export type Token = QuotedToken | SeparatorToken | WordToken;

export interface WordToken {
	readonly type: TokenType.Parameter;
	readonly value: string;
}

export interface QuotedToken {
	readonly close: string;
	readonly open: string;
	readonly type: TokenType.Quoted;
	readonly value: string;
}

export interface SeparatorToken {
	readonly type: TokenType.Separator;
	readonly value: string;
}
