import { isNullOrUndefined } from '../src';

describe('isNullOrUndefined', () => {
	test('GIVEN string THEN returns false', () => {
		expect(isNullOrUndefined('')).toBeFalse();
	});

	test('GIVEN number THEN returns false', () => {
		expect(isNullOrUndefined(5)).toBeFalse();
	});

	test('GIVEN boolean THEN returns false', () => {
		expect(isNullOrUndefined(true)).toBeFalse();
	});

	test('GIVEN undefined THEN returns true', () => {
		expect(isNullOrUndefined(undefined)).toBeTrue();
	});

	test('GIVEN null THEN returns true', () => {
		expect(isNullOrUndefined(null)).toBeTrue();
	});

	test('GIVEN object THEN returns false', () => {
		expect(isNullOrUndefined({})).toBeFalse();
	});

	test('GIVEN array THEN returns false', () => {
		expect(isNullOrUndefined([])).toBeFalse();
	});

	test('GIVEN function THEN returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isNullOrUndefined(value)).toBeFalse();
	});

	test('GIVEN array function THEN returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isNullOrUndefined(value)).toBeFalse();
	});

	test('GIVEN class THEN returns false', () => {
		const value = class A {};
		expect(isNullOrUndefined(value)).toBeFalse();
	});
});
