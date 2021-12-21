import { isObject } from '../src';

describe('isObject', () => {
	test('GIVEN string THEN returns false', () => {
		const value = 'Hello World';
		expect(isObject(value)).toBeFalse();
	});

	test('GIVEN number THEN returns false', () => {
		const value = 420;
		expect(isObject(value)).toBeFalse();
	});

	test('GIVEN bigint THEN returns false', () => {
		// eslint-disable-next-line no-undef
		const value = BigInt(420);
		expect(isObject(value)).toBeFalse();
	});

	test('GIVEN boolean THEN returns false', () => {
		const value = true;
		expect(isObject(value)).toBeFalse();
	});

	test('GIVEN undefined THEN returns false', () => {
		const value = undefined;
		expect(isObject(value)).toBeFalse();
	});

	test('GIVEN object THEN returns false', () => {
		const value = { class: '' };
		expect(isObject(value)).toBeTrue();
	});

	test('GIVEN object-null THEN returns false', () => {
		const value = null;
		expect(isObject(value)).toBeFalse();
	});

	test('GIVEN object-array THEN returns false', () => {
		const value: undefined[] = [];
		expect(isObject(value)).toBeFalse();
	});

	test('GIVEN object-non-literal THEN returns false', () => {
		const value = new (class A {})();
		expect(isObject(value)).toBeFalse();
	});

	test('GIVEN function THEN returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isObject(value)).toBeFalse();
	});

	test('GIVEN arrow THEN returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isObject(value)).toBeFalse();
	});

	test('GIVEN class THEN returns false', () => {
		const value = class A {};
		expect(isObject(value)).toBeFalse();
	});

	test('GIVEN instance of class THEN returns false', () => {
		class A {}
		const value = new A();

		expect(isObject(value)).toBeFalse();
	});

	test('GIVEN instance of class WITH custom constructorType THEN returns true', () => {
		class A {
			public B!: string;
		}

		const value = new A();

		expect(isObject(value, A)).toBeTrue();
	});
});
