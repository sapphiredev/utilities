import { compareAsync, type LexicographicComparison } from '../../src';

describe('compareAsync', () => {
	test('GIVEN two equal iterables THEN returns 0', async () => {
		const result = await compareAsync([1], [1]);
		expect<LexicographicComparison>(result).toBe(0);
	});

	test('GIVEN [1] and [1, 2] THEN returns -1', async () => {
		const result = await compareAsync([1], [1, 2]);
		expect<LexicographicComparison>(result).toBe(-1);
	});

	test('GIVEN [1, 2] and [1] THEN returns -1', async () => {
		const result = await compareAsync([1, 2], [1]);
		expect<LexicographicComparison>(result).toBe(1);
	});

	test('GIVEN [0, 1] and [1] THEN returns -1', async () => {
		const result = await compareAsync([0, 1], [1]);
		expect<LexicographicComparison>(result).toBe(-1);
	});

	test('GIVEN [2, 1] and [1] THEN returns 1', async () => {
		const result = await compareAsync([2, 1], [1]);
		expect<LexicographicComparison>(result).toBe(1);
	});
});
