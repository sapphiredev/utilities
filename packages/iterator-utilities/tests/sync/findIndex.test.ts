import { findIndex } from '../../src';

describe('findIndex', () => {
	test('GIVEN iterable and callback function that returns true for an element THEN returns the index of the element', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = (element: number) => element === 3;
		const result = findIndex(iterable, callbackFn);
		expect(result).toBe(2);
	});

	test('GIVEN iterable and callback function that returns true for multiple elements THEN returns the index of the first matching element', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = (element: number) => element > 2;
		const result = findIndex(iterable, callbackFn);
		expect(result).toBe(2);
	});

	test('GIVEN iterable and callback function that returns false for all elements THEN returns -1', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = (element: number) => element > 5;
		const result = findIndex(iterable, callbackFn);
		expect(result).toBe(-1);
	});

	test('GIVEN empty iterable THEN returns -1', () => {
		const iterable: number[] = [];
		const callbackFn = (element: number) => element === 1;
		const result = findIndex(iterable, callbackFn);
		expect(result).toBe(-1);
	});

	test('GIVEN iterable and invalid callback function THEN throws TypeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = 'invalid' as any;
		expect(() => findIndex(iterable, callbackFn)).toThrow(new TypeError('invalid must be a function'));
	});
});
