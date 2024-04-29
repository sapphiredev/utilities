import { empty } from '../src';

describe('empty', () => {
	test('GIVEN empty iterable THEN returns an empty iterable', () => {
		const result = [...empty()];
		expect<never[]>(result).toEqual([]);
	});

	test('GIVEN empty iterable with specified element type THEN returns an empty iterable of that type', () => {
		const result = [...empty<number>()];
		expect<number[]>(result).toEqual([]);
	});

	test('GIVEN empty iterable with specified element type THEN returns an empty iterable of that type', () => {
		const result = [...empty<string>()];
		expect<string[]>(result).toEqual([]);
	});
});
