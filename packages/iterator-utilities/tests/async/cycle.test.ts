import { collectAsync, cycleAsync, takeAsync } from '../../src';

describe('cycleAsync', () => {
	test('GIVEN iterable with elements THEN returns infinite iterable cycling through the elements', async () => {
		const iterable = [1, 2, 3];
		const iterator = cycleAsync(iterable);
		const result = await collectAsync(takeAsync(iterator, 9));
		expect(result).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3]); // The cycleAsync repeats indefinitely
	});

	test('GIVEN empty iterable THEN returns empty iterable', async () => {
		const iterable: number[] = [];
		const iterator = cycleAsync(iterable);
		const result = await collectAsync(iterator);
		expect(result).toEqual([]);
	});
});
