import { find } from '../../src';

describe('find', () => {
	test('GIVEN iterable with matching element THEN returns the element', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = (element: number) => element % 2 === 0;
		const result = find(iterable, callbackFn);
		expect(result).toBe(2);
	});

	test('GIVEN iterable with no matching element THEN returns undefined', () => {
		const iterable = [1, 3, 5, 7, 9];
		const callbackFn = (element: number) => element % 2 === 0;
		const result = find(iterable, callbackFn);
		expect(result).toBeUndefined();
	});

	test('GIVEN empty iterable THEN returns undefined', () => {
		const iterable: number[] = [];
		const callbackFn = (element: number) => element % 2 === 0;
		const result = find(iterable, callbackFn);
		expect(result).toBeUndefined();
	});

	test('GIVEN iterable and invalid callback function THEN throws TypeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = 'invalid' as any;
		expect(() => find(iterable, callbackFn)).toThrow(new TypeError('invalid must be a function'));
	});
});
