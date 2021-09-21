import { isNullOrUndefinedOrEmpty } from '../src';

describe('isNullOrUndefinedOrEmpty', () => {
	test('GIVEN empty string THEN returns true', () => {
		expect(isNullOrUndefinedOrEmpty('')).toBeTrue();
	});

	test('GIVEN string THEN returns false', () => {
		expect(isNullOrUndefinedOrEmpty('test')).toBeFalse();
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

	test('GIVEN array THEN returns true', () => {
		expect(isNullOrUndefinedOrEmpty([])).toBeTrue();
	});

	test('GIVEN non-empty array THEN returns false', () => {
		expect(isNullOrUndefinedOrEmpty(['some non-empty array'])).toBeFalse();
	});

	test('GIVEN function THEN returns true', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isNullOrUndefinedOrEmpty(value)).toBeTrue();
	});

	test('GIVEN array function THEN returns true', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isNullOrUndefinedOrEmpty(value)).toBeTrue();
	});

	test('GIVEN class THEN returns true', () => {
		const value = class A {};
		expect(isNullOrUndefinedOrEmpty(value)).toBeTrue();
	});
});
