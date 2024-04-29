import { average } from '../src';

describe('average', () => {
	test('GIVEN iterable with numbers THEN returns the average', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = average(iterable);
		expect(result).toBe(3);
	});

	test('GIVEN empty iterable THEN returns null', () => {
		const iterable: number[] = [];
		const result = average(iterable);
		expect(result).toBeNull();
	});

	test('GIVEN iterable with one number THEN returns the number itself', () => {
		const iterable = [10];
		const result = average(iterable);
		expect(result).toBe(10);
	});

	test('GIVEN iterable with negative numbers THEN returns the average', () => {
		const iterable = [-1, -2, -3, -4, -5];
		const result = average(iterable);
		expect(result).toBe(-3);
	});

	test('GIVEN iterable with strings THEN throws TypeError', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		// @ts-expect-error Testing invalid input
		expect(() => average(iterable)).toThrow(new TypeError('a must be a non-NaN number'));
	});
});
