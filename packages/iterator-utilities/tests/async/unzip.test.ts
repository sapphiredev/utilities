import { unzip } from '../../src';

describe('unzip', () => {
	test('GIVEN iterable with valid arrays THEN returns unzipped iterables', () => {
		const iterable = [
			[1, 'a'],
			[2, 'b'],
			[3, 'c']
		] as [number, string][];
		const [numbers, letters] = unzip(iterable);
		expect<number[]>(numbers).toEqual([1, 2, 3]);
		expect<string[]>(letters).toEqual(['a', 'b', 'c']);
	});

	test('GIVEN iterable with empty array THEN throws an error', () => {
		const iterable: number[][] = [];
		expect(() => unzip(iterable)).toThrowError('Cannot unzip an empty iterable');
	});

	test('GIVEN iterable with non-array value THEN throws an error', () => {
		const iterable = [1, 2, 3];
		// @ts-expect-error Testing invalid input
		expect(() => unzip(iterable)).toThrowError('Cannot unzip an iterable that does not yield an array');
	});

	test('GIVEN iterable with one non-array value THEN throws an error', () => {
		const iterable = [[1, 'a'], 2, [3, 'c']];
		// @ts-expect-error Testing invalid input
		expect(() => unzip(iterable)).toThrowError('Cannot unzip an iterable that does not yield an array');
	});

	test('GIVEN iterable with arrays of different sizes THEN throws an error', () => {
		const iterable = [
			[1, 'a'],
			[2, 'b', true],
			[3, 'c']
		];
		expect(() => unzip(iterable)).toThrowError('Cannot unzip an iterable that yields arrays of different sizes');
	});
});
