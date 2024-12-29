import { enumerate } from '../../src';

describe('enumerate', () => {
	test('GIVEN iterable with elements THEN returns iterable with index-value pairs', () => {
		const iterable = ['a', 'b', 'c'];
		const result = [...enumerate(iterable)];
		expect(result).toEqual([
			[0, 'a'],
			[1, 'b'],
			[2, 'c']
		]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable: string[] = [];
		const result = [...enumerate(iterable)];
		expect(result).toEqual([]);
	});

	test('GIVEN iterable with one element THEN returns iterable with one index-value pair', () => {
		const iterable = ['a'];
		const result = [...enumerate(iterable)];
		expect(result).toEqual([[0, 'a']]);
	});
});
