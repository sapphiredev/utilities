import { isFunction, isPromise } from '../../src/lib/common/utils';

describe('utils', () => {
	describe('isFunction', () => {
		test('GIVEN a function THEN returns true', () => {
			const fn = vi.fn();

			expect(isFunction(fn)).toBe(true);
			expect(fn).not.toHaveBeenCalled();
		});

		test.each([null, undefined, 42, 'Hello World', {}])('GIVEN %j THEN returns false', (value) => {
			expect(isFunction(value)).toBe(false);
		});
	});

	describe('isPromise', () => {
		test('GIVEN a promise THEN returns true', () => {
			const value = Promise.resolve(42);

			expect(isPromise(value)).toBe(true);
		});

		test('GIVEN a rejecting promise THEN returns true', () => {
			const value = Promise.reject(new Error());

			expect(isPromise(value)).toBe(true);

			void value.catch(vi.fn());
		});

		test('GIVEN a promise-like THEN returns true', () => {
			const cb = vi.fn();
			const value = { then: cb };

			expect(isPromise(value)).toBe(true);
			expect(cb).not.toHaveBeenCalled();
		});

		test.each([null, undefined, 42, 'Hello World', {}])('GIVEN %j THEN returns false', (value) => {
			expect(isPromise(value)).toBe(false);
		});
	});
});
