import { last } from '../src';

describe('last', () => {
	test('GIVEN non-empty iterable THEN returns last element', () => {
		const iterable = [1, 2, 3];
		const result = last(iterable);
		expect(result).toBe(3);
	});

	test('GIVEN empty iterable THEN returns undefined', () => {
		const iterable: number[] = [];
		const result = last(iterable);
		expect(result).toBeUndefined();
	});

	test('GIVEN string iterable THEN returns last character', () => {
		const iterable = 'hello';
		const result = last(iterable);
		expect(result).toBe('o');
	});

	test('GIVEN object iterable THEN returns last object', () => {
		const iterable = [{ id: 1 }, { id: 2 }, { id: 3 }];
		const result = last(iterable);
		expect(result).toEqual({ id: 3 });
	});
});
