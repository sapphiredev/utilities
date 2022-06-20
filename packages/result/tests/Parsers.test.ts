import { from, fromAsync, isErr, isOk } from '../src/index';

describe('Parsers', () => {
	describe('from', () => {
		test('GIVEN truthy value THEN returns Ok', () => {
			const returnValue = from(() => 42);

			expect(isOk(returnValue)).toBe(true);
			expect(isErr(returnValue)).toBe(false);
			expect(returnValue?.value).toBe(42);
		});

		test('GIVEN thrown error THEN returns Err', () => {
			const returnValue = from(() => {
				throw new Error();
			});

			expect(isOk(returnValue)).toBe(false);
			expect(isErr(returnValue)).toBe(true);
			expect(returnValue?.value).toBeUndefined();
		});
	});

	describe('fromAsync', () => {
		test('GIVEN truthy value THEN returns Ok', async () => {
			const returnValue = await fromAsync(() => Promise.resolve(42));

			expect(isOk(returnValue)).toBe(true);
			expect(isErr(returnValue)).toBe(false);
			expect(returnValue?.value).toBe(42);
		});

		test('GIVEN existing promise with value THEN returns Ok', async () => {
			const promise = new Promise((resolve) => resolve(42));

			const returnValue = await fromAsync(promise);

			expect(isOk(returnValue)).toBe(true);
			expect(isErr(returnValue)).toBe(false);
			expect(returnValue?.value).toBe(42);
		});

		test('GIVEN promise rejection THEN returns Err', async () => {
			const returnValue = await fromAsync(() => Promise.reject(new Error()));

			expect(isOk(returnValue)).toBe(false);
			expect(isErr(returnValue)).toBe(true);
			expect(returnValue?.value).toBeUndefined();
		});

		test('GIVEN existing promise with rejection THEN returns Err', async () => {
			const promise = new Promise((_, reject) => reject(new Error()));

			const returnValue = await fromAsync(promise);

			expect(isOk(returnValue)).toBe(false);
			expect(isErr(returnValue)).toBe(true);
			expect(returnValue?.value).toBeUndefined();
		});
	});
});
