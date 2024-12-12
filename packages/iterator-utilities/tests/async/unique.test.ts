import { unique } from '../../src';

describe('unique', () => {
	test('GIVEN iterable with duplicates THEN returns iterable with duplicates removed', () => {
		const iterable = [1, 2, 2, 3, 3, 3];
		const result = [...unique(iterable)];
		expect<number[]>(result).toEqual([1, 2, 3]);
	});

	test('GIVEN iterable without duplicates THEN returns iterable as is', () => {
		const iterable = [1, 2, 3];
		const result = [...unique(iterable)];
		expect<number[]>(result).toEqual([1, 2, 3]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable = [] as number[];
		const result = [...unique(iterable)];
		expect<number[]>(result).toEqual([]);
	});
});
