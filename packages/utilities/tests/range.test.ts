import { range } from '../src';

describe('range', () => {
	test('GIVEN positive min,max,step THEN returns range array', () => {
		expect(range(1, 3, 1)).toEqual([1, 2, 3]);
	});

	test('GIVEN positive min,max negative step THEN returns empty array', () => {
		expect(range(1, 3, -2)).toEqual([]);
	});

	test('GIVEN negative min positive max,step THEN returns range array', () => {
		expect(range(-1, 3, 2)).toEqual([-1, 1, 3]);
	});

	test('GIVEN negative min,max,step THEN returns negative range array', () => {
		expect(range(-1, -3, -1)).toEqual([-1, -2, -3]);
	});

	test('GIVEN negative min,max positive step THEN throws error', () => {
		expect(() => range(-1, -3, 1)).toThrowError(new RangeError('Invalid array length'));
	});

	test('GIVEN negative min (lower than max),max positive step THEN gives negative range', () => {
		expect(range(-3, -1, 1)).toEqual([-3, -2, -1]);
	});
});
