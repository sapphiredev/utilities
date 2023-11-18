import { tryParseJSON } from '../src';

describe('tryParseJSON', () => {
	test('GIVEN basic THEN returns expected', () => {
		const source = '{"a":4,"b":6}';
		const expected = { a: 4, b: 6 };
		expect(tryParseJSON(source)).toEqual(expected);
	});

	test('GIVEN basic with replacer THEN returns expected', () => {
		const source = '{"a":4,"b":6}';
		const expected = { a: '4', b: '6' };
		const replacer = vi.fn((_key: string, value: unknown) => (typeof value === 'number' ? String(value) : value));
		expect(tryParseJSON(source, replacer)).toEqual(expected);
		expect(replacer).toHaveBeenCalledTimes(3);
	});

	test('GIVEN invalid THEN returns expected', () => {
		const source = '{"a":4,"b:6}';
		const expected = '{"a":4,"b:6}';
		expect(tryParseJSON(source)).toEqual(expected);
	});
});
