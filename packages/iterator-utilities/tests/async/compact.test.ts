import { collectAsync, compactAsync } from '../../src';

describe('compactAsync', () => {
	test('GIVEN iterable with null and undefined values THEN returns iterable without null and undefined values', async () => {
		const iterable = [1, null, 2, undefined, 3];
		const iterator = compactAsync(iterable);
		const result = await collectAsync(iterator);
		expect(result).toEqual([1, 2, 3]);
	});

	test('GIVEN iterable with no null or undefined values THEN returns the same iterable', async () => {
		const iterable = [1, 2, 3];
		const iterator = compactAsync(iterable);
		const result = await collectAsync(iterator);
		expect(result).toEqual([1, 2, 3]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', async () => {
		const iterable: number[] = [];
		const iterator = compactAsync(iterable);
		const result = await collectAsync(iterator);
		expect(result).toEqual([]);
	});
});
