import { flatMap } from '../src';

describe('flatMap', () => {
	test('GIVEN iterable and callback function THEN returns flattened iterable', () => {
		const iterable = [1, 2, 3];
		const callback = (element: number) => [element, element * 2];
		const result = [...flatMap(iterable, callback)];
		expect(result).toEqual([1, 2, 2, 4, 3, 6]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable: number[] = [];
		const callback = (element: number) => [element, element * 2];
		const result = [...flatMap(iterable, callback)];
		expect(result).toEqual([]);
	});

	test('GIVEN iterable with nested arrays THEN returns flattened iterable', () => {
		const iterable = [
			[1, 2],
			[3, 4],
			[5, 6]
		];
		const callback = (element: number[]) => element;
		const result = [...flatMap(iterable, callback)];
		expect(result).toEqual([1, 2, 3, 4, 5, 6]);
	});

	test('GIVEN iterable with nested arrays and callback function that returns empty arrays THEN returns empty iterable', () => {
		const iterable = [
			[1, 2],
			[3, 4],
			[5, 6]
		];
		const callback = () => [];
		const result = [...flatMap(iterable, callback)];
		expect(result).toEqual([]);
	});

	test('GIVEN iterable and invalid callback function THEN throws TypeError', () => {
		const iterable = [1, 2, 3];
		const callback = 'invalid' as any;
		expect(() => [...flatMap(iterable, callback)]).toThrow(new TypeError('invalid must be a function'));
	});
});
