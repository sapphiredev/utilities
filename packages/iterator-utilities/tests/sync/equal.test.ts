import { equal } from '../../src';

describe('equal', () => {
	test('GIVEN two equal iterables THEN returns true', () => {
		const result = equal([1], [1]);
		expect<boolean>(result).toBe(true);
	});

	test('GIVEN [1] and [1, 2] THEN returns false', () => {
		const result = equal([1], [1, 2]);
		expect<boolean>(result).toBe(false);
	});

	test('GIVEN [1, 2] and [1] THEN returns false', () => {
		const result = equal([1, 2], [1]);
		expect<boolean>(result).toBe(false);
	});
});
