import { max } from '../../src';

describe('max', () => {
	test('GIVEN iterable with numbers THEN returns the lexicographic maximum value', () => {
		const iterable = [1, 5, 3, 2, 4];
		const result = max(iterable);
		expect(result).toBe(5);
	});

	test('GIVEN iterable with negative numbers THEN returns the lexicographic maximum value', () => {
		const iterable = [-1, -5, -3, -2, -4];
		const result = max(iterable);
		expect(result).toBe(-5);
	});

	test('GIVEN iterable with one element THEN returns the element', () => {
		const iterable = [1];
		const result = max(iterable);
		expect(result).toBe(1);
	});

	test('GIVEN empty iterable THEN returns null', () => {
		const iterable: number[] = [];
		const result = max(iterable);
		expect(result).toBeNull();
	});

	test('GIVEN iterable with strings THEN returns the lexicographic maximum value', () => {
		const iterable = ['a', 'e', 'c', 'b', 'd'];
		expect(max(iterable)).toBe('e');
	});
});
