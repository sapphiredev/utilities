import { toArray } from '../src';

describe('toArray', () => {
	test('GIVEN iterable with elements THEN returns an array with the same elements', () => {
		const iterable = [1, 2, 3];
		const result = toArray(iterable);
		expect(result).toEqual([1, 2, 3]);
	});

	test('GIVEN empty iterable THEN returns an empty array', () => {
		const iterable: number[] = [];
		const result = toArray(iterable);
		expect(result).toEqual([]);
	});

	test('GIVEN iterable with non-primitive elements THEN returns an array with the same elements', () => {
		const iterable = [{ name: 'John' }, { name: 'Jane' }];
		const result = toArray(iterable);
		expect(result).toEqual([{ name: 'John' }, { name: 'Jane' }]);
	});
});
