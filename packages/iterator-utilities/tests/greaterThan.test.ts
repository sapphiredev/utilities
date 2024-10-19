import { greaterThan } from '../src';

describe('greaterThan', () => {
	test('GIVEN two equal iterables THEN returns false', () => {
		const result = greaterThan([1], [1]);
		expect<boolean>(result).toBe(false);
	});

	test('GIVEN [1] and [1, 2] THEN returns false', () => {
		const result = greaterThan([1], [1, 2]);
		expect<boolean>(result).toBe(false);
	});

	test('GIVEN [1, 2] and [1] THEN returns true', () => {
		const result = greaterThan([1, 2], [1]);
		expect<boolean>(result).toBe(true);
	});

	test('GIVEN [1, 2] and [1, 2] THEN returns false', () => {
		const result = greaterThan([1, 2], [1, 2]);
		expect<boolean>(result).toBe(false);
	});
});
