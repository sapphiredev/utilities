import { countAsync } from '../../src';

describe('countAsync', () => {
	test('GIVEN non-empty iterable THEN returns the correct countAsync', async () => {
		const iterable = [1, 2, 3, 4, 5];

		const result = await countAsync(iterable);
		expect(result).toBe(5);
	});

	test('GIVEN empty iterable THEN returns 0', async () => {
		const iterable: number[] = [];

		const result = await countAsync(iterable);
		expect(result).toBe(0);
	});

	test('GIVEN iterable with duplicates THEN returns the correct countAsync', async () => {
		const iterable = [1, 2, 2, 3, 3, 3];

		const result = await countAsync(iterable);
		expect(result).toBe(6);
	});

	test('GIVEN iterable with objects THEN returns the correct countAsync', async () => {
		const iterable = [{ id: 1 }, { id: 2 }, { id: 3 }];

		const result = await countAsync(iterable);
		expect(result).toBe(3);
	});
});
