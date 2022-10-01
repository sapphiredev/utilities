import { objectEntries } from '../src';

describe('objectEntries', () => {
	test('GIVEN basic readonly THEN returns expected', () => {
		const source = { a: 'Hello', b: 420 } as const;
		const expected = [
			['a', 'Hello'],
			['b', 420]
		] as [string, unknown][];

		expect<['a' | 'b', 'Hello' | 420][]>(objectEntries(source)).toEqual(expected);
	});

	test('GIVEN deep readonly THEN returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } } as const;
		const expected = [
			['a', 'Hello'],
			['b', 420],
			['deep', { i: [] }]
		] as [string, unknown][];

		expect<['a' | 'b' | 'deep', 'Hello' | 420 | { i: readonly [] }][]>(objectEntries(source)).toEqual(expected);
	});

	test('GIVEN basic THEN returns expected', () => {
		const source = { a: 'Hello', b: 420 };
		const expected = [
			['a', 'Hello'],
			['b', 420]
		] as [string, unknown][];

		expect(objectEntries(source)).toEqual(expected);
	});

	test('GIVEN deep THEN returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } };
		const expected = [
			['a', 'Hello'],
			['b', 420],
			['deep', { i: [] }]
		] as [string, unknown][];

		expect(objectEntries(source)).toEqual(expected);
	});
});
