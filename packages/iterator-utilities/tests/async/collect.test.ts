import { collectAsync } from '../../src';

describe('collectAsync', () => {
	test('GIVEN iterable with elements THEN returns an array with the same elements', async () => {
		const iterable = [1, 2, 3];
		const result = await collectAsync(iterable);
		expect(result).toEqual([1, 2, 3]);
	});

	test('GIVEN empty iterable THEN returns an empty array', async () => {
		const iterable: number[] = [];
		const result = await collectAsync(iterable);
		expect(result).toEqual([]);
	});

	test('GIVEN iterable with non-primitive elements THEN returns an array with the same elements', async () => {
		const iterable = [{ name: 'John' }, { name: 'Jane' }];
		const result = await collectAsync(iterable);
		expect(result).toEqual([{ name: 'John' }, { name: 'Jane' }]);
	});
});
