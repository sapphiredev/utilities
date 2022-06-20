import { arrayStrictEquals } from '../src';

describe('arrayStrictEquals', () => {
	test('GIVEN same array THEN returns true', () => {
		const arr: unknown[] = [];
		expect(arrayStrictEquals(arr, arr)).toBe(true);
	});

	test('GIVEN cloned array THEN returns true', () => {
		const arr: unknown[] = [];
		const clone = arr.slice();
		expect(arrayStrictEquals(arr, clone)).toBe(true);
	});

	test('GIVEN arrays of same length THEN returns true', () => {
		const arr: number[] = [1];
		const arr2: number[] = [1];

		expect(arrayStrictEquals(arr, arr2)).toBe(true);
	});

	test('GIVEN arrays of different length THEN returns false', () => {
		const arr: number[] = [1];
		const arr2: number[] = [1, 2];

		expect(arrayStrictEquals(arr, arr2)).toBe(false);
	});

	test('GIVEN different arrays THEN returns false', () => {
		const arr: number[] = [1];
		const arr2: number[] = [2];

		expect(arrayStrictEquals(arr, arr2)).toBe(false);
	});

	test('GIVEN array with different types THEN returns false', () => {
		const arr: number[] = [1, 2, 3];
		const arr2: (number | string)[] = [1, 2, '3'];

		expect(arrayStrictEquals(arr, arr2)).toBe(false);
	});

	test('GIVEN array with order THEN returns false', () => {
		const arr: number[] = [3, 1, 2];
		const arr2: number[] = [1, 2, 3];

		expect(arrayStrictEquals(arr, arr2)).toBe(false);
	});
});
