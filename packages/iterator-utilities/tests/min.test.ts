import { min } from '../src';

describe('min', () => {
	test('GIVEN iterable with numbers THEN returns the lexicographic minimum value', () => {
		const iterable = [5, 2, 8, 1, 10];
		const result = min(iterable);
		expect(result).toBe(1);
	});

	test('GIVEN iterable with negative numbers THEN returns the lexicographic minimum value', () => {
		const iterable = [-5, -2, -8, -1, -10];
		const result = min(iterable);
		expect(result).toBe(-1);
	});

	test('GIVEN iterable with mixed positive and negative numbers THEN returns the lexicographic minimum value', () => {
		const iterable = [-5, 2, -8, 1, -10];
		const result = min(iterable);
		expect(result).toBe(-10);
	});

	test('GIVEN iterable with one element THEN returns the element', () => {
		const iterable = [1];
		const result = min(iterable);
		expect(result).toBe(1);
	});

	test('GIVEN empty iterable THEN returns null', () => {
		const iterable: number[] = [];
		const result = min(iterable);
		expect(result).toBeNull();
	});

	test('GIVEN iterable with strings THEN returns the lexicographic minimum value', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		const result = min(iterable);
		expect(result).toBe('a');
	});
});
