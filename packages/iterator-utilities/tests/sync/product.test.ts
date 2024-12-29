import { product } from '../../src';

describe('product', () => {
	test('GIVEN iterable with numbers THEN returns the product of all numbers', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = product(iterable);
		expect(result).toEqual(120);
	});

	test('GIVEN iterable with negative numbers THEN returns the product of all numbers', () => {
		const iterable = [-1, -2, -3, -4, -5];
		const result = product(iterable);
		expect(result).toEqual(-120);
	});

	test('GIVEN iterable with zero THEN returns zero', () => {
		const iterable = [1, 2, 0, 4, 5];
		const result = product(iterable);
		expect(result).toEqual(0);
	});

	test('GIVEN iterable with one element THEN returns the element', () => {
		const iterable = [5];
		const result = product(iterable);
		expect(result).toBe(5);
	});

	test('GIVEN empty iterable THEN returns 1', () => {
		const iterable: number[] = [];
		const result = product(iterable);
		expect(result).toEqual(1);
	});

	test('GIVEN iterable with strings THEN returns the maximum value', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		// @ts-expect-error Testing invalid input
		expect(() => product(iterable)).toThrow(new TypeError('a must be a non-NaN number'));
	});
});
