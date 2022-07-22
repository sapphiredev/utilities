import { Parser, ParserResult, PrefixedStrategy, WordParameter } from '../../../src';

describe('ParserResult', () => {
	const parser = new Parser(new PrefixedStrategy(['--', '/'], ['=', ':']));

	test('GIVEN no parameters THEN keeps empty state', () => {
		const result = new ParserResult(parser).parse([]);

		expect(result.ordered).toEqual([]);
		expect([...result.flags]).toEqual([]);
		expect([...result.options]).toEqual([]);
	});

	test('GIVEN one parameter THEN updates ordered', () => {
		const result = new ParserResult(parser).parse([
			new WordParameter([], { value: 'foo' }) //
		]);

		expect(result.ordered).toEqual([
			new WordParameter([], { value: 'foo' }) //
		]);
		expect([...result.flags]).toEqual([]);
		expect([...result.options]).toEqual([]);
	});

	test('GIVEN one flag THEN updates flags', () => {
		const result = new ParserResult(parser).parse([
			new WordParameter([], { value: '--foo' }) //
		]);

		expect(result.ordered).toEqual([]);
		expect([...result.flags]).toEqual(['foo']);
		expect([...result.options]).toEqual([]);
	});

	test('GIVEN one option THEN updates options', () => {
		const result = new ParserResult(parser).parse([
			new WordParameter([], { value: '--foo=bar' }) //
		]);

		expect(result.ordered).toEqual([]);
		expect([...result.flags]).toEqual([]);
		expect([...result.options]).toEqual([['foo', ['bar']]]);
	});

	test('GIVEN two options with the same name THEN updates options', () => {
		const result = new ParserResult(parser).parse([
			new WordParameter([], { value: '--foo=bar' }), //
			new WordParameter([], { value: '--foo=baz' })
		]);

		expect(result.ordered).toEqual([]);
		expect([...result.flags]).toEqual([]);
		expect([...result.options]).toEqual([['foo', ['bar', 'baz']]]);
	});
});
