import { dropLast } from '../../src';

describe('dropLast', () => {
	test('GIVEN iterable and count less than or equal to iterable length THEN returns empty iterable', () => {
		const iterable = [1, 2, 3];
		const count = 3;
		const result = [...dropLast(iterable, count)];
		expect(result).toEqual([]);
	});

	test('GIVEN iterable and count greater than iterable length THEN returns iterable without last elements', () => {
		const iterable = [1, 2, 3];
		const count = 2;
		const result = [...dropLast(iterable, count)];
		expect(result).toEqual([1]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable: number[] = [];
		const count = 2;
		const result = [...dropLast(iterable, count)];
		expect(result).toEqual([]);
	});

	test('GIVEN negative count THEN throws RangeError', () => {
		const iterable = [1, 2, 3];
		const count = -1;
		expect(() => [...dropLast(iterable, count)]).toThrow(new RangeError('-1 must be a non-negative number'));
	});
});
