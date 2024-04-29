import { contains } from '../src';

describe('contains', () => {
	test('GIVEN iterable containing the value THEN returns true', () => {
		const iterable = [1, 2, 3];
		const value = 2;
		const result = contains(iterable, value);
		expect(result).toBe(true);
	});

	test('GIVEN iterable not containing the value THEN returns false', () => {
		const iterable = [1, 2, 3];
		const value = 4;
		const result = contains(iterable, value);
		expect(result).toBe(false);
	});

	test('GIVEN empty iterable THEN returns false', () => {
		const iterable: number[] = [];
		const value = 1;
		const result = contains(iterable, value);
		expect(result).toBe(false);
	});
});
