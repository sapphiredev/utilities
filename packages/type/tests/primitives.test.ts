import { Type } from '../src';

describe('Primitives', () => {
	test('number', () => {
		expect(new Type(2).toString()).toBe('number');
	});

	test('string', () => {
		expect(new Type('this is a string').toString()).toBe('string');
	});

	test('boolean', () => {
		expect(new Type(true).toString()).toBe('boolean');

		expect(new Type(false).toString()).toBe('boolean');
	});

	test('symbols', () => {
		// eslint-disable-next-line symbol-description
		expect(new Type(Symbol()).toString()).toBe('symbol');
	});

	test('symbols with strings', () => {
		const sym1 = Symbol('1');
		const sym2 = Symbol('2');

		expect(new Type(sym1).toString()).toBe(new Type(sym2).toString());
	});

	test('undefined', () => {
		expect(new Type(undefined).toString()).toBe('void');
	});
});
