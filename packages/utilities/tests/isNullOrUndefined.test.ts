import { isNullOrUndefined } from '../src';

describe('isNullOrUndefined', () => {
	test('GIVEN string THEN returns false', () => {
		expect(isNullOrUndefined('')).toBe(false);
	});

	test('GIVEN number THEN returns false', () => {
		expect(isNullOrUndefined(5)).toBe(false);
	});

	test('GIVEN boolean THEN returns false', () => {
		expect(isNullOrUndefined(true)).toBe(false);
	});

	test('GIVEN undefined THEN returns true', () => {
		expect(isNullOrUndefined(undefined)).toBe(true);
	});

	test('GIVEN null THEN returns true', () => {
		expect(isNullOrUndefined(null)).toBe(true);
	});

	test('GIVEN object THEN returns false', () => {
		expect(isNullOrUndefined({})).toBe(false);
	});

	test('GIVEN array THEN returns false', () => {
		expect(isNullOrUndefined([])).toBe(false);
	});

	test('GIVEN function THEN returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isNullOrUndefined(value)).toBe(false);
	});

	test('GIVEN array function THEN returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isNullOrUndefined(value)).toBe(false);
	});

	test('GIVEN class THEN returns false', () => {
		const value = class A {};
		expect(isNullOrUndefined(value)).toBe(false);
	});
});
