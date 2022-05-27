import { Result } from '../src/index';

describe('Result', () => {
	describe('ok', () => {
		test('GIVEN ok THEN returns { isOk->truthy, isErr->falsy }', () => {
			const returnValue = Result.ok(42);

			expect(returnValue.isOk()).toBeTruthy();
			expect(returnValue.isErr()).toBeFalsy();
		});
	});

	describe('err', () => {
		test('GIVEN err THEN returns { isOk->falsy, isErr->truthy }', () => {
			const returnValue = Result.err(new Error());

			expect(returnValue.isOk()).toBeFalsy();
			expect(returnValue.isErr()).toBeTruthy();
		});
	});

	describe('from', () => {
		test('GIVEN truthy value THEN returns Ok', () => {
			const returnValue = Result.from(() => 42);

			expect(returnValue.isOk()).toBeTruthy();
			expect(returnValue.isErr()).toBeFalsy();
			expect(returnValue.unwrap()).toBe(42);
		});

		test('GIVEN thrown error THEN returns Err', () => {
			const returnValue = Result.from(() => {
				throw new Error();
			});

			expect(returnValue.isOk()).toBeFalsy();
			expect(returnValue.isErr()).toBeTruthy();
			expect(returnValue.unwrapErr()).toBeDefined();
		});
	});

	describe('fromAsync', () => {
		test('GIVEN truthy value THEN returns Ok', async () => {
			const returnValue = await Result.fromAsync(() => Promise.resolve(42));

			expect(returnValue.isOk()).toBeTruthy();
			expect(returnValue.isErr()).toBeFalsy();
			expect(returnValue.unwrap()).toBe(42);
		});

		test('GIVEN existing promise with value THEN returns Ok', async () => {
			const promise = new Promise<number>((resolve) => resolve(42));

			const returnValue = await Result.fromAsync(promise);

			expect(returnValue.isOk()).toBeTruthy();
			expect(returnValue.isErr()).toBeFalsy();
			expect(returnValue.unwrap()).toBe(42);
		});

		test('GIVEN promise rejection THEN returns Err', async () => {
			const returnValue = await Result.fromAsync(() => Promise.reject(new Error()));

			expect(returnValue.isOk()).toBeFalsy();
			expect(returnValue.isErr()).toBeTruthy();
			expect(returnValue.unwrapErr()).toBeDefined();
		});

		test('GIVEN existing promise with rejection THEN returns Err', async () => {
			const promise = new Promise((_, reject) => reject(new Error()));

			const returnValue = await Result.fromAsync(promise);

			expect(returnValue.isOk()).toBeFalsy();
			expect(returnValue.isErr()).toBeTruthy();
			expect(returnValue.unwrapErr()).toBeDefined();
		});
	});
});
