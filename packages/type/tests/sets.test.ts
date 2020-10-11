import { Type } from '../src';

describe('Sets', () => {
	test('set(empty)', () => {
		expect(new Type(new Set()).toString()).toBe('Set');
	});

	test('set(same-type)', () => {
		expect(new Type(new Set([1, 2, 3])).toString()).toBe('Set<number>');
	});

	test('set(different-type)', () => {
		expect(new Type(new Set(['abc', 1])).toString()).toBe('Set<number | string>');
	});
});
