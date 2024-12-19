import { reduce } from '../../src';

describe('reduce', () => {
	test('GIVEN iterable and callback function THEN returns reduced value', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = vi.fn((accumulator: number, currentValue: number) => accumulator + currentValue);
		const result = reduce(iterable, callbackFn);

		expect(result).toEqual(15);
		expect(callbackFn).toHaveBeenCalledTimes(4);
		expect(callbackFn).toHaveBeenCalledWith(1, 2, 1);
		expect(callbackFn).toHaveBeenCalledWith(3, 3, 2);
		expect(callbackFn).toHaveBeenCalledWith(6, 4, 3);
		expect(callbackFn).toHaveBeenCalledWith(10, 5, 4);
	});

	test('GIVEN iterable, callback function, and initial value THEN returns reduced value', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = vi.fn((accumulator: number, currentValue: number) => accumulator + currentValue);
		const initialValue = 10;
		const result = reduce(iterable, callbackFn, initialValue);

		expect(result).toEqual(25);
		expect(callbackFn).toHaveBeenCalledTimes(5);
		expect(callbackFn).toHaveBeenCalledWith(10, 1, 0);
		expect(callbackFn).toHaveBeenCalledWith(11, 2, 1);
		expect(callbackFn).toHaveBeenCalledWith(13, 3, 2);
		expect(callbackFn).toHaveBeenCalledWith(16, 4, 3);
		expect(callbackFn).toHaveBeenCalledWith(20, 5, 4);
	});

	test('GIVEN empty iterable and no initial value THEN throws TypeError', () => {
		const iterable: number[] = [];
		const callbackFn = vi.fn((accumulator: number, currentValue: number) => accumulator + currentValue);

		expect(() => reduce(iterable, callbackFn)).toThrow(new TypeError('Reduce of empty iterator with no initial value'));
		expect(callbackFn).not.toHaveBeenCalled();
	});

	test('GIVEN empty iterable and initial value THEN returns initial value', () => {
		const iterable: number[] = [];
		const callbackFn = vi.fn((accumulator: number, currentValue: number) => accumulator + currentValue);
		const initialValue = 10;
		const result = reduce(iterable, callbackFn, initialValue);

		expect(result).toEqual(10);
		expect(callbackFn).not.toHaveBeenCalled();
	});

	test('GIVEN iterable and invalid callback function THEN throws TypeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = 'invalid' as any;

		expect(() => reduce(iterable, callbackFn)).toThrow(new TypeError('invalid must be a function'));
	});
});
