import { objectKeys } from '../src';

describe('objectKeys', () => {
	test('GIVEN basic readonly THEN returns expected', () => {
		const source = { a: 'Hello', b: 420 } as const;
		const expected = ['a', 'b'];

		expect<('a' | 'b')[]>(objectKeys(source)).toEqual(expected);
	});

	test('GIVEN deep readonly THEN returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } } as const;
		const expected = ['a', 'b', 'deep'];

		expect<('a' | 'b' | 'deep')[]>(objectKeys(source)).toEqual(expected);
	});

	test('GIVEN basic THEN returns expected', () => {
		const source = { a: 'Hello', b: 420 };
		const expected = ['a', 'b'];

		expect(objectKeys(source)).toEqual(expected);
	});

	test('GIVEN deep THEN returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } };
		const expected = ['a', 'b', 'deep'];

		expect(objectKeys(source)).toEqual(expected);
	});
});
