import { some } from '../../src';

describe('some', () => {
	test('GIVEN iterable and callback function that returns true for some elements THEN returns true', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = vi.fn((element: number) => element % 2 === 0);
		const result = some(iterable, callbackFn);

		expect(result).toBe(true);
		expect(callbackFn).toHaveBeenCalledTimes(2);
		expect(callbackFn).toHaveBeenCalledWith(1, 0);
		expect(callbackFn).toHaveBeenCalledWith(2, 1);
	});

	test('GIVEN iterable and callback function that returns false for all elements THEN returns false', () => {
		const iterable = [1, 3, 5, 7, 9];
		const callbackFn = vi.fn((element: number) => element % 2 === 0);
		const result = some(iterable, callbackFn);

		expect(result).toBe(false);
		expect(callbackFn).toHaveBeenCalledTimes(5);
		expect(callbackFn).toHaveBeenCalledWith(1, 0);
		expect(callbackFn).toHaveBeenCalledWith(3, 1);
		expect(callbackFn).toHaveBeenCalledWith(5, 2);
		expect(callbackFn).toHaveBeenCalledWith(7, 3);
		expect(callbackFn).toHaveBeenCalledWith(9, 4);
	});

	test('GIVEN empty iterable THEN returns false', () => {
		const iterable: number[] = [];
		const callbackFn = vi.fn((element: number) => element % 2 === 0);
		const result = some(iterable, callbackFn);

		expect(result).toBe(false);
		expect(callbackFn).not.toHaveBeenCalled();
	});

	test('GIVEN iterable and invalid callback function THEN throws TypeError', () => {
		const iterable = [1, 2, 3];
		const callbackFn = 'invalid' as any;
		expect(() => some(iterable, callbackFn)).toThrow(new TypeError('invalid must be a function'));
	});
});
