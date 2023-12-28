import { omitKeysFromObject } from '../src/lib/omitKeysFromObject';

describe('omitKeysFromObject', () => {
	test('GIVEN object and keys THEN returns object without specified keys', () => {
		const source = { name: 'John', age: 30, city: 'New York' };
		const result = omitKeysFromObject(source, 'age', 'city');
		expect(result).toEqual({ name: 'John' });
	});

	test('GIVEN object and no keys THEN returns the same object', () => {
		const source = { name: 'John', age: 30, city: 'New York' };
		const result = omitKeysFromObject(source);
		expect(result).toEqual(source);
	});

	test('GIVEN empty object and keys THEN returns empty object', () => {
		const source = {};
		// @ts-expect-error Testing invalid input
		const result = omitKeysFromObject(source, 'age', 'city');
		expect(result).toEqual({});
	});

	test('GIVEN an object with ES objects THEN returns object without specified keys', () => {
		const source = {
			one: new Map(),
			two: new Set(),
			three: new Date(),
			four: new Uint8Array(),
			five: new Error(),
			six: new RegExp(''),
			seven: []
		};
		const result = omitKeysFromObject(source, 'one', 'two', 'three', 'four', 'five', 'six', 'seven');
		expect(result).toEqual({});
	});

	test('GIVEN keys as array THEN removes keys', () => {
		const source = { name: 'John', age: 30, city: 'New York' };
		// @ts-expect-error spreading Arrays gives "string" instead of "keyof T"
		const result = omitKeysFromObject(source, ...['age', 'city']);
		expect(result).toEqual({ name: 'John' });
	});
});
