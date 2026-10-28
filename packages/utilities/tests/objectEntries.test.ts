import { objectEntries } from '../src';

describe('objectEntries', () => {
	test('GIVEN basic readonly THEN returns expected', () => {
		const source = { a: 'Hello', b: 420 } as const;
		const expected = [
			['a', 'Hello'],
			['b', 420]
		];

		expect<['a' | 'b', 'Hello' | 420][]>(objectEntries(source)).toEqual(expected);
	});

	test('GIVEN deep readonly THEN returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } } as const;
		const expected = [
			['a', 'Hello'],
			['b', 420],
			['deep', { i: [] }]
		];

		expect<['a' | 'b' | 'deep', 'Hello' | 420 | { i: readonly [] }][]>(objectEntries(source)).toEqual(expected);
	});

	test('GIVEN array readonly THEN returns expected', () => {
		const source = ['Hello', 420] as const;
		const expected = [
			['0', 'Hello'],
			['1', 420]
		];

		expect<[`${number}`, 'Hello' | 420][]>(objectEntries(source)).toEqual(expected);
	});

	test('GIVEN basic THEN returns expected', () => {
		const source = { a: 'Hello', b: 420 };
		const expected = [
			['a', 'Hello'],
			['b', 420]
		];

		expect<['a' | 'b', number | string][]>(objectEntries(source)).toEqual(expected);
	});

	test('GIVEN deep THEN returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } };
		const expected = [
			['a', 'Hello'],
			['b', 420],
			['deep', { i: [] }]
		];

		expect<['a' | 'b' | 'deep', number | string | { i: never[] }][]>(objectEntries(source)).toEqual(expected);
	});

	test('GIVEN array THEN returns expected', () => {
		const source = ['Hello', 420];
		const expected = [
			['0', 'Hello'],
			['1', 420]
		];

		expect<[`${number}`, number | string][]>(objectEntries(source)).toEqual(expected);
	});
});
