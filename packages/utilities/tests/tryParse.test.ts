import { tryParse } from '../src';

describe('tryParse', () => {
	test('GIVEN basic THEN returns expected', () => {
		const source = '{"a":4,"b":6}';
		const expected = { a: 4, b: 6 };
		expect(tryParse(source)).toEqual(expected);
	});

	test('GIVEN invalid THEN returns expected', () => {
		const source = '{"a":4,"b:6}';
		const expected = '{"a":4,"b:6}';
		expect(tryParse(source)).toEqual(expected);
	});
});
