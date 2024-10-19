import { intersperse, toArray } from '../src';

describe('intersperse', () => {
	test('GIVEN an iterable THEN returns a new iterable with the separator in between', () => {
		const iterable = [0, 1, 2];

		const result = intersperse(iterable, 100);
		expect<number[]>(toArray(result)).toEqual([0, 100, 1, 100, 2]);
	});

	test('GIVEN an iterable of strings THEN returns a new iterable with the separator in between', () => {
		const iterable = ['Hello', 'World', '!'];

		const result = intersperse(iterable, ', ');
		expect<string>(toArray(result).join('')).toEqual('Hello, World, !');
	});
});
