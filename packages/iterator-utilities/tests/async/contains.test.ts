import { containsAsync } from '../../src';

describe('containsAsync', () => {
	test('GIVEN iterable containing the value THEN returns true', async () => {
		const iterable = [1, 2, 3];
		const value = 2;

		const result = await containsAsync(iterable, value);
		expect(result).toBe(true);
	});

	test('GIVEN iterable not containing the value THEN returns false', async () => {
		const iterable = [1, 2, 3];
		const value = 4;

		const result = await containsAsync(iterable, value);
		expect(result).toBe(false);
	});

	test('GIVEN empty iterable THEN returns false', async () => {
		const iterable: number[] = [];
		const value = 1;

		const result = await containsAsync(iterable, value);
		expect(result).toBe(false);
	});
});
