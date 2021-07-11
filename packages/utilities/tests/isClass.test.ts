import { isClass } from '../src';

describe('isClass', () => {
	test('GIVEN string THEN returns false', () => {
		const value = 'Hello World';
		expect(isClass(value)).toBeFalse();
	});

	test('GIVEN number THEN returns false', () => {
		const value = 420;
		expect(isClass(value)).toBeFalse();
	});

	test('GIVEN BigInt THEN returns false', () => {
		// eslint-disable-next-line no-undef
		const value = BigInt(420);
		expect(isClass(value)).toBeFalse();
	});

	test('GIVEN boolean THEN returns false', () => {
		const value = true;
		expect(isClass(value)).toBeFalse();
	});

	test('GIVEN undefined THEN returns false', () => {
		const value = undefined;
		expect(isClass(value)).toBeFalse();
	});

	test('GIVEN object THEN returns false', () => {
		const value = { class: '' };
		expect(isClass(value)).toBeFalse();
	});

	test('GIVEN null THEN returns false', () => {
		const value = null;
		expect(isClass(value)).toBeFalse();
	});

	test('GIVEN function expression THEN returns true', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isClass(value)).toBeTrue();
	});

	test('GIVEN array function THEN returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isClass(value)).toBeFalse();
	});

	test('GIVEN class THEN returns true', () => {
		const value = class A {};
		expect(isClass(value)).toBeTrue();
	});
});
