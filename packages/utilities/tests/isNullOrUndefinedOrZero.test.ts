import { isNullOrUndefinedOrZero } from '../src';

describe('isNullOrUndefinedOrZero', () => {
	test('GIVEN empty string THEN returns false', () => {
		expect(isNullOrUndefinedOrZero('')).toBe(false);
	});

	test('GIVEN number as 0 THEN returns true', () => {
		expect(isNullOrUndefinedOrZero(0)).toBe(true);
	});

	test('GIVEN number THEN returns false', () => {
		expect(isNullOrUndefinedOrZero(5)).toBe(false);
	});

	test('GIVEN boolean THEN returns false', () => {
		expect(isNullOrUndefinedOrZero(true)).toBe(false);
	});

	test('GIVEN undefined THEN returns true', () => {
		expect(isNullOrUndefinedOrZero(undefined)).toBe(true);
	});

	test('GIVEN null THEN returns true', () => {
		expect(isNullOrUndefinedOrZero(null)).toBe(true);
	});

	test('GIVEN object THEN returns false', () => {
		expect(isNullOrUndefinedOrZero({})).toBe(false);
	});

	test('GIVEN array THEN returns false', () => {
		expect(isNullOrUndefinedOrZero([])).toBe(false);
	});

	test('GIVEN function THEN returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isNullOrUndefinedOrZero(value)).toBe(false);
	});

	test('GIVEN array function THEN returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isNullOrUndefinedOrZero(value)).toBe(false);
	});

	test('GIVEN class THEN returns false', () => {
		const value = class A {};
		expect(isNullOrUndefinedOrZero(value)).toBe(false);
	});
});
