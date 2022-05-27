import { Option, Result, ResultError } from '../src/index';
import type { None } from '../src/lib/Option/None';
import type { Some } from '../src/lib/Option/Some';
import type { Ok } from '../src/lib/Result/Ok';

describe('Result', () => {
	describe('prototype', () => {
		describe('isOk', () => {
			test('GIVEN ok THEN returns true', () => {
				const result = Result.ok(42);
				expect<true>(result.isOk()).toBe(true);
			});

			test('GIVEN err THEN returns false', () => {
				const result = Result.err('Some error message');
				expect<false>(result.isOk()).toBe(false);
			});
		});

		describe('isOkAnd', () => {
			test('GIVEN ok AND true-returning callback THEN returns true', () => {
				const result = Result.ok(2);
				const cb = jest.fn((value: number) => value > 1);

				expect(result.isOkAnd(cb)).toBe(true);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveReturnedWith(true);
			});

			test('GIVEN ok AND false-returning callback THEN returns false', () => {
				const result = Result.ok(0);
				const cb = jest.fn((value: number) => value > 1);

				expect(result.isOkAnd(cb)).toBe(false);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(0);
				expect(cb).toHaveReturnedWith(false);
			});

			test('GIVEN err THEN returns false', () => {
				const result = Result.err('Some error message') as Result<number, string>;
				const cb = jest.fn((value: number) => value > 1);

				expect(result.isOkAnd(cb)).toBe(false);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('isErr', () => {
			test('GIVEN ok THEN returns false', () => {
				const result = Result.ok(42);
				expect<false>(result.isErr()).toBe(false);
			});

			test('GIVEN err THEN returns true', () => {
				const result = Result.err('Some error message');
				expect<true>(result.isErr()).toBe(true);
			});
		});

		describe('isErrAnd', () => {
			test('GIVEN ok AND true-returning callback THEN returns true', () => {
				const result = Result.ok(2) as Result<number, Error>;
				const cb = jest.fn((value: Error) => value instanceof TypeError);

				expect(result.isErrAnd(cb)).toBe(false);
				expect(cb).not.toHaveBeenCalled();
			});

			test('GIVEN err AND false-returning callback THEN returns false', () => {
				const error = new Error('Some error message');
				const result = Result.err(error);
				const cb = jest.fn((value: Error) => value instanceof TypeError);

				expect(result.isErrAnd(cb)).toBe(false);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(error);
				expect(cb).toHaveReturnedWith(false);
			});

			test('GIVEN err AND true-returning callback THEN returns false', () => {
				const error = new TypeError('Some error message');
				const result = Result.err(error);
				const cb = jest.fn((value: Error) => value instanceof TypeError);

				expect(result.isErrAnd(cb)).toBe(true);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(error);
				expect(cb).toHaveReturnedWith(true);
			});
		});

		describe('ok', () => {
			test('GIVEN ok THEN returns some', () => {
				const result = Result.ok(2);

				expect<Some<number>>(result.ok()).toEqual(Option.some(2));
			});

			test('GIVEN err THEN returns none', () => {
				const result = Result.err('Some error message');

				expect<None>(result.ok()).toEqual(Option.none);
			});
		});

		describe('err', () => {
			test('GIVEN ok THEN returns none', () => {
				const result = Result.ok(2);

				expect<None>(result.err()).toEqual(Option.none);
			});

			test('GIVEN err THEN returns some', () => {
				const result = Result.err('Some error message');

				expect<Some<string>>(result.err()).toEqual(Option.some('Some error message'));
			});
		});

		describe('map', () => {
			test('GIVEN ok THEN returns ok with mapped value', () => {
				const result = Result.ok(2);
				const cb = jest.fn((value: number) => value > 1);

				expect<Ok<boolean>>(result.map(cb)).toEqual(Result.ok(true));
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveReturnedWith(true);
			});

			test('GIVEN err THEN returns err', () => {
				const result = Result.err('Some error message') as Result<number, string>;
				const cb = jest.fn((value: number) => value > 1);

				expect(result.map(cb)).toEqual(Result.err('Some error message'));
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('mapOr', () => {
			test('GIVEN ok THEN returns ok with mapped value', () => {
				const result = Result.ok(2);
				const cb = jest.fn((value: number) => value > 1);

				expect<boolean>(result.mapOr(false, cb)).toEqual(true);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveReturnedWith(true);
			});

			test('GIVEN err THEN returns err', () => {
				const result = Result.err('Some error message') as Result<number, string>;
				const cb = jest.fn((value: number) => value > 1);

				expect<boolean>(result.mapOr(false, cb)).toEqual(false);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('mapOrElse', () => {
			test('GIVEN ok THEN returns ok with mapped value', () => {
				const result = Result.ok(2);
				const op = jest.fn(() => false);
				const cb = jest.fn((value: number) => value > 1);

				expect<boolean>(result.mapOrElse(op, cb)).toEqual(true);
				expect(op).not.toHaveBeenCalled();
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveReturnedWith(true);
			});

			test('GIVEN err THEN returns err', () => {
				const result = Result.err('Some error message') as Result<number, string>;
				const op = jest.fn(() => false);
				const cb = jest.fn((value: number) => value > 1);

				expect<boolean>(result.mapOrElse(op, cb)).toEqual(false);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith('Some error message');
				expect(op).toHaveReturnedWith(false);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('mapErr', () => {
			test('GIVEN ok THEN returns ok', () => {
				const result = Result.ok(2) as Result<number, string>;
				const cb = jest.fn((error: string) => error.length);

				expect<Result<number, number>>(result.mapErr(cb)).toEqual(Result.ok(2));
				expect(cb).not.toHaveBeenCalled();
			});

			test('GIVEN ok THEN returns err with mapped value', () => {
				const result = Result.err('Some error message') as Result<number, string>;
				const cb = jest.fn((error: string) => error.length);

				expect<Result<number, number>>(result.mapErr(cb)).toEqual(Result.err(18));
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith('Some error message');
				expect(cb).toHaveReturnedWith(18);
			});
		});

		describe('inspect', () => {
			test('GIVEN ok THEN calls callback and returns self', () => {
				const result = Result.ok(2);
				const cb = jest.fn();

				expect<typeof result>(result.inspect(cb)).toBe(result);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
			});

			test('GIVEN err THEN returns self', () => {
				const result = Result.err('Some error message') as Result<number, string>;
				const cb = jest.fn();

				expect<typeof result>(result.inspect(cb)).toBe(result);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('inspectErr', () => {
			test('GIVEN ok THEN calls callback and returns self', () => {
				const result = Result.ok(2) as Result<number, string>;
				const cb = jest.fn();

				expect<typeof result>(result.inspectErr(cb)).toBe(result);
				expect(cb).not.toHaveBeenCalled();
			});

			test('GIVEN err THEN returns self', () => {
				const result = Result.err('Some error message');
				const cb = jest.fn();

				expect<typeof result>(result.inspectErr(cb)).toBe(result);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith('Some error message');
			});
		});

		describe('iter', () => {
			test('GIVEN ok THEN yields one value', () => {
				const result = Result.ok(2) as Result<number, string>;

				expect<number[]>([...result.iter()]).toStrictEqual([2]);
			});

			test('GIVEN err THEN yields no value', () => {
				const result = Result.err('Some error message') as Result<number, string>;

				expect<number[]>([...result.iter()]).toStrictEqual([]);
			});
		});

		describe('expect', () => {
			test('GIVEN ok THEN returns value', () => {
				const result = Result.ok(2) as Result<number, string>;

				expect<number>(result.expect('Whoops!')).toBe(2);
			});

			test('GIVEN err THEN throws ResultError', () => {
				const result = Result.err('Some error message') as Result<number, string>;

				expectResultError('Whoops!', 'Some error message', () => result.expect('Whoops!'));
			});
		});

		describe('expectErr', () => {
			test('GIVEN ok THEN throws ResultError', () => {
				const result = Result.ok(2) as Result<number, string>;

				expectResultError('Whoops!', 2, () => result.expectErr('Whoops!'));
			});

			test('GIVEN err THEN returns error', () => {
				const result = Result.err('Some error message') as Result<number, string>;

				expect<string>(result.expectErr('Whoops!')).toBe('Some error message');
			});
		});

		describe('unwrap', () => {
			test('GIVEN ok THEN returns value', () => {
				const result = Result.ok(2) as Result<number, string>;

				expect<number>(result.unwrap()).toBe(2);
			});

			test('GIVEN err THEN throws ResultError', () => {
				const result = Result.err('Some error message') as Result<number, string>;

				expectResultError('Unwrap failed', 'Some error message', () => result.unwrap());
			});
		});

		describe('unwrapErr', () => {
			test('GIVEN ok THEN throws ResultError', () => {
				const result = Result.ok(2) as Result<number, string>;

				expectResultError('Unwrap failed', 2, () => result.unwrapErr());
			});

			test('GIVEN err THEN returns error', () => {
				const result = Result.err('Some error message') as Result<number, string>;

				expect<string>(result.unwrapErr()).toBe('Some error message');
			});
		});

		describe('unwrapOr', () => {
			// TODO: Write tests
		});

		describe('unwrapOrElse', () => {
			// TODO: Write tests
		});

		describe('and', () => {
			// TODO: Write tests
		});

		describe('andThen', () => {
			// TODO: Write tests
		});

		describe('or', () => {
			// TODO: Write tests
		});

		describe('orElse', () => {
			// TODO: Write tests
		});

		describe('contains', () => {
			// TODO: Write tests
		});

		describe('containsErr', () => {
			// TODO: Write tests
		});

		describe('transpose', () => {
			// TODO: Write tests
		});

		describe('flatten', () => {
			// TODO: Write tests
		});

		describe('intoOkOrErr', () => {
			// TODO: Write tests
		});

		describe('eq', () => {
			// TODO: Write tests
		});

		describe('ne', () => {
			// TODO: Write tests
		});

		describe('match', () => {
			test('GIVEN ok THEN calls ok callback', () => {
				const result = Result.ok(2) as Result<number, string>;
				const ok = jest.fn((value: number) => value * 2);
				const err = jest.fn((error: string) => error.length);

				expect<number>(result.match({ ok, err })).toBe(4);
				expect(ok).toHaveBeenCalledTimes(1);
				expect(ok).toHaveBeenCalledWith(2);
				expect(ok).toHaveReturnedWith(4);
				expect(err).not.toHaveBeenCalled();
			});

			test('GIVEN ok THEN calls ok callback', () => {
				const result = Result.err('Some error message') as Result<number, string>;
				const ok = jest.fn((value: number) => value * 2);
				const err = jest.fn((error: string) => error.length);

				expect<number>(result.match({ ok, err })).toBe(18);
				expect(ok).not.toHaveBeenCalled();
				expect(err).toHaveBeenCalledTimes(1);
				expect(err).toHaveBeenCalledWith('Some error message');
				expect(err).toHaveReturnedWith(18);
			});
		});
	});

	describe('ok', () => {
		test('GIVEN ok THEN returns { isOk->true, isErr->false }', () => {
			const returnValue = Result.ok(42);

			expect<true>(returnValue.isOk()).toBe(true);
			expect<false>(returnValue.isErr()).toBe(false);
		});
	});

	describe('err', () => {
		test('GIVEN err THEN returns { isOk->false, isErr->true }', () => {
			const returnValue = Result.err(new Error());

			expect<false>(returnValue.isOk()).toBe(false);
			expect<true>(returnValue.isErr()).toBe(true);
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

function expectResultError<E>(message: string, value: E, cb: () => any) {
	try {
		cb();

		throw new Error('cb should have thrown');
	} catch (raw) {
		const error = raw as ResultError<E>;

		expect(error).toBeInstanceOf(ResultError);
		expect<string>(error.name).toBe('ResultError');
		expect<string>(error.message).toBe(message);
		expect<E>(error.value).toBe(value);
	}
}
