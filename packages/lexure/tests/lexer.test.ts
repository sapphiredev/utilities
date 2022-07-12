import { Lexer, QuotedParameter, WordParameter } from '../src';

describe('The lexer tests', () => {
	it('GIVEN input with no quotes THEN return the string as is', () => {
		const input = 'text without quotes';
		const output = [...new Lexer().run(input)];
		expect(output).toEqual([
			new WordParameter([], { value: 'text' }),
			new WordParameter([' '], { value: 'without' }),
			new WordParameter([' '], { value: 'quotes' })
		]);
	});

	it('GIVEN input with quotes but without quotes set THEN return parsed with quotes', () => {
		const input = 'text with "quotes"';
		const output = [...new Lexer().run(input)];
		expect(output).toEqual([
			new WordParameter([], { value: 'text' }),
			new WordParameter([' '], { value: 'with' }),
			new WordParameter([' '], { value: '"quotes"' })
		]);
	});

	it('GIVEN input with quotes set THEN return parse as expected', () => {
		const input = 'text with "quotes"';
		const output = [
			...new Lexer({
				quotes: [['"', '"']]
			}).run(input)
		];
		expect(output).toEqual([
			new WordParameter([], { value: 'text' }),
			new WordParameter([' '], { value: 'with' }),
			new QuotedParameter([' '], { value: 'quotes', open: '"', close: '"' })
		]);
	});

	it('GIVEN input with quotes set and one quote which spaces in THEN treat that thing as one parameter', () => {
		const input = 'this is a test "with multi spaced quote" text';
		const output = [
			...new Lexer({
				quotes: [['"', '"']]
			}).run(input)
		];
		expect(output).toEqual([
			new WordParameter([], { value: 'this' }),
			new WordParameter([' '], { value: 'is' }),
			new WordParameter([' '], { value: 'a' }),
			new WordParameter([' '], { value: 'test' }),
			new QuotedParameter([' '], { value: 'with multi spaced quote', open: '"', close: '"' }),
			new WordParameter([' '], { value: 'text' })
		]);
	});
});
