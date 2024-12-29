import { repeat } from '../../src';

describe('repeat', () => {
	test('GIVEN value and count THEN returns iterable with repeated values', () => {
		const value = 'hello';
		const count = 3;
		const result = [...repeat(value, count)];
		expect(result).toEqual(['hello', 'hello', 'hello']);
	});

	test('GIVEN value and count of 0 THEN returns empty iterable', () => {
		const value = 42;
		const count = 0;
		const result = [...repeat(value, count)];
		expect(result).toEqual([]);
	});

	test('GIVEN value and negative count THEN throws RangeError', () => {
		const value = true;
		const count = -5;
		expect(() => repeat(value, count)).toThrowError(new RangeError('-5 must be a non-negative number'));
	});

	test('GIVEN object value and count THEN returns iterable with repeated object references', () => {
		const value = { name: 'John' };
		const count = 2;
		const result = [...repeat(value, count)];
		expect(result).toEqual([{ name: 'John' }, { name: 'John' }]);
	});

	test('GIVEN iterable value and count THEN returns iterable with repeated iterables', () => {
		const value = [1, 2, 3];
		const count = 2;
		const result = [...repeat(value, count)];
		expect(result).toEqual([
			[1, 2, 3],
			[1, 2, 3]
		]);
	});
});
