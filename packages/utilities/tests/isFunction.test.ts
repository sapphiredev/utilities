import { isFunction } from '../src';

describe('isFunction', () => {
	test('GIVEN string THEN returns false', () => {
		const value = 'Hello World';
		expect(isFunction(value)).toBeFalse();
	});

	test('GIVEN number THEN returns false', () => {
		const value = 420;
		expect(isFunction(value)).toBeFalse();
	});

	test('GIVEN BigInt THEN returns false', () => {
		const value = BigInt(420);
		expect(isFunction(value)).toBeFalse();
	});

	test('GIVEN boolean THEN returns false', () => {
		const value = true;
		expect(isFunction(value)).toBeFalse();
	});

	test('GIVEN undefined THEN returns false', () => {
		const value = undefined;
		expect(isFunction(value)).toBeFalse();
	});

	test('GIVEN object THEN returns false', () => {
		const value = { class: '' };
		expect(isFunction(value)).toBeFalse();
	});

	test('GIVEN null THEN returns false', () => {
		const value = null;
		expect(isFunction(value)).toBeFalse();
	});

	test('GIVEN function expression THEN returns true', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isFunction(value)).toBeTrue();
	});

	test('GIVEN arrow function THEN returns true', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isFunction(value)).toBeTrue();
	});

	test('GIVEN class THEN returns true', () => {
		const value = class A {};
		expect(isFunction(value)).toBeTrue();
	});
});
