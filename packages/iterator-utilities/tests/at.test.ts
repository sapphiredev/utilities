import { at } from '../src';

describe('at', () => {
	test('GIVEN iterable and valid index THEN returns element at index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = 2;
		const result = at(iterable, index);
		expect(result).toBe(3);
	});

	test('GIVEN iterable and negative index THEN throws RangeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = -1;
		expect(() => at(iterable, index)).toThrowError(new RangeError('-1 must be a non-negative number'));
	});

	test('GIVEN empty iterable THEN returns undefined', () => {
		const iterable: number[] = [];
		const index = 0;
		const result = at(iterable, index);
		expect(result).toBeUndefined();
	});

	test('GIVEN iterable and index greater than length THEN returns undefined', () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = 10;
		const result = at(iterable, index);
		expect(result).toBeUndefined();
	});

	test('GIVEN iterable and Infinite index THEN always returns undefined', () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = Infinity;
		expect(at(iterable, index)).toBeUndefined();
	});

	test('GIVEN iterable and -Infinite index THEN throws RangeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = -Infinity;
		expect(() => at(iterable, index)).toThrowError(new RangeError('-Infinity must be a non-negative number'));
	});
});
