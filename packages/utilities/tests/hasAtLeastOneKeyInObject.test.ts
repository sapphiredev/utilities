import { hasAtLeastOneKeyInObject } from '../src/lib/hasAtLeastOneKeyInObject';

describe('hasAtLeastOneKeyInObject', () => {
	test('should return true if the object has at least one of the keys', () => {
		const obj = { a: 1, b: 2, c: 3 };
		expect(hasAtLeastOneKeyInObject(obj, ['a'])).toBe(true);
	});

	test('should return false if the object does not have any of the keys', () => {
		const obj = { a: 1, b: 2, c: 3 };
		// @ts-expect-error Testing invalid input
		expect(hasAtLeastOneKeyInObject(obj, ['d'])).toBe(false);
	});

	test('should return false if the object is nullish', () => {
		const obj = null;
		// @ts-expect-error Testing invalid input
		expect(hasAtLeastOneKeyInObject(obj, ['a'])).toBe(false);
	});

	test('should return true if the object has the key and its value is not nullish', () => {
		const obj = { a: 1, b: null, c: undefined };
		expect(hasAtLeastOneKeyInObject(obj, ['a'])).toBe(true);
	});

	test('should return true if the object has at least one key from the array', () => {
		const obj = { a: 1, b: 2, c: 3 };
		// @ts-expect-error Testing invalid input
		expect(hasAtLeastOneKeyInObject(obj, ['b', 'c', 'd'])).toBe(true);
	});

	test('should return false if the object does not have any key from the array', () => {
		const obj = { a: 1, b: 2, c: 3 };
		// @ts-expect-error Testing invalid input
		expect(hasAtLeastOneKeyInObject(obj, ['d', 'e', 'f'])).toBe(false);
	});

	test('should return true if the object has at least one key and its value is not nullish', () => {
		const obj = { a: 1, b: null, c: undefined };
		expect(hasAtLeastOneKeyInObject(obj, ['a', 'b'])).toBe(true);
	});
});
