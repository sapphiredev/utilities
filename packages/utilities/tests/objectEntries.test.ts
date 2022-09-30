import { objectEntries } from '../src';

describe('objectEntries', () => {
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
