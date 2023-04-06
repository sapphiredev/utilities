import { Lexer, QuotedParameter, TokenType, WordParameter, type Parameter, type Token } from '../../../src';

describe('Lexer', () => {
	describe('run', () => {
		describe('default lexer', () => {
			const lexer = new Lexer();

			test('GIVEN empty string THEN it yields no values', () => {
				const stream = lexer.run('');
				const tokens = [...stream];

				expect(tokens).toEqual<Parameter[]>([]);
			});

			test('GIVEN single-word THEN it yields one value', () => {
				const stream = lexer.run('foo');
				const tokens = [...stream];

				expect(tokens).toEqual<Parameter[]>([new WordParameter([], { value: 'foo' })]);
			});

			test('GIVEN multi-word THEN it yields multiple values separated by separator tokens', () => {
				const stream = lexer.run('foo bar');
				const tokens = [...stream];

				expect(tokens).toEqual<Parameter[]>([
					new WordParameter([], { value: 'foo' }), //
					new WordParameter([' '], { value: 'bar' })
				]);
			});

			test('GIVEN word with leading separator THEN it yields one separator and a word', () => {
				const stream = lexer.run(' foo');
				const tokens = [...stream];

				expect(tokens).toEqual<Parameter[]>([new WordParameter([' '], { value: 'foo' })]);
			});
		});

		describe('configured lexer', () => {
			const lexer = new Lexer({
				quotes: [
					['"', '"'],
					['“', '”'],
					['「', '」']
				]
			});

			test('GIVEN single-word THEN it yields one value', () => {
				const stream = lexer.run('foo');
				const tokens = [...stream];

				expect(tokens).toEqual<Parameter[]>([new WordParameter([], { value: 'foo' })]);
			});

			test('GIVEN multi-word THEN it yields multiple values separated by separator tokens', () => {
				const stream = lexer.run('foo bar');
				const tokens = [...stream];

				expect(tokens).toEqual<Parameter[]>([
					new WordParameter([], { value: 'foo' }), //
					new WordParameter([' '], { value: 'bar' })
				]);
			});

			test('GIVEN quoted multi-word THEN it yields a single quoted token', () => {
				const stream = lexer.run('"foo bar"');
				const tokens = [...stream];

				expect(tokens).toEqual<Parameter[]>([new QuotedParameter([], { value: 'foo bar', open: '"', close: '"' })]);
			});

			test('GIVEN word with leading separator THEN it yields one separator and a word', () => {
				const stream = lexer.run(' foo');
				const tokens = [...stream];

				expect(tokens).toEqual<Parameter[]>([new WordParameter([' '], { value: 'foo' })]);
			});

			test('GIVEN word without quote pair THEN it does not yield a quoted token', () => {
				const stream = lexer.run('"foo bar');
				const tokens = [...stream];

				expect(tokens).toEqual<Parameter[]>([
					new WordParameter([], { value: '"foo' }), //
					new WordParameter([' '], { value: 'bar' })
				]);
			});
		});
	});

	describe('raw', () => {
		describe('default lexer', () => {
			const lexer = new Lexer();

			test('GIVEN empty string THEN it yields no values', () => {
				const stream = lexer.raw('');
				const tokens = [...stream];

				expect(tokens).toEqual<Token[]>([]);
			});

			test('GIVEN single-word THEN it yields one value', () => {
				const stream = lexer.raw('foo');
				const tokens = [...stream];

				expect(tokens).toEqual<Token[]>([{ type: TokenType.Parameter, value: 'foo' }]);
			});

			test('GIVEN multi-word THEN it yields multiple values separated by separator tokens', () => {
				const stream = lexer.raw('foo bar');
				const tokens = [...stream];

				expect(tokens).toEqual<Token[]>([
					{ type: TokenType.Parameter, value: 'foo' },
					{ type: TokenType.Separator, value: ' ' },
					{ type: TokenType.Parameter, value: 'bar' }
				]);
			});

			test('GIVEN word with leading separator THEN it yields one separator and a word', () => {
				const stream = lexer.raw(' foo');
				const tokens = [...stream];

				expect(tokens).toEqual<Token[]>([
					{ type: TokenType.Separator, value: ' ' },
					{ type: TokenType.Parameter, value: 'foo' }
				]);
			});
		});

		describe('configured lexer', () => {
			const lexer = new Lexer({
				quotes: [
					['"', '"'],
					['“', '”'],
					['「', '」']
				]
			});

			test('GIVEN single-word THEN it yields one value', () => {
				const stream = lexer.raw('foo');
				const tokens = [...stream];

				expect(tokens).toEqual<Token[]>([{ type: TokenType.Parameter, value: 'foo' }]);
			});

			test('GIVEN multi-word THEN it yields multiple values separated by separator tokens', () => {
				const stream = lexer.raw('foo bar');
				const tokens = [...stream];

				expect(tokens).toEqual<Token[]>([
					{ type: TokenType.Parameter, value: 'foo' },
					{ type: TokenType.Separator, value: ' ' },
					{ type: TokenType.Parameter, value: 'bar' }
				]);
			});

			test('GIVEN quoted multi-word THEN it yields a single quoted token', () => {
				const stream = lexer.raw('"foo bar"');
				const tokens = [...stream];

				expect(tokens).toEqual<Token[]>([{ type: TokenType.Quoted, value: 'foo bar', open: '"', close: '"' }]);
			});

			test('GIVEN word with leading separator THEN it yields one separator and a word', () => {
				const stream = lexer.raw(' foo');
				const tokens = [...stream];

				expect(tokens).toEqual<Token[]>([
					{ type: TokenType.Separator, value: ' ' },
					{ type: TokenType.Parameter, value: 'foo' }
				]);
			});

			test('GIVEN word without quote pair THEN it does not yield a quoted token', () => {
				const stream = lexer.raw('"foo bar');
				const tokens = [...stream];

				expect(tokens).toEqual<Token[]>([
					{ type: TokenType.Parameter, value: '"foo' },
					{ type: TokenType.Separator, value: ' ' },
					{ type: TokenType.Parameter, value: 'bar' }
				]);
			});
		});
	});
});
