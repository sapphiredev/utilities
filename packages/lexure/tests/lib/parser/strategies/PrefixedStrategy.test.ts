import { Option } from '@sapphire/result';
import { PrefixedStrategy, type IUnorderedStrategy } from '../../../../src';

describe('PrefixedStrategy', () => {
	const strategy: IUnorderedStrategy = new PrefixedStrategy(['--', '/'], ['=', ':']);

	describe('matchFlag', () => {
		test('GIVEN a value that does not start by any prefix THEN returns none', () => {
			expect(strategy.matchFlag('foo')).toEqual(Option.none);
		});

		test('GIVEN a value that starts with a prefix THEN returns the name', () => {
			expect(strategy.matchFlag('--foo')).toEqual(Option.some('foo'));
		});

		test('GIVEN a value that starts with a prefix but contains a separator THEN returns none', () => {
			expect(strategy.matchFlag('--foo=bar')).toEqual(Option.none);
		});
	});

	describe('matchOption', () => {
		test('GIVEN a value that does not start by any prefix THEN returns none', () => {
			expect(strategy.matchOption('foo')).toEqual(Option.none);
		});

		test('GIVEN a value that starts with a prefix but does not contain a separator THEN returns none', () => {
			expect(strategy.matchOption('--foo')).toEqual(Option.none);
		});

		test('GIVEN a value that starts with a prefix and has a separator but does not contain a value THEN returns none', () => {
			expect(strategy.matchOption('--foo=')).toEqual(Option.none);
		});

		test('GIVEN a value that starts with a prefix and contains both a separator and a value THEN returns the name and value', () => {
			expect(strategy.matchOption('--foo=bar')).toEqual(Option.some(['foo', 'bar']));
		});
	});
});
