import { ascNumber, ascString, defaultCompare, descNumber, descString, minBy } from '../src';

describe('minBy', () => {
	test('GIVEN iterable with positive numbers by ascending string and asc comparator THEN returns the lexicographic minimum value', () => {
		const iterable = [1, 5, 3, 2, 4];
		const result = minBy(iterable, ascString);
		expect(result).toBe(1);
	});

	test('GIVEN iterable with negative numbers by descending string and desc comparator THEN returns the lexicographic maximum value', () => {
		const iterable = [-1, -5, -3, -2, -4];
		const result = minBy(iterable, descString);
		expect(result).toBe(-5);
	});

	test('GIVEN iterable with positive numbers by ascending number and asc comparator THEN returns the minimum value', () => {
		const iterable = [1, 5, 3, 2, 4];
		const result = minBy(iterable, ascNumber);
		expect(result).toBe(1);
	});

	test('GIVEN iterable with negative numbers by descending number and desc comparator THEN returns the maximum value', () => {
		const iterable = [-1, -5, -3, -2, -4];
		const result = minBy(iterable, descNumber);
		expect(result).toBe(-1);
	});

	test('GIVEN iterable with one element THEN returns the element', () => {
		const iterable = [1];
		const result = minBy(iterable, defaultCompare);
		expect(result).toBe(1);
	});

	test('GIVEN empty iterable THEN returns null', () => {
		const iterable: number[] = [];
		const result = minBy(iterable, defaultCompare);
		expect(result).toBeNull();
	});

	test('GIVEN iterable with strings and asc comparator THEN then returns the lexicographic minimum value', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		expect(minBy(iterable, defaultCompare)).toBe('a');
	});
});
