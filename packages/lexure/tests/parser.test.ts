import { EmptyStrategy, Lexer, Parser, ParserResult, PrefixedStrategy, WordParameter } from '../src';

describe('Parser tests', () => {
	it('GIVEN normal string THEN parse it normally', () => {
		const input = 'text which is normal';
		const parser = new Parser(new EmptyStrategy());
		const pr = new ParserResult(parser);
		pr.parse([...new Lexer().run(input)]);
		expect(pr).toEqual({
			ordered: [
				new WordParameter([], { value: 'text' }),
				new WordParameter([' '], { value: 'which' }),
				new WordParameter([' '], { value: 'is' }),
				new WordParameter([' '], { value: 'normal' })
			],
			flags: new Set(),
			options: new Map(),
			strategy: new EmptyStrategy()
		});
	});

	it('GIVEN string with flags THEN parse it without an issue lol', () => {
		const input = 'text --flag1 --flag2';
		const parser = new Parser(new PrefixedStrategy(['--', '-'], []));
		const pr = new ParserResult(parser);
		pr.parse([...new Lexer().run(input)]);
		expect(pr).toEqual({
			ordered: [new WordParameter([], { value: 'text' })],
			flags: new Set(['flag1', 'flag2']),
			options: new Map(),
			strategy: new PrefixedStrategy(['--', '-'], [])
		});
	});

	it('GIVEN string with options THEN parse it without an issue lol', () => {
		const input = 'text --option1=value1 --option2=value2';
		const parser = new Parser(new PrefixedStrategy(['--', '-'], ['=']));
		const pr = new ParserResult(parser);
		pr.parse([...new Lexer().run(input)]);
		expect(pr).toEqual({
			ordered: [new WordParameter([], { value: 'text' })],
			flags: new Set(),
			options: new Map([
				['option1', ['value1']],
				['option2', ['value2']]
			]),
			strategy: new PrefixedStrategy(['--', '-'], ['='])
		});
	});
});
