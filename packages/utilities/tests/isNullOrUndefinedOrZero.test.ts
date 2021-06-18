import { isNullOrUndefinedOrEmpty } from '../src';

describe('isNullOrUndefinedOrEmpty', () => {
	test('GIVEN empty THEN returns true', () => {
		expect(isNullOrUndefinedOrEmpty('')).toBe(true);
	});

	test('GIVEN number THEN returns false', () => {
		expect(isNullOrUndefinedOrEmpty(5)).toBe(false);
	});

	test('GIVEN boolean THEN returns false', () => {
		expect(isNullOrUndefinedOrEmpty(true)).toBe(false);
	});

	test('GIVEN undefined THEN returns true', () => {
		expect(isNullOrUndefinedOrEmpty(undefined)).toBe(true);
	});

	test('GIVEN null THEN returns true', () => {
		expect(isNullOrUndefinedOrEmpty(null)).toBe(true);
	});

	test('GIVEN object THEN returns false', () => {
		expect(isNullOrUndefinedOrEmpty({})).toBe(false);
	});

	test('GIVEN array THEN returns false', () => {
		expect(isNullOrUndefinedOrEmpty([])).toBe(false);
	});

	test('GIVEN function THEN returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isNullOrUndefinedOrEmpty(value)).toBe(false);
	});

	test('GIVEN array function THEN returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isNullOrUndefinedOrEmpty(value)).toBe(false);
	});

	test('GIVEN class THEN returns false', () => {
		const value = class A {};
		expect(isNullOrUndefinedOrEmpty(value)).toBe(false);
	});
});
