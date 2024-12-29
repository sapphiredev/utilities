import { lessOrEqualThan } from '../../src';

describe('lessOrEqualThan', () => {
	test('GIVEN two equal iterables THEN returns true', () => {
		const result = lessOrEqualThan([1], [1]);
		expect<boolean>(result).toBe(true);
	});

	test('GIVEN [1] and [1, 2] THEN returns true', () => {
		const result = lessOrEqualThan([1], [1, 2]);
		expect<boolean>(result).toBe(true);
	});

	test('GIVEN [1, 2] and [1] THEN returns false', () => {
		const result = lessOrEqualThan([1, 2], [1]);
		expect<boolean>(result).toBe(false);
	});

	test('GIVEN [1, 2] and [1, 2] THEN returns true', () => {
		const result = lessOrEqualThan([1, 2], [1, 2]);
		expect<boolean>(result).toBe(true);
	});
});
