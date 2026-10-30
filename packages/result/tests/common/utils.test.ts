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

		test('GIVEN a rejecting promise THEN returns true', async () => {
			const value = Promise.reject(new Error('Test rejection'));

			expect(isPromise(value)).toBe(true);

			await expect(value).rejects.toThrow('Test rejection');
		});

		test('GIVEN a promise-like THEN returns true', () => {
			const cb = vi.fn();
			const value = new Proxy({}, { get: (_, property) => (property === 'then' ? cb : undefined) });

			expect(isPromise(value)).toBe(true);
			expect(cb).not.toHaveBeenCalled();
		});

		test.each([null, undefined, 42, 'Hello World', {}])('GIVEN %j THEN returns false', (value) => {
			expect(isPromise(value)).toBe(false);
		});
	});
});
