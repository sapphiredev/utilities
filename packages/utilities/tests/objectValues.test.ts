import { objectValues } from '../src';

describe('objectValues', () => {
	test('GIVEN basic THEN returns expected', () => {
		const source = { a: 'Hello', b: 420 };
		const expected = ['Hello', 420];

		expect(objectValues(source)).toEqual(expected);
	});

	test('GIVEN deep THEN returns expected', () => {
		const source = { a: 'Hello', b: 420, deep: { i: [] } };
		const expected = ['Hello', 420, { i: [] }];

		expect(objectValues(source)).toEqual(expected);
	});
});
