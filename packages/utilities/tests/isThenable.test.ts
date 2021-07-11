import { isThenable } from '../src';

describe('isThenable', () => {
	test('GIVEN string THEN returns false', () => {
		const value = 'Hello World';
		expect(isThenable(value)).toBeFalse();
	});

	test('GIVEN number THEN returns false', () => {
		const value = 420;
		expect(isThenable(value)).toBeFalse();
	});

	test('GIVEN bigint THEN returns false', () => {
		// eslint-disable-next-line no-undef
		const value = BigInt(420);
		expect(isThenable(value)).toBeFalse();
	});

	test('GIVEN boolean THEN returns false', () => {
		const value = true;
		expect(isThenable(value)).toBeFalse();
	});

	test('GIVEN undefined THEN returns false', () => {
		const value = undefined;
		expect(isThenable(value)).toBeFalse();
	});

	test('GIVEN object THEN returns false', () => {
		const value = { class: '' };
		expect(isThenable(value)).toBeFalse();
	});

	test('GIVEN object-null THEN returns false', () => {
		const value = null;
		expect(isThenable(value)).toBeFalse();
	});

	test('GIVEN promise-constructor THEN returns false', () => {
		const value = new Promise((resolve): void => resolve(true));
		expect(isThenable(value)).toBeTrue();
	});

	test('GIVEN promise-resolve THEN returns false', () => {
		const value = Promise.resolve(true);
		expect(isThenable(value)).toBeTrue();
	});

	test('GIVEN promise-like THEN returns false', () => {
		const value = {
			then(): boolean {
				return true;
			},
			catch(): void {
				/* noop */
			}
		};
		expect(isThenable(value)).toBeTrue();
	});

	test('GIVEN function THEN returns false', () => {
		const value = function value(): void {
			/* noop */
		};
		expect(isThenable(value)).toBeFalse();
	});

	test('GIVEN arrow THEN returns false', () => {
		const value = (): void => {
			/* noop */
		};
		expect(isThenable(value)).toBeFalse();
	});

	test('GIVEN class THEN returns false', () => {
		const value = class A {};
		expect(isThenable(value)).toBeFalse();
	});
});
