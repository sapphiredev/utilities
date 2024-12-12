import { take } from '../../src';

describe('take', () => {
	test('GIVEN iterable and limit greater than iterable length THEN returns entire iterable', () => {
		const iterable = [1, 2, 3];
		const limit = 5;
		const result = [...take(iterable, limit)];
		expect(result).toEqual([1, 2, 3]);
	});

	test('GIVEN iterable and limit equal to iterable length THEN returns entire iterable', () => {
		const iterable = [1, 2, 3];
		const limit = 3;
		const result = [...take(iterable, limit)];
		expect(result).toEqual([1, 2, 3]);
	});

	test('GIVEN iterable and limit less than iterable length THEN returns limited iterable', () => {
		const iterable = [1, 2, 3];
		const limit = 2;
		const result = [...take(iterable, limit)];
		expect(result).toEqual([1, 2]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable: number[] = [];
		const limit = 5;
		const result = [...take(iterable, limit)];
		expect(result).toEqual([]);
	});

	test('GIVEN iterable and limit equal to 0 THEN returns empty iterable', () => {
		const iterable = [1, 2, 3];
		const limit = 0;
		const result = [...take(iterable, limit)];
		expect(result).toEqual([]);
	});

	test('GIVEN iterable and limit less than 0 THEN throws RangeError', () => {
		const iterable = [1, 2, 3];
		const limit = -1;
		expect(() => take(iterable, limit)).toThrowError(new RangeError('-1 must be a non-negative number'));
	});
});
