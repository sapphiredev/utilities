import { Lexer, ParameterStream, QuotedParameter, TokenStream, WordParameter, type Parameter } from '../../../../src';

describe('ParameterStream', () => {
	describe('default lexer', () => {
		const lexer = new Lexer();

		test('GIVEN empty string THEN it yields no values', () => {
			const stream = new ParameterStream(new TokenStream(lexer, ''));
			const tokens = [...stream];

			expect(tokens).toEqual<Parameter[]>([]);
		});

		test('GIVEN single-word THEN it yields one value', () => {
			const stream = new ParameterStream(new TokenStream(lexer, 'foo'));
			const tokens = [...stream];

			expect(tokens).toEqual<Parameter[]>([new WordParameter([], { value: 'foo' })]);
		});

		test('GIVEN multi-word THEN it yields multiple values separated by separator tokens', () => {
			const stream = new ParameterStream(new TokenStream(lexer, 'foo bar'));
			const tokens = [...stream];

			expect(tokens).toEqual<Parameter[]>([
				new WordParameter([], { value: 'foo' }), //
				new WordParameter([' '], { value: 'bar' })
			]);
		});

		test('GIVEN word with leading separator THEN it yields one separator and a word', () => {
			const stream = new ParameterStream(new TokenStream(lexer, ' foo'));
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
			const stream = new ParameterStream(new TokenStream(lexer, 'foo'));
			const tokens = [...stream];

			expect(tokens).toEqual<Parameter[]>([new WordParameter([], { value: 'foo' })]);
		});

		test('GIVEN multi-word THEN it yields multiple values separated by separator tokens', () => {
			const stream = new ParameterStream(new TokenStream(lexer, 'foo bar'));
			const tokens = [...stream];

			expect(tokens).toEqual<Parameter[]>([
				new WordParameter([], { value: 'foo' }), //
				new WordParameter([' '], { value: 'bar' })
			]);
		});

		test('GIVEN quoted multi-word THEN it yields a single quoted token', () => {
			const stream = new ParameterStream(new TokenStream(lexer, '"foo bar"'));
			const tokens = [...stream];

			expect(tokens).toEqual<Parameter[]>([new QuotedParameter([], { value: 'foo bar', open: '"', close: '"' })]);
		});

		test('GIVEN word with leading separator THEN it yields one separator and a word', () => {
			const stream = new ParameterStream(new TokenStream(lexer, ' foo'));
			const tokens = [...stream];

			expect(tokens).toEqual<Parameter[]>([new WordParameter([' '], { value: 'foo' })]);
		});

		test('GIVEN word without quote pair THEN it does not yield a quoted token', () => {
			const stream = new ParameterStream(new TokenStream(lexer, '"foo bar'));
			const tokens = [...stream];

			expect(tokens).toEqual<Parameter[]>([
				new WordParameter([], { value: '"foo' }), //
				new WordParameter([' '], { value: 'bar' })
			]);
		});
	});
});
