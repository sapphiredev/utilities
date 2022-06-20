import { isNumber } from '../src';

describe('isNumber', () => {
	test('GIVEN string THEN returns false', () => {
		const value = 'Hello World';
		expect(isNumber(value)).toBe(false);
	});

	test('GIVEN number-integer THEN returns false', () => {
		const value = 420;
		expect(isNumber(value)).toBe(true);
	});

	test('GIVEN number-float THEN returns false', () => {
		const value = -420.5;
		expect(isNumber(value)).toBe(true);
	});

	test('GIVEN number-nan THEN returns false', () => {
		const value = NaN;
		expect(isNumber(value)).toBe(false);
	});

	test('GIVEN number-infinite THEN returns false', () => {
		const value = Infinity;
		expect(isNumber(value)).toBe(false);
	});

	test('GIVEN bigint THEN returns false', () => {
		// eslint-disable-next-line no-undef
		const value = BigInt(420);
		expect(isNumber(value)).toBe(false);
	});

	test('GIVEN boolean THEN returns false', () => {
		const value = true;
		expect(isNumber(value)).toBe(false);
	});

	test('GIVEN undefined THEN returns false', () => {
		const value = undefined;
		expect(isNumber(value)).toBe(false);
	});

	test('GIVEN object THEN returns false', () => {
		const value = { class: '' };
		expect(isNumber(value)).toBe(false);
	});

	test('GIVEN object-null THEN returns false', () => {
		const value = null;
		expect(isNumber(value)).toBe(false);
	});

	test('GIVEN function THEN returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isNumber(value)).toBe(false);
	});

	test('GIVEN arrow THEN returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isNumber(value)).toBe(false);
	});

	test('GIVEN class THEN returns false', () => {
		const value = class A {};
		expect(isNumber(value)).toBe(false);
	});
});
