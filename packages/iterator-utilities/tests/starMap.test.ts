import { starMap } from '../src';

describe('starMap', () => {
	test('GIVEN iterable and callback function THEN returns mapped iterable', () => {
		const iterable = [
			[1, 2],
			[3, 4],
			[5, 6]
		] as [number, number][];
		const callbackFn = vi.fn((a: number, b: number) => a + b);
		const result = [...starMap(iterable, callbackFn)];

		expect(result).toEqual([3, 7, 11]);
		expect(callbackFn).toHaveBeenCalledTimes(3);
		expect(callbackFn).toHaveBeenCalledWith(1, 2);
		expect(callbackFn).toHaveBeenCalledWith(3, 4);
		expect(callbackFn).toHaveBeenCalledWith(5, 6);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable = [] as [number, number][];
		const callbackFn = vi.fn((a: number, b: number) => a + b);
		const result = [...starMap(iterable, callbackFn)];

		expect(result).toEqual([]);
		expect(callbackFn).not.toHaveBeenCalled();
	});

	test('GIVEN iterable with non-array values THEN throws TypeError', () => {
		const iterable = [[1, 2], [3, 4], 5] as [number, number][];
		const callbackFn = vi.fn((a: number, b: number) => a + b);

		expect(() => [...starMap(iterable, callbackFn)]).toThrow(TypeError);
		expect(callbackFn).toHaveBeenCalledTimes(2);
		expect(callbackFn).toHaveBeenCalledWith(1, 2);
		expect(callbackFn).toHaveBeenCalledWith(3, 4);
	});

	test('GIVEN iterable and invalid callback function THEN throws TypeError', () => {
		const iterable = [
			[1, 2],
			[3, 4]
		] as [number, number][];
		const callbackFn = 'invalid' as any;
		expect(() => [...starMap(iterable, callbackFn)]).toThrow(new TypeError('invalid must be a function'));
	});
});
