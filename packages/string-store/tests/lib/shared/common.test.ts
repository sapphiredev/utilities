import { isArrayLike, isValidLength } from '../../../src/lib/shared/_common';

describe('isArrayLike', () => {
	test.each([undefined, null, 42, 100n, () => {}, Symbol('foo'), 'bar'])('GIVEN a non-object or null value THEN it returns false', (value) => {
		expect(isArrayLike(value)).toBe(false);
	});

	test('GIVEN an array THEN it returns true', () => {
		expect(isArrayLike([])).toBe(true);
	});

	test.each([{}, { length: '42' }])('GIVEN an object without a numeric length property THEN it returns false', (value) => {
		expect(isArrayLike(value)).toBe(false);
	});

	test('GIVEN an object with a numeric length property and a length of 0 THEN it returns true', () => {
		expect(isArrayLike({ length: 0 })).toBe(true);
	});

	test('GIVEN an object with a non-zero length and no last property THEN it returns false', () => {
		expect(isArrayLike({ length: 1 })).toBe(false);
	});

	test('GIVEN an object with a non-zero length and has the last property THEN it returns true', () => {
		expect(isArrayLike({ length: 1, 0: 'foo' })).toBe(true);
	});
});

describe('isValidLength', () => {
	test.each([undefined, null, 4.2, 100n, () => {}, Symbol('foo'), 'bar'])('GIVEN a non-safe integer THEN it returns false', (value) => {
		// @ts-expect-error Testing invalid input
		expect(isValidLength(value)).toBe(false);
	});

	test.each([-1, 2147483648, Number.MAX_SAFE_INTEGER, Infinity, -Infinity, NaN])('GIVEN an out-of-range length THEN it returns false', (value) => {
		expect(isValidLength(value)).toBe(false);
	});
});
