import { dropWhile } from '../src';

describe('dropWhile', () => {
	test('GIVEN iterable and callback function THEN returns iterable with dropped elements', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = (element: number) => element < 3;
		const result = [...dropWhile(iterable, callbackFn)];
		expect(result).toEqual([3, 4, 5]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable: number[] = [];
		const callbackFn = (element: number) => element < 3;
		const result = [...dropWhile(iterable, callbackFn)];
		expect(result).toEqual([]);
	});

	test('GIVEN iterable and callback function that always returns true THEN returns empty iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = () => true;
		const result = [...dropWhile(iterable, callbackFn)];
		expect(result).toEqual([]);
	});

	test('GIVEN iterable and callback function that always returns false THEN returns original iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = () => false;
		const result = [...dropWhile(iterable, callbackFn)];
		expect(result).toEqual(iterable);
	});

	test('GIVEN iterable and invalid callback function THEN throws TypeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const callbackFn = 'invalid' as any;
		expect(() => [...dropWhile(iterable, callbackFn)]).toThrow(new TypeError('invalid must be a function'));
	});
});
