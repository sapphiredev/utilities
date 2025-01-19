import { chunk } from '../src';

describe('chunk', () => {
	test('GIVEN iterable and chunk size THEN returns iterable of chunks', () => {
		const iterable = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		const chunkSize = 3;
		const result = [...chunk(iterable, chunkSize)];
		expect(result).toEqual([
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9]
		]);
	});

	test('GIVEN iterable and chunk size greater than length THEN returns iterable with single chunk', () => {
		const iterable = [1, 2, 3];
		const chunkSize = 10;
		const result = [...chunk(iterable, chunkSize)];
		expect(result).toEqual([[1, 2, 3]]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable: number[] = [];
		const chunkSize = 3;
		const result = [...chunk(iterable, chunkSize)];
		expect(result).toEqual([]);
	});

	test('GIVEN iterable and chunk size zero THEN throws RangeError', () => {
		const iterable = [1, 2, 3];
		const chunkSize = 0;
		expect(() => [...chunk(iterable, chunkSize)]).toThrowError(new RangeError('0 must be a positive number'));
	});

	test('GIVEN iterable and negative chunk size THEN throws RangeError', () => {
		const iterable = [1, 2, 3];
		const chunkSize = -1;
		expect(() => [...chunk(iterable, chunkSize)]).toThrowError(new RangeError('-1 must be a positive number'));
	});

	test('GIVEN iterable and NaN chunk size THEN throws RangeError', () => {
		const iterable = [1, 2, 3];
		const chunkSize = NaN;
		expect(() => [...chunk(iterable, chunkSize)]).toThrowError(new RangeError('NaN must be a non-NaN number'));
	});

	test('GIVEN iterable and Infinity chunk size THEN throws RangeError', () => {
		const iterable = [1, 2, 3];
		const chunkSize = Number.POSITIVE_INFINITY;
		expect(() => [...chunk(iterable, chunkSize)]).toThrowError(new RangeError('+Infinity cannot be represented as an integer'));
	});

	test('GIVEN iterable and -Infinity chunk size THEN throws RangeError', () => {
		const iterable = [1, 2, 3];
		const chunkSize = Number.NEGATIVE_INFINITY;
		expect(() => [...chunk(iterable, chunkSize)]).toThrowError(new RangeError('-Infinity cannot be represented as an integer'));
	});
});
