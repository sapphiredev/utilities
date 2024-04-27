import { union } from '../src';

describe('union', () => {
	test('GIVEN multiple iterables with unique elements THEN returns union of all elements', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = [4, 5, 6];
		const iterable3 = [7, 8, 9];
		const result = [...union(iterable1, iterable2, iterable3)];
		expect<number[]>(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	});

	test('GIVEN multiple iterables with duplicate elements THEN returns union of unique elements', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = [3, 4, 5];
		const iterable3 = [5, 6, 7];
		const result = [...union(iterable1, iterable2, iterable3)];
		expect<number[]>(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
	});

	test('GIVEN empty iterables THEN returns empty iterable', () => {
		const iterable1: number[] = [];
		const iterable2: number[] = [];
		const result = [...union(iterable1, iterable2)];
		expect<number[]>(result).toEqual([]);
	});
});
