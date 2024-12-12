import { greaterOrEqualThan } from '../../src';

describe('greaterOrEqualThan', () => {
	test('GIVEN two equal iterables THEN returns true', () => {
		const result = greaterOrEqualThan([1], [1]);
		expect<boolean>(result).toBe(true);
	});

	test('GIVEN [1] and [1, 2] THEN returns false', () => {
		const result = greaterOrEqualThan([1], [1, 2]);
		expect<boolean>(result).toBe(false);
	});

	test('GIVEN [1, 2] and [1] THEN returns true', () => {
		const result = greaterOrEqualThan([1, 2], [1]);
		expect<boolean>(result).toBe(true);
	});

	test('GIVEN [1, 2] and [1, 2] THEN returns true', () => {
		const result = greaterOrEqualThan([1, 2], [1, 2]);
		expect<boolean>(result).toBe(true);
	});
});
