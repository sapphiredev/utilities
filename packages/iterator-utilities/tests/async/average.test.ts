import { averageAsync } from '../../src';

describe('averageAsync', () => {
	test('GIVEN iterable with numbers THEN returns the average', async () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = await averageAsync(iterable);
		expect(result).toBe(3);
	});

	test('GIVEN empty iterable THEN returns null', async () => {
		const iterable: number[] = [];
		const result = await averageAsync(iterable);
		expect(result).toBeNull();
	});

	test('GIVEN iterable with one number THEN returns the number itself', async () => {
		const iterable = [10];
		const result = await averageAsync(iterable);
		expect(result).toBe(10);
	});

	test('GIVEN iterable with negative numbers THEN returns the average', async () => {
		const iterable = [-1, -2, -3, -4, -5];
		const result = await averageAsync(iterable);
		expect(result).toBe(-3);
	});

	test('GIVEN iterable with strings THEN throws TypeError', async () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		// @ts-expect-error Testing invalid input
		await expect(() => averageAsync(iterable)).rejects.toThrow(new TypeError('a must be a non-NaN number'));
	});
});
