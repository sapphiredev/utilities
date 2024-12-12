import { compress } from '../../src';

describe('compress', () => {
	test('GIVEN iterable and selectors of the same length THEN returns compressed iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const selectors = [true, false, true, false, true];
		const result = [...compress(iterable, selectors)];
		expect(result).toEqual([1, 3, 5]);
	});

	test('GIVEN iterable and selectors with different lengths THEN returns compressed iterable up to the shortest length', () => {
		const iterable = [1, 2, 3, 4, 5];
		const selectors = [true, false];
		const result = [...compress(iterable, selectors)];
		expect(result).toEqual([1]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable: number[] = [];
		const selectors = [true, false, true];
		const result = [...compress(iterable, selectors)];
		expect(result).toEqual([]);
	});

	test('GIVEN empty selectors THEN returns empty iterable', () => {
		const iterable = [1, 2, 3];
		const selectors: boolean[] = [];
		const result = [...compress(iterable, selectors)];
		expect(result).toEqual([]);
	});
});
