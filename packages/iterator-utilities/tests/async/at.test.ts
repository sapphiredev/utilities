import { atAsync } from '../../src';

describe('atAsync', () => {
	test('GIVEN iterable and valid index THEN returns element at index', async () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = 2;
		const result = await atAsync(iterable, index);
		expect(result).toBe(3);
	});

	test('GIVEN iterable and negative index THEN throws RangeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = -1;
		expect(() => atAsync(iterable, index)).toThrowError(new RangeError('-1 must be a non-negative number'));
	});

	test('GIVEN empty iterable THEN returns undefined', async () => {
		const iterable: number[] = [];
		const index = 0;
		const result = await atAsync(iterable, index);
		expect(result).toBeUndefined();
	});

	test('GIVEN iterable and index greater than length THEN returns undefined', async () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = 10;
		const result = await atAsync(iterable, index);
		expect(result).toBeUndefined();
	});

	test('GIVEN iterable and Infinite index THEN always returns undefined', async () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = Infinity;
		expect(await atAsync(iterable, index)).toBeUndefined();
	});

	test('GIVEN iterable and -Infinite index THEN throws RangeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const index = -Infinity;
		expect(() => atAsync(iterable, index)).toThrowError(new RangeError('-Infinity must be a non-negative number'));
	});
});
