import { isSorted } from '../../src';

describe('isSorted', () => {
	test('GIVEN iterable with values in ascending THEN returns true', () => {
		const iterable = [1, 2, 2, 9];
		const result = isSorted(iterable);
		expect(result).toBe(true);
	});

	test('GIVEN iterable with values not in ascending THEN returns false', () => {
		const iterable = [1, 3, 2, 4];
		const result = isSorted(iterable);
		expect(result).toBe(false);
	});

	test('GIVEN iterable with a single value THEN always returns true', () => {
		const iterable = [0];
		const result = isSorted(iterable);
		expect(result).toBe(true);
	});

	test('GIVEN an empty iterable THEN always returns true', () => {
		const iterable: number[] = [];
		const result = isSorted(iterable);
		expect(result).toBe(true);
	});

	test('GIVEN iterable with strings in ascending order THEN returns true', () => {
		const iterable = ['a', 'b', 'c', 'd', 'e'];
		const result = isSorted(iterable);
		expect(result).toBe(true);
	});

	test('GIVEN iterable with strings not in ascending order THEN returns false', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		const result = isSorted(iterable);
		expect(result).toBe(false);
	});
});
