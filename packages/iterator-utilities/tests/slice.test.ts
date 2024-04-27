import { slice } from '../src';

describe('slice', () => {
	test('GIVEN iterable THEN returns full iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable)];
		expect(result).toEqual([1, 2, 3, 4, 5]);
	});

	test('GIVEN iterable and start index THEN returns sliced iterable from start index to end', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 2)];
		expect(result).toEqual([3, 4, 5]);
	});

	test('GIVEN iterable and negative infinity start index THEN returns full iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, Number.NEGATIVE_INFINITY)];
		expect(result).toEqual([1, 2, 3, 4, 5]);
	});

	test('GIVEN iterable and negative infinity start index THEN returns full iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, Number.POSITIVE_INFINITY)];
		expect(result).toEqual([]);
	});

	test('GIVEN iterable, start index, and end index THEN returns sliced iterable from start index to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 1, 4)];
		expect(result).toEqual([2, 3, 4]);
	});

	test('GIVEN iterable, bigger positive start index than end index THEN returns empty iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 4, 1)];
		expect(result).toEqual([]);
	});

	test('GIVEN iterable, zero start index, and negative end index THEN returns sliced iterable from start to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 0, -1)];
		expect(result).toEqual([1, 2, 3, 4]);
	});

	test('GIVEN iterable, start index, and negative end index THEN returns sliced iterable from start to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 1, -1)];
		expect(result).toEqual([2, 3, 4]);
	});

	test('GIVEN iterable, start index, and negative infinity end index THEN returns sliced iterable from start to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 1, Number.NEGATIVE_INFINITY)];
		expect(result).toEqual([]);
	});

	test('GIVEN iterable, zero start index, and positive infinity end index THEN returns sliced iterable from start to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 0, Number.POSITIVE_INFINITY)];
		expect(result).toEqual([1, 2, 3, 4, 5]);
	});

	test('GIVEN iterable, start index, and positive infinity end index THEN returns sliced iterable from start to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, 1, Number.POSITIVE_INFINITY)];
		expect(result).toEqual([2, 3, 4, 5]);
	});

	test('GIVEN iterable and negative start index THEN returns sliced iterable from end index to end', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, -3)];
		expect(result).toEqual([3, 4, 5]);
	});

	test('GIVEN iterable, negative start index, and negative end index THEN returns sliced iterable from end index to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, -4, -1)];
		expect(result).toEqual([2, 3, 4]);
	});

	test('GIVEN iterable, bigger negative start index than negative end index THEN returns sliced iterable from end index to end index', () => {
		const iterable = [1, 2, 3, 4, 5];
		const result = [...slice(iterable, -1, -4)];
		expect(result).toEqual([]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable: number[] = [];
		const result = [...slice(iterable)];
		expect(result).toEqual([]);
	});
});
