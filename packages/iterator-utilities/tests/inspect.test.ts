import { inspect, toArray } from '../src';

describe('inspect', () => {
	test('GIVEN an iterable THEN returns a passthrough iterable of the original', () => {
		const iterable = [1, 4, 2, 3];
		const fn = vi.fn();

		const result = inspect(iterable, fn);
		expect<number[]>(toArray(result)).toEqual([1, 4, 2, 3]);
		expect(fn).toHaveBeenNthCalledWith(1, 1, 0);
		expect(fn).toHaveBeenNthCalledWith(2, 4, 1);
		expect(fn).toHaveBeenNthCalledWith(3, 2, 2);
		expect(fn).toHaveBeenNthCalledWith(4, 3, 3);
	});
});
