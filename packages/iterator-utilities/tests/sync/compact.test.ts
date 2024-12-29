import { compact } from '../../src';

describe('compact', () => {
	test('GIVEN iterable with null and undefined values THEN returns iterable without null and undefined values', () => {
		const iterable = [1, null, 2, undefined, 3];
		const result = [...compact(iterable)];
		expect(result).toEqual([1, 2, 3]);
	});

	test('GIVEN iterable with no null or undefined values THEN returns the same iterable', () => {
		const iterable = [1, 2, 3];
		const result = [...compact(iterable)];
		expect(result).toEqual([1, 2, 3]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable: number[] = [];
		const result = [...compact(iterable)];
		expect(result).toEqual([]);
	});
});
