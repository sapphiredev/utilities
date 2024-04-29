import { drop } from '../src';

describe('drop', () => {
	test('GIVEN iterable and count greater than zero THEN returns iterable with dropped elements', () => {
		const iterable = [1, 2, 3, 4, 5];
		const count = 3;
		const result = [...drop(iterable, count)];
		expect(result).toEqual([4, 5]);
	});

	test('GIVEN iterable and count equal to zero THEN returns original iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const count = 0;
		const result = [...drop(iterable, count)];
		expect(result).toEqual([1, 2, 3, 4, 5]);
	});

	test('GIVEN iterable and count greater than iterable length THEN returns empty iterable', () => {
		const iterable = [1, 2, 3, 4, 5];
		const count = 10;
		const result = [...drop(iterable, count)];
		expect(result).toEqual([]);
	});

	test('GIVEN empty iterable THEN returns empty iterable', () => {
		const iterable: number[] = [];
		const count = 3;
		const result = [...drop(iterable, count)];
		expect(result).toEqual([]);
	});

	test('GIVEN negative count THEN throws RangeError', () => {
		const iterable = [1, 2, 3, 4, 5];
		const count = -1;
		expect(() => [...drop(iterable, count)]).toThrow(new RangeError('-1 must be a non-negative number'));
	});
});
