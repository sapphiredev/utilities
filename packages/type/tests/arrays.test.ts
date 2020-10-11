import { Type } from '../src';

describe('Arrays', () => {
	test('array(empty)', () => {
		expect(new Type([]).toString()).toBe('Array');
	});

	test('array(same-type)', () => {
		expect(new Type([1, 2, 3]).toString()).toBe('Array<number>');
	});

	test('array(different-type)', () => {
		expect(new Type([true, 'Test', 7]).toString()).toBe('Array<boolean | number | string>');
	});

	test('array circular', () => {
		const a = [[]];
		a[0].push(a as never);
		expect(new Type(a).toString()).toBe('Array<Array<[Circular:Array]>>');
	});
});
