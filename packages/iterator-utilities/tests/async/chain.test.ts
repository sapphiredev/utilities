import { chainAsync, collectAsync } from '../../src';

describe('chainAsync', () => {
	test('GIVEN multiple iterables THEN returns concatenated iterable', async () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = [4, 5, 6];
		const iterable3 = [7, 8, 9];

		const iterator = chainAsync(iterable1, iterable2, iterable3);
		const result = await collectAsync(iterator);
		expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	});

	test('GIVEN empty iterables THEN returns empty iterable', async () => {
		const iterable1: number[] = [];
		const iterable2: number[] = [];
		const iterable3: number[] = [];

		const iterator = chainAsync(iterable1, iterable2, iterable3);
		const result = await collectAsync(iterator);
		expect(result).toEqual([]);
	});

	test('GIVEN single iterable THEN returns the same iterable', async () => {
		const iterable = [1, 2, 3];

		const iterator = chainAsync(iterable);
		const result = await collectAsync(iterator);
		expect(result).toEqual([1, 2, 3]);
	});
});
