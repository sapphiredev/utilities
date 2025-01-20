import { objectValues } from '../src';

describe('objectValues', () => {
	test('GIVEN basic readonly THEN returns expected', () => {
		const source = { a: 'Hello', b: 420 } as const;
		const expected = ['Hello', 420];

		expect<('Hello' | 420)[]>(objectValues(source)).toEqual(expected);
	});

	test('GIVEN deep readonly THEN returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } } as const;
		const expected = ['Hello', 420, { i: [] }];

		expect<('Hello' | 420 | { i: readonly [] })[]>(objectValues(source)).toEqual(expected);
	});

	test('GIVEN array readonly THEN returns same', () => {
		const source = ['Hello', 420] as const;

		expect<('Hello' | 420)[]>(objectValues(source)).toEqual(source);
	});

	test('GIVEN basic THEN returns expected', () => {
		const source = { a: 'Hello', b: 420 };
		const expected = ['Hello', 420];

		expect<(string | number)[]>(objectValues(source)).toEqual(expected);
	});

	test('GIVEN deep THEN returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } };
		const expected = ['Hello', 420, { i: [] }];

		expect<(string | number | { i: never[] })[]>(objectValues(source)).toEqual(expected);
	});

	test('GIVEN array THEN returns same', () => {
		const source = ['Hello', 420];

		expect<(string | number)[]>(objectValues(source)).toEqual(source);
	});
});
