import { mergeDefault } from '../src';

describe('mergeDefault', () => {
	test('GIVEN basic THEN returns expected', () => {
		const defaults = { a: 0, b: 1 };
		const given = {};
		expect(mergeDefault(defaults, given)).toEqual({ a: 0, b: 1 });
	});

	test('GIVEN mutation THEN returns expected', () => {
		expect.assertions(2);

		const defaults = { a: 0, b: 1 };
		const given = {};
		mergeDefault(defaults, given);

		expect(defaults).toEqual({ a: 0, b: 1 });
		expect(given).toEqual({ a: 0, b: 1 });
	});

	test('GIVEN clone THEN returns expected', () => {
		const defaults = { a: 0, b: 1 };
		expect(mergeDefault(defaults)).toEqual({ a: 0, b: 1 });
	});

	test('GIVEN partial THEN returns expected', () => {
		const defaults = { a: 0, b: 1 };
		const given = { a: 2 };
		expect(mergeDefault(defaults, given)).toEqual({ a: 2, b: 1 });
	});

	test('GIVEN extended THEN returns expected', () => {
		const defaults = { a: 0, b: 1 };
		const given = { a: 2, i: 3 };
		expect(mergeDefault(defaults, given)).toEqual({ a: 2, i: 3, b: 1 });
	});

	test('GIVEN partial-falsy-null THEN returns expected', () => {
		const defaults: { a: null | number; b: number } = { a: 0, b: 1 };
		const given = { a: null };
		expect(mergeDefault(defaults, given)).toEqual({ a: null, b: 1 });
	});

	test('GIVEN partial-undefined THEN returns expected', () => {
		const defaults = { a: 0, b: 1 };
		const given = { a: undefined };
		expect(mergeDefault(defaults, given)).toEqual({ a: 0, b: 1 });
	});

	test('GIVEN deep THEN returns expected', () => {
		const defaults = { a: { b: 1 } };
		const given = { a: { b: 2 } };
		expect(mergeDefault(defaults, given)).toEqual({ a: { b: 2 } });
	});
});
