import { forEach } from '../src';

describe('forEach', () => {
	test('GIVEN iterable and callback function THEN calls the callback function for each element', () => {
		const iterable = [1, 2, 3];
		const callbackFn = vi.fn();
		forEach(iterable, callbackFn);
		expect(callbackFn).toHaveBeenCalledTimes(3);
		expect(callbackFn).toHaveBeenCalledWith(1, 0);
		expect(callbackFn).toHaveBeenCalledWith(2, 1);
		expect(callbackFn).toHaveBeenCalledWith(3, 2);
	});

	test('GIVEN empty iterable THEN does not call the callback function', () => {
		const iterable: number[] = [];
		const callbackFn = vi.fn();
		forEach(iterable, callbackFn);
		expect(callbackFn).not.toHaveBeenCalled();
	});

	test('GIVEN iterable and invalid callback function THEN throws TypeError', () => {
		const iterable = [1, 2, 3];
		const callbackFn = 'invalid' as any;
		expect(() => forEach(iterable, callbackFn)).toThrow(new TypeError('invalid must be a function'));
	});
});
