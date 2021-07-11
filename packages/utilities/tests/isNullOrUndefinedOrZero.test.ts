import { isNullOrUndefinedOrEmpty } from '../src';

describe('isNullOrUndefinedOrEmpty', () => {
	test('GIVEN empty THEN returns true', () => {
		expect(isNullOrUndefinedOrEmpty('')).toBeTrue();
	});

	test('GIVEN number THEN returns false', () => {
		expect(isNullOrUndefinedOrEmpty(5)).toBeFalse();
	});

	test('GIVEN boolean THEN returns false', () => {
		expect(isNullOrUndefinedOrEmpty(true)).toBeFalse();
	});

	test('GIVEN undefined THEN returns true', () => {
		expect(isNullOrUndefinedOrEmpty(undefined)).toBeTrue();
	});

	test('GIVEN null THEN returns true', () => {
		expect(isNullOrUndefinedOrEmpty(null)).toBeTrue();
	});

	test('GIVEN object THEN returns false', () => {
		expect(isNullOrUndefinedOrEmpty({})).toBeFalse();
	});

	test('GIVEN array THEN returns false', () => {
		expect(isNullOrUndefinedOrEmpty([])).toBeFalse();
	});

	test('GIVEN function THEN returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isNullOrUndefinedOrEmpty(value)).toBeFalse();
	});

	test('GIVEN array function THEN returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isNullOrUndefinedOrEmpty(value)).toBeFalse();
	});

	test('GIVEN class THEN returns false', () => {
		const value = class A {};
		expect(isNullOrUndefinedOrEmpty(value)).toBeFalse();
	});
});
