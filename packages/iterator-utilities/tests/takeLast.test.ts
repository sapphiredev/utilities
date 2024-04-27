import { takeLast } from '../src';

describe('takeLast', () => {
	test('GIVEN iterable and limit THEN returns last elements of iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const limit = 3;
		const result = [...takeLast(iterable, limit)];
		expect(result).toEqual([3, 4, 5]);
	});

	test('GIVEN iterable with fewer elements than limit THEN returns all elements of iterable', () => {
		const iterable = [1, 2, 3];
		const limit = 5;
		const result = [...takeLast(iterable, limit)];
		expect(result).toEqual([1, 2, 3]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable: number[] = [];
		const limit = 3;
		const result = [...takeLast(iterable, limit)];
		expect(result).toEqual([]);
	});

	test('GIVEN limit of 0 THEN returns empty iterable', () => {
		const iterable = [1, 2, 3];
		const limit = 0;
		const result = [...takeLast(iterable, limit)];
		expect(result).toEqual([]);
	});

	test('GIVEN negative limit THEN throws an error', () => {
		const iterable = [1, 2, 3];
		const limit = -1;
		expect(() => takeLast(iterable, limit)).toThrowError('-1 must be a non-negative number');
	});
});
