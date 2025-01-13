import { range } from '../../src';

describe('range', () => {
	test('GIVEN start and end THEN returns range from start to end', () => {
		const start = 1;
		const end = 5;
		const result = [...range(start, end)];
		expect(result).toEqual([1, 2, 3, 4]);
	});

	test('GIVEN start greater than end THEN returns empty iterable', () => {
		const start = 5;
		const end = 1;
		const result = [...range(start, end)];
		expect(result).toEqual([5, 4, 3, 2]);
	});

	test('GIVEN start equal to end THEN returns single-element iterable', () => {
		const start = 5;
		const end = 5;
		const result = [...range(start, end)];
		expect(result).toEqual([]);
	});

	test('GIVEN start, end, and step THEN returns range with step', () => {
		const start = 1;
		const end = 5;
		const step = 2;
		const result = [...range(start, end, step)];
		expect(result).toEqual([1, 3]);
	});

	test('GIVEN start, end, and negative step THEN returns range with negative step', () => {
		const start = 5;
		const end = 1;
		const step = -2;
		const result = [...range(start, end, step)];
		expect(result).toEqual([5, 3]);
	});

	test('GIVEN start, end, and zero step THEN throws RangeError', () => {
		const start = 1;
		const end = 5;
		const step = 0;
		expect(() => [...range(start, end, step)]).toThrow(new RangeError('Step cannot be zero'));
	});

	test('GIVEN start greater than end and positive step THEN throws RangeError', () => {
		const start = 5;
		const end = 1;
		const step = 1;
		expect(() => [...range(start, end, step)]).toThrow(new RangeError('Start must be less than end when step is positive'));
	});

	test('GIVEN start less than end and negative step THEN throws RangeError', () => {
		const start = 1;
		const end = 5;
		const step = -1;
		expect(() => [...range(start, end, step)]).toThrow(new RangeError('Start must be greater than end when step is negative'));
	});

	test('GIVEN start, end, and NaN step THEN throws RangeError', () => {
		const start = 1;
		const end = 5;
		const step = NaN;
		expect(() => [...range(start, end, step)]).toThrow(new RangeError('NaN must be a non-NaN number'));
	});
});
