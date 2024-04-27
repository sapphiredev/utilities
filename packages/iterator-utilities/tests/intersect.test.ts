import { intersect } from '../src';

describe('intersect', () => {
	test('GIVEN two arrays with common elements THEN returns an iterable with the common elements', () => {
		const iterable1 = [1, 2, 3, 4];
		const iterable2 = [3, 4, 5, 6];
		const result = [...intersect(iterable1, iterable2)];
		expect(result).toEqual([3, 4]);
	});

	test('GIVEN two arrays with no common elements THEN returns an empty iterable', () => {
		const iterable1 = [1, 2, 3];
		const iterable2 = [4, 5, 6];
		const result = [...intersect(iterable1, iterable2)];
		expect(result).toEqual([]);
	});

	test('GIVEN an empty array and a non-empty array THEN returns an empty iterable', () => {
		const iterable1: number[] = [];
		const iterable2 = [1, 2, 3];
		const result = [...intersect(iterable1, iterable2)];
		expect(result).toEqual([]);
	});

	test('GIVEN two empty arrays THEN returns an empty iterable', () => {
		const iterable1: number[] = [];
		const iterable2: number[] = [];
		const result = [...intersect(iterable1, iterable2)];
		expect(result).toEqual([]);
	});
});
