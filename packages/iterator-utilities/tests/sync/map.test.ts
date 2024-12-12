import { map } from '../../src';

describe('map', () => {
	test('GIVEN iterable and callback function THEN returns mapped iterable', () => {
		const iterable = [1, 2, 3];
		const callbackFn = (element: number) => element * 2;
		const result = [...map(iterable, callbackFn)];
		expect(result).toEqual([2, 4, 6]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable: number[] = [];
		const callbackFn = (element: number) => element * 2;
		const result = [...map(iterable, callbackFn)];
		expect(result).toEqual([]);
	});

	test('GIVEN iterable and callback function with index THEN returns mapped iterable with index', () => {
		const iterable = [1, 2, 3];
		const callbackFn = (element: number, index: number) => element + index;
		const result = [...map(iterable, callbackFn)];
		expect(result).toEqual([1, 3, 5]);
	});

	test('GIVEN iterable and invalid callback function THEN throws TypeError', () => {
		const iterable = [1, 2, 3];
		const callbackFn = 'invalid' as any;
		expect(() => [...map(iterable, callbackFn)]).toThrow(new TypeError('invalid must be a function'));
	});
});
