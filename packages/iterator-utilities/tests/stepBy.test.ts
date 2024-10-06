import { stepBy, toArray } from '../src';

describe('stepBy', () => {
	test('GIVEN [0, 1, 2, 3, 4, 5] and 2 THEN returns [0, 2, 4]', () => {
		const result = stepBy([0, 1, 2, 3, 4, 5], 2);
		expect<number[]>(toArray(result)).toEqual([0, 2, 4]);
	});

	test('GIVEN [0, 1] and 2 THEN returns [0]', () => {
		const result = stepBy([0, 1], 2);
		expect<number[]>(toArray(result)).toEqual([0]);
	});

	test('GIVEN [0] and 2 THEN returns [0]', () => {
		const result = stepBy([0], 2);
		expect<number[]>(toArray(result)).toEqual([0]);
	});

	test('GIVEN [] and 2 THEN returns [0]', () => {
		const result = stepBy([], 2);
		expect<number[]>(toArray(result)).toEqual([]);
	});
});
