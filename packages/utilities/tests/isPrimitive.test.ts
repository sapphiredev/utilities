import { isPrimitive } from '../src';

describe('isPrimitive', () => {
	test('GIVEN string THEN returns false', () => {
		const value = 'Hello World';
		expect(isPrimitive(value)).toBeTrue();
	});

	test('GIVEN number THEN returns false', () => {
		const value = 420;
		expect(isPrimitive(value)).toBeTrue();
	});

	test('GIVEN bigint THEN returns false', () => {
		// eslint-disable-next-line no-undef
		const value = BigInt(420);
		expect(isPrimitive(value)).toBeTrue();
	});

	test('GIVEN boolean THEN returns false', () => {
		const value = true;
		expect(isPrimitive(value)).toBeTrue();
	});

	test('GIVEN undefined THEN returns false', () => {
		const value = undefined;
		expect(isPrimitive(value)).toBeFalse();
	});

	test('GIVEN object THEN returns false', () => {
		const value = { class: '' };
		expect(isPrimitive(value)).toBeFalse();
	});

	test('GIVEN object-null THEN returns false', () => {
		const value = null;
		expect(isPrimitive(value)).toBeFalse();
	});

	test('GIVEN function THEN returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isPrimitive(value)).toBeFalse();
	});

	test('GIVEN arrow THEN returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isPrimitive(value)).toBeFalse();
	});

	test('GIVEN class THEN returns false', () => {
		const value = class A {};
		expect(isPrimitive(value)).toBeFalse();
	});
});
