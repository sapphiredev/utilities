import { collectAsync, compressAsync } from '../../src';

describe('compressAsync', () => {
	test('GIVEN iterable and selectors of the same length THEN returns compressed iterable', async () => {
		const iterable = [1, 2, 3, 4, 5];
		const selectors = [true, false, true, false, true];

		const iterator = compressAsync(iterable, selectors);
		const result = await collectAsync(iterator);
		expect(result).toEqual([1, 3, 5]);
	});

	test('GIVEN iterable and selectors with different lengths THEN returns compressed iterable up to the shortest length', async () => {
		const iterable = [1, 2, 3, 4, 5];
		const selectors = [true, false];

		const iterator = compressAsync(iterable, selectors);
		const result = await collectAsync(iterator);
		expect(result).toEqual([1]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', async () => {
		const iterable: number[] = [];
		const selectors = [true, false, true];

		const iterator = compressAsync(iterable, selectors);
		const result = await collectAsync(iterator);
		expect(result).toEqual([]);
	});

	test('GIVEN empty selectors THEN returns empty iterable', async () => {
		const iterable = [1, 2, 3];
		const selectors: boolean[] = [];

		const iterator = compressAsync(iterable, selectors);
		const result = await collectAsync(iterator);
		expect(result).toEqual([]);
	});
});
