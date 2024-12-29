import { starMap } from '../../src';

describe('starMap', () => {
	test('GIVEN iterable and callback function THEN returns mapped iterable', () => {
		const iterable = [
			[1, 2],
			[3, 4],
			[5, 6]
		] as [number, number][];
		const callbackFn = vi.fn((a: number, b: number) => a + b);
		const result = [...starMap(iterable, callbackFn)];

		expect<number[]>(result).toEqual([3, 7, 11]);
		expect(callbackFn).toHaveBeenCalledTimes(3);
		expect(callbackFn).toHaveBeenCalledWith(1, 2);
		expect(callbackFn).toHaveBeenCalledWith(3, 4);
		expect(callbackFn).toHaveBeenCalledWith(5, 6);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable = [] as [number, number][];
		const callbackFn = vi.fn((a: number, b: number) => a + b);
		const result = [...starMap(iterable, callbackFn)];

		expect<number[]>(result).toEqual([]);
		expect(callbackFn).not.toHaveBeenCalled();
	});

	test('GIVEN iterable with mixed types THEN resolves types correctly', () => {
		const iterable = [
			[1, 'foo'],
			[2, 'bar'],
			[3, 'baz']
		] as [number, string][];
		const callbackFn = vi.fn((a: number, b: string) => b.repeat(a));
		const result = [...starMap(iterable, callbackFn)];

		expect<string[]>(result).toEqual(['foo', 'barbar', 'bazbazbaz']);
		expect(callbackFn).toHaveBeenCalledTimes(3);
	});

	test('GIVEN iterable with iterables THEN returns mapped iterable', () => {
		const iterable = [[1, 2].values(), [3, 4].values(), [5, 6].values()];
		const callbackFn = vi.fn((a: number, b: number) => a + b);
		const result = [...starMap(iterable, callbackFn)];

		expect<number[]>(result).toEqual([3, 7, 11]);
		expect(callbackFn).toHaveBeenCalledTimes(3);
	});

	test('GIVEN iterable with non-iterable values THEN throws TypeError', () => {
		const iterable = [[1, 2], [3, 4], 5] as [number, number][];
		const callbackFn = vi.fn((a: number, b: number) => a + b);

		expect(() => [...starMap(iterable, callbackFn)]).toThrow(new TypeError('5 cannot be converted to an iterable'));
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
