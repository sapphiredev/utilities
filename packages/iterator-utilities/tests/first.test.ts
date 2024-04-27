import { first } from '../src';

describe('first', () => {
	test('GIVEN non-empty iterable THEN returns the first element', () => {
		const iterable = [1, 2, 3];
		const result = first(iterable);
		expect(result).toBe(1);
	});

	test('GIVEN empty iterable THEN returns undefined', () => {
		const iterable: number[] = [];
		const result = first(iterable);
		expect(result).toBeUndefined();
	});
});
