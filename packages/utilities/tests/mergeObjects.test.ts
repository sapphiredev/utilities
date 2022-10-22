import { mergeObjects } from '../src';

describe('mergeObjects', () => {
	test('GIVEN basic THEN returns expected', () => {
		const source = { a: 0, b: 1 };
		const target = {};
		expect(mergeObjects(target, source)).toEqual({ a: 0, b: 1 });
	});

	test('GIVEN mutation THEN returns expected', () => {
		expect.assertions(2);

		const source = { a: 0, b: 1 };
		const target = {};
		mergeObjects(target, source);

		expect(source).toEqual({ a: 0, b: 1 });
		expect(target).toEqual({ a: 0, b: 1 });
	});

	test('GIVEN clone THEN returns expected', () => {
		const source = { a: 0, b: 1 };
		const target = {};
		expect(mergeObjects(target, source)).toEqual({ a: 0, b: 1 });
	});

	test('GIVEN partial THEN returns expected', () => {
		const source = { a: 0, b: 1 };
		const target = { a: 2 };
		expect(mergeObjects(target, source)).toEqual({ a: 0, b: 1 });
	});

	test('GIVEN extended THEN returns expected', () => {
		const source = { a: 0, b: 1 };
		const target = { a: 2, i: 2 };
		expect(mergeObjects(target, source)).toEqual({ a: 0, i: 2, b: 1 });
	});

	test('GIVEN deep THEN returns expected', () => {
		const source = { a: 0 };
		const target = { b: { i: 4 } };
		expect(mergeObjects(target, source)).toEqual({ a: 0, b: { i: 4 } });
	});

	test('GIVEN deep-replace THEN returns expected', () => {
		const source = { a: { i: 4 } };
		const target = { a: 0 };
		expect(mergeObjects(target, source)).toEqual({ a: { i: 4 } });
	});

	test('GIVEN deep-merge THEN returns expected', () => {
		const source = { a: { b: 1 } };
		const target = { a: { i: 1 } };
		expect(mergeObjects(target, source)).toEqual({ a: { b: 1, i: 1 } });
	});

	test('GIVEN deep-type-mismatch THEN returns expected', () => {
		const source = { a: 0 };
		const target = { a: { b: 1 } };
		expect(mergeObjects(target, source)).toEqual({ a: { b: 1 } });
	});
});
