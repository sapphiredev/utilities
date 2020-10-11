import { Type } from '../src';

describe('Maps', () => {
	test('map(empty)', () => {
		expect(new Type(new Map()).toString()).toBe('Map');
	});

	test('map(same-type)', () => {
		expect(
			new Type(
				new Map([
					['one', 1],
					['two', 2],
					['three', 3]
				])
			).toString()
		).toBe('Map<string, number>');
	});

	test('map(different-type)', () => {
		expect(
			new Type(
				new Map<string, string | number>([
					['text', 'abc'],
					['digit', 1]
				])
			).toString()
		).toBe('Map<string, number | string>');
	});

	test('map(mixed with object)', () => {
		expect(
			new Type(
				new Map<string, any>([
					['text', 'abc'],
					['digit', 1],
					['object', {}]
				])
			).toString()
		).toBe('Map<string, Record | number | string>');
	});
});
