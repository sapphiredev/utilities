import { max } from '../src';

describe('max', () => {
	test('GIVEN iterable with numbers THEN returns the maximum value', () => {
		const iterable = [1, 5, 3, 2, 4];
		const result = max(iterable);
		expect(result).toBe(5);
	});

	test('GIVEN iterable with negative numbers THEN returns the maximum value', () => {
		const iterable = [-1, -5, -3, -2, -4];
		const result = max(iterable);
		expect(result).toBe(-1);
	});

	test('GIVEN iterable with one element THEN returns the element', () => {
		const iterable = [1];
		const result = max(iterable);
		expect(result).toBe(1);
	});

	test('GIVEN empty iterable THEN returns null', () => {
		const iterable: number[] = [];
		const result = max(iterable);
		expect(result).toBeNull();
	});

	test('GIVEN iterable with strings THEN throws TypeError', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		// @ts-expect-error Testing invalid input
		expect(() => max(iterable)).toThrow(new TypeError('a must be a non-NaN number'));
	});
});
