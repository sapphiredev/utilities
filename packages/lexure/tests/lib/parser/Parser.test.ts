import { EmptyStrategy, Parser, PrefixedStrategy, WordParameter } from '../../../src';

describe('Parser', () => {
	describe('constructor', () => {
		test('GIVEN no strategy THEN sets empty strategy', () => {
			const parser = new Parser();

			expect(parser.strategy).instanceOf(EmptyStrategy);
		});
	});

	describe('setUnorderedStrategy', () => {
		test('GIVEN a new unordered strategy THEN updates the strategy', () => {
			const parser = new Parser();
			const strategy = new PrefixedStrategy(['--', '/'], ['=', ':']);

			expect(parser.setUnorderedStrategy(strategy)).toBe(parser);
			expect(parser.strategy).toBe(strategy);
		});
	});

	describe('run', () => {
		const parser = new Parser(new PrefixedStrategy(['--', '/'], ['=', ':']));

		test('GIVEN no parameters THEN keeps empty state', () => {
			const result = parser.run([]);

			expect(result.ordered).toEqual([]);
			expect([...result.flags]).toEqual([]);
			expect([...result.options]).toEqual([]);
		});

		test('GIVEN one parameter THEN updates ordered', () => {
			const result = parser.run([
				new WordParameter([], { value: 'foo' }) //
			]);

			expect(result.ordered).toEqual([
				new WordParameter([], { value: 'foo' }) //
			]);
			expect([...result.flags]).toEqual([]);
			expect([...result.options]).toEqual([]);
		});

		test('GIVEN one flag THEN updates flags', () => {
			const result = parser.run([
				new WordParameter([], { value: '--foo' }) //
			]);

			expect(result.ordered).toEqual([]);
			expect([...result.flags]).toEqual(['foo']);
			expect([...result.options]).toEqual([]);
		});

		test('GIVEN one option THEN updates options', () => {
			const result = parser.run([
				new WordParameter([], { value: '--foo=bar' }) //
			]);

			expect(result.ordered).toEqual([]);
			expect([...result.flags]).toEqual([]);
			expect([...result.options]).toEqual([['foo', ['bar']]]);
		});

		test('GIVEN two options with the same name THEN updates options', () => {
			const result = parser.run([
				new WordParameter([], { value: '--foo=bar' }), //
				new WordParameter([], { value: '--foo=baz' })
			]);

			expect(result.ordered).toEqual([]);
			expect([...result.flags]).toEqual([]);
			expect([...result.options]).toEqual([['foo', ['bar', 'baz']]]);
		});
	});
});
