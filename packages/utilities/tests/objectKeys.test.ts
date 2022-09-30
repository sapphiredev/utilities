import { objectKeys } from '../src';

describe('objectKeys', () => {
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
