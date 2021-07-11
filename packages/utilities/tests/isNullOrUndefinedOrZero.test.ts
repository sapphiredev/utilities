import { isNullOrUndefinedOrZero } from '../src';

describe('isNullOrUndefinedOrZero', () => {
	test('GIVEN empty string THEN returns false', () => {
		expect(isNullOrUndefinedOrZero('')).toBeFalse();
	});

	test('GIVEN number as 0 THEN returns true', () => {
		expect(isNullOrUndefinedOrZero(0)).toBeTrue();
	});

	test('GIVEN number THEN returns false', () => {
		expect(isNullOrUndefinedOrZero(5)).toBeFalse();
	});

	test('GIVEN boolean THEN returns false', () => {
		expect(isNullOrUndefinedOrZero(true)).toBeFalse();
	});

	test('GIVEN undefined THEN returns true', () => {
		expect(isNullOrUndefinedOrZero(undefined)).toBeTrue();
	});

	test('GIVEN null THEN returns true', () => {
		expect(isNullOrUndefinedOrZero(null)).toBeTrue();
	});

	test('GIVEN object THEN returns false', () => {
		expect(isNullOrUndefinedOrZero({})).toBeFalse();
	});

	test('GIVEN array THEN returns false', () => {
		expect(isNullOrUndefinedOrZero([])).toBeFalse();
	});

	test('GIVEN function THEN returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isNullOrUndefinedOrZero(value)).toBeFalse();
	});

	test('GIVEN array function THEN returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isNullOrUndefinedOrZero(value)).toBeFalse();
	});

	test('GIVEN class THEN returns false', () => {
		const value = class A {};
		expect(isNullOrUndefinedOrZero(value)).toBeFalse();
	});
});
