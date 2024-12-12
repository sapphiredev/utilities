import { ascNumber, defaultCompare, descNumber, descString, maxByKey } from '../../src';

describe('maxByKey', () => {
	test('GIVEN iterable with positive numbers by ascending string and asc comparator THEN returns the lexicographic maximum value', () => {
		const callbackFn = vi.fn((x: number) => x.toString());
		const iterable = [1, 5, 3, 2, 4];

		const result = maxByKey(iterable, callbackFn);
		expect(result).toBe(5);

		expect(callbackFn).toHaveBeenCalledTimes(5);
		expect(callbackFn).toHaveBeenNthCalledWith(1, 1, 0);
		expect(callbackFn).toHaveBeenNthCalledWith(2, 5, 1);
		expect(callbackFn).toHaveBeenNthCalledWith(3, 3, 2);
		expect(callbackFn).toHaveBeenNthCalledWith(4, 2, 3);
		expect(callbackFn).toHaveBeenNthCalledWith(5, 4, 4);
	});

	test('GIVEN iterable with negative numbers by descending string and desc comparator THEN returns the lexicographic maximum value', () => {
		const callbackFn = vi.fn((x: number) => x.toString());
		const comparator = vi.fn(descString);
		const iterable = [-2, -5, -3, -1, -4];

		const result = maxByKey(iterable, callbackFn, comparator);
		expect(result).toBe(-1);
		expect(callbackFn).toHaveBeenCalledTimes(5);

		expect(comparator).toHaveBeenCalledTimes(4);
		expect(comparator).toHaveBeenNthCalledWith(1, '-2', '-5');
		expect(comparator).toHaveBeenNthCalledWith(2, '-2', '-3');
		expect(comparator).toHaveBeenNthCalledWith(3, '-2', '-1');
		expect(comparator).toHaveBeenNthCalledWith(4, '-1', '-4');
	});

	test('GIVEN iterable with positive numbers by ascending number and asc comparator THEN returns the maximum value', () => {
		const callbackFn = vi.fn((x: number) => x * x);
		const comparator = vi.fn(ascNumber);
		const iterable = [1, 5, 3, 2, 4];

		const result = maxByKey(iterable, callbackFn, comparator);
		expect(result).toBe(5);
		expect(callbackFn).toHaveBeenCalledTimes(5);

		expect(comparator).toHaveBeenCalledTimes(4);
		expect(comparator).toHaveBeenNthCalledWith(1, 1, 25);
		expect(comparator).toHaveBeenNthCalledWith(2, 25, 9);
		expect(comparator).toHaveBeenNthCalledWith(3, 25, 4);
		expect(comparator).toHaveBeenNthCalledWith(4, 25, 16);
	});

	test('GIVEN iterable with negative numbers by descending number and desc comparator THEN returns the maximum value', () => {
		const callbackFn = vi.fn((x: number) => x * x);
		const comparator = vi.fn(descNumber);
		const iterable = [-1, -5, -3, -2, -4];

		const result = maxByKey(iterable, callbackFn, comparator);
		expect(result).toBe(-1);
		expect(callbackFn).toHaveBeenCalledTimes(5);

		expect(comparator).toHaveBeenCalledTimes(4);
		expect(comparator).toHaveBeenNthCalledWith(1, 1, 25);
		expect(comparator).toHaveBeenNthCalledWith(2, 1, 9);
		expect(comparator).toHaveBeenNthCalledWith(3, 1, 4);
		expect(comparator).toHaveBeenNthCalledWith(4, 1, 16);
	});

	test('GIVEN iterable with one element THEN returns the element', () => {
		const callbackFn = vi.fn((x: number) => x.toString());
		const comparator = vi.fn(defaultCompare);
		const iterable = [1];

		const result = maxByKey(iterable, callbackFn, comparator);
		expect(result).toBe(1);
		expect(callbackFn).toHaveBeenCalledTimes(1);
		expect(comparator).not.toHaveBeenCalled();
	});

	test('GIVEN empty iterable THEN returns null', () => {
		const callbackFn = vi.fn((x: number) => x.toString());
		const comparator = vi.fn(defaultCompare);
		const iterable: number[] = [];

		const result = maxByKey(iterable, callbackFn, comparator);
		expect(result).toBeNull();
		expect(callbackFn).not.toHaveBeenCalled();
		expect(comparator).not.toHaveBeenCalled();
	});

	test('GIVEN iterable with strings and asc comparator THEN then returns the lexicographic maximum value', () => {
		const callbackFn = vi.fn((x: string) => x.repeat(2));
		const comparator = vi.fn(defaultCompare);
		const iterable = ['a', 'e', 'c', 'b', 'd'];

		const result = maxByKey(iterable, callbackFn, comparator);
		expect(result).toBe('e');
	});
});
