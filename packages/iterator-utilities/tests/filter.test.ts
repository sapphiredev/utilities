import { filter } from '../src';

describe('filter', () => {
	test('GIVEN iterable and callback function THEN returns filtered iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = (element: number) => element % 2 === 0;
		const result = [...filter(iterable, callbackFn)];
		expect(result).toEqual([2, 4]);
	});

	test('GIVEN iterable and callback function THEN returns empty iterable if no elements match the condition', () => {
		const iterable = [1, 3, 5, 7, 9];
		const callbackFn = (element: number) => element % 2 === 0;
		const result = [...filter(iterable, callbackFn)];
		expect(result).toEqual([]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable: number[] = [];
		const callbackFn = (element: number) => element % 2 === 0;
		const result = [...filter(iterable, callbackFn)];
		expect(result).toEqual([]);
	});

	test('GIVEN iterable and invalid callback function THEN throws TypeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = 'invalid' as any;
		expect(() => [...filter(iterable, callbackFn)]).toThrow(new TypeError('invalid must be a function'));
	});
});
