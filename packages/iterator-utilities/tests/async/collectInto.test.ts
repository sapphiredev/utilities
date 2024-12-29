import { collectIntoAsync } from '../../src';

describe('collectIntoAsync', () => {
	test('GIVEN iterable with elements THEN returns the output array updated', async () => {
		const output = [1, 2];
		const iterable = [3, 4, 5];
		const result = await collectIntoAsync(iterable, output);

		expect<number[]>(result).toBe(output);
		expect<number[]>(result).toEqual([1, 2, 3, 4, 5]);
	});
});
