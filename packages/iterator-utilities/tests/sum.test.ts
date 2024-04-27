import { sum } from '../src';

describe('sum', () => {
	test('GIVEN iterable of numbers THEN returns the sum of all numbers', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = sum(iterable);
		expect(result).toEqual(15);
	});

	test('GIVEN empty iterable THEN returns 0', () => {
		const iterable: number[] = [];
		const result = sum(iterable);
		expect(result).toEqual(0);
	});

	test('GIVEN iterable with negative numbers THEN returns the sum of all numbers', () => {
		const iterable = [-1, -2, -3, -4, -5];
		const result = sum(iterable);
		expect(result).toEqual(-15);
	});

	test('GIVEN iterable of booleans THEN returns true count', () => {
		const iterable = [true, true, false, true];
		const result = sum(iterable);
		expect(result).toEqual(3);
	});

	test('GIVEN iterable with strings THEN throws TypeError', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		// @ts-expect-error Testing invalid input
		expect(() => sum(iterable)).toThrow(new TypeError('a must be a non-NaN number'));
	});

	test('GIVEN iterable with NaN THEN throws TypeError', () => {
		const iterable = [1, 2, 3, NaN, 5];
		expect(() => sum(iterable)).toThrow(new TypeError('NaN must be a non-NaN number'));
	});

	test('GIVEN iterable with bigints THEN throws TypeError', () => {
		const iterable = [1n, 2n, 3n, 4n, 5n];
		// @ts-expect-error Testing invalid input
		expect(() => sum(iterable)).toThrow(new TypeError('Cannot convert a BigInt value to a number'));
	});

	test('GIVEN iterable with symbols THEN throws TypeError', () => {
		const iterable = [Symbol('a'), Symbol('b'), Symbol('c')];
		// @ts-expect-error Testing invalid input
		expect(() => sum(iterable)).toThrow(new TypeError('Cannot convert a Symbol value to a number'));
	});

	test('GIVEN iterable with objects THEN throws TypeError', () => {
		const iterable = [{ foo: 'bar' }, { hello: 'world' }, { bax: 'qux' }];
		// @ts-expect-error Testing invalid input
		expect(() => sum(iterable)).toThrow(new TypeError('[object Object] must be a non-NaN number'));
	});

	test('GIVEN objects with valueOf method THEN returns the sum of all numbers', () => {
		const iterable = [{ valueOf: () => 1 }, { valueOf: () => 2 }, { valueOf: () => 3 }];
		const result = sum(iterable);
		expect(result).toEqual(6);
	});

	test('GIVEN iterable with null THEN throws TypeError', () => {
		const iterable = [1, 2, 3, null, 5];
		const result = sum(iterable);
		expect(result).toEqual(11);
	});

	test('GIVEN iterable with undefined THEN throws TypeError', () => {
		const iterable = [1, 2, 3, undefined, 5];
		// @ts-expect-error Testing invalid input
		expect(() => sum(iterable)).toThrow(new TypeError('Cannot convert an undefined value to a number'));
	});
});
