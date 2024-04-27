import { indexOf } from '../src';

describe('indexOf', () => {
	test('GIVEN iterable and value that exists in the iterable THEN returns the index of the value', () => {
		const iterable = [1, 2, 3, 4, 5];
		const value = 3;
		const result = indexOf(iterable, value);
		expect(result).toBe(2);
	});

	test('GIVEN iterable and value that does not exist in the iterable THEN returns -1', () => {
		const iterable = [1, 2, 3, 4, 5];
		const value = 6;
		const result = indexOf(iterable, value);
		expect(result).toBe(-1);
	});

	test('GIVEN empty iterable THEN returns -1', () => {
		const iterable: number[] = [];
		const value = 1;
		const result = indexOf(iterable, value);
		expect(result).toBe(-1);
	});
});
