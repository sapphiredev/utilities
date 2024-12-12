import { every } from '../../src';

describe('every', () => {
	test('GIVEN iterable and callback function that returns true for all elements THEN returns true', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = (element: number) => element > 0;
		const result = every(iterable, callbackFn);
		expect(result).toBe(true);
	});

	test('GIVEN iterable and callback function that returns false for at least one element THEN returns false', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = (element: number) => element > 3;
		const result = every(iterable, callbackFn);
		expect(result).toBe(false);
	});

	test('GIVEN empty iterable THEN returns true', () => {
		const iterable: number[] = [];
		const callbackFn = (element: number) => element > 0;
		const result = every(iterable, callbackFn);
		expect(result).toBe(true);
	});

	test('GIVEN iterable and invalid callback function THEN throws TypeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = 'invalid' as any;
		expect(() => every(iterable, callbackFn)).toThrow(new TypeError('invalid must be a function'));
	});
});
