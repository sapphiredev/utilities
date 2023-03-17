import { tryParseJSON } from '../src/index.js';

describe('tryParseJSON', () => {
	test('GIVEN basic THEN returns expected', () => {
		const source = '{"a":4,"b":6}';
		const expected = { a: 4, b: 6 };
		expect(tryParseJSON(source)).toEqual(expected);
	});

	test('GIVEN invalid THEN returns expected', () => {
		const source = '{"a":4,"b:6}';
		const expected = '{"a":4,"b:6}';
		expect(tryParseJSON(source)).toEqual(expected);
	});
});
