import { setTimeout as sleep } from 'node:timers/promises';
import { Option, Result, ResultError, err, none, ok, some, type Err, type None, type Ok, type Some } from '../src/index.js';
import { error, makeThrow } from './shared.js';

describe('Result', () => {
	describe('prototype', () => {
		describe('isOk', () => {
			test('GIVEN ok THEN always returns true', () => {
				const x = ok(42);
				expect<boolean>(x.isOk()).toBe(true);
			});

			test('GIVEN err THEN always returns false', () => {
				const x = err('Some error message');
				expect<false>(x.isOk()).toBe(false);
			});
		});

		describe('isOkAnd', () => {
			test('GIVEN ok AND true-returning callback THEN returns true', () => {
				const x = ok(2);
				const cb = vi.fn((value: number) => value > 1);

				expect(x.isOkAnd(cb)).toBe(true);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveLastReturnedWith(true);
			});

			test('GIVEN ok AND false-returning callback THEN returns false', () => {
				const x = ok(0);
				const cb = vi.fn((value: number) => value > 1);

				expect(x.isOkAnd(cb)).toBe(false);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(0);
				expect(cb).toHaveLastReturnedWith(false);
			});

			test('GIVEN err THEN always returns false', () => {
				const x = err('Some error message');
				const cb = vi.fn((value: number) => value > 1);

				expect<false>(x.isOkAnd(cb)).toBe(false);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('isErr', () => {
			test('GIVEN ok THEN returns false', () => {
				const x = ok(42);
				expect<false>(x.isErr()).toBe(false);
			});

			test('GIVEN err THEN returns true', () => {
				const x = err('Some error message');
				expect<boolean>(x.isErr()).toBe(true);
			});
		});

		describe('isErrAnd', () => {
			test('GIVEN ok AND true-returning callback THEN returns true', () => {
				const x = ok(2);
				const cb = vi.fn((value: Error) => value instanceof TypeError);

				expect(x.isErrAnd(cb)).toBe(false);
				expect(cb).not.toHaveBeenCalled();
			});

			test('GIVEN err AND false-returning callback THEN returns false', () => {
				const error = new Error('Some error message');
				const x = err(error);
				const cb = vi.fn((value: Error) => value instanceof TypeError);

				expect(x.isErrAnd(cb)).toBe(false);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(error);
				expect(cb).toHaveLastReturnedWith(false);
			});

			test('GIVEN err AND true-returning callback THEN returns false', () => {
				const error = new TypeError('Some error message');
				const x = err(error);
				const cb = vi.fn((value: Error) => value instanceof TypeError);

				expect(x.isErrAnd(cb)).toBe(true);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(error);
				expect(cb).toHaveLastReturnedWith(true);
			});
		});

		describe('ok', () => {
			test('GIVEN ok THEN returns some', () => {
				const x = ok(2);

				expect<Some<number>>(x.ok()).toEqual(some(2));
			});

			test('GIVEN err THEN returns none', () => {
				const x = err('Some error message');

				expect<None>(x.ok()).toEqual(none);
			});
		});

		describe('err', () => {
			test('GIVEN ok THEN returns none', () => {
				const x = ok(2);

				expect<None>(x.err()).toEqual(none);
			});

			test('GIVEN err THEN returns some', () => {
				const x = err('Some error message');

				expect<Some<string>>(x.err()).toEqual(Option.some('Some error message'));
			});
		});

		describe('map', () => {
			test('GIVEN ok THEN returns ok with mapped value', () => {
				const x = ok(2);
				const cb = vi.fn((value: number) => value > 1);

				expect<Ok<boolean>>(x.map(cb)).toEqual(ok(true));
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveLastReturnedWith(true);
			});

			test('GIVEN err THEN returns err', () => {
				const x = err('Some error message');
				const cb = vi.fn((value: number) => value > 1);

				expect(x.map(cb)).toEqual(err('Some error message'));
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('mapInto', () => {
			test('GIVEN ok THEN returns mapped result', () => {
				const x = ok(2);
				const cb = vi.fn((value: number) => ok(value > 1));

				expect<Ok<boolean>>(x.mapInto(cb)).toEqual(ok(true));
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveLastReturnedWith(ok(true));
			});

			test('GIVEN err THEN returns itself', () => {
				const x = err('Some error message');
				const cb = vi.fn((value: number) => ok(value > 1));

				expect(x.mapInto(cb)).toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('mapOr', () => {
			test('GIVEN ok THEN returns ok with mapped value', () => {
				const x = ok(2);
				const cb = vi.fn((value: number) => value > 1);

				expect<boolean>(x.mapOr(false, cb)).toEqual(true);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveLastReturnedWith(true);
			});

			test('GIVEN err THEN returns err', () => {
				const x = err('Some error message');
				const cb = vi.fn((value: number) => value > 1);

				expect<boolean>(x.mapOr(false, cb)).toEqual(false);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('mapOrElse', () => {
			test('GIVEN ok THEN returns ok with mapped value', () => {
				const x = ok(2);
				const op = vi.fn(() => false);
				const cb = vi.fn((value: number) => value > 1);

				expect<boolean>(x.mapOrElse(op, cb)).toEqual(true);
				expect(op).not.toHaveBeenCalled();
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(cb).toHaveLastReturnedWith(true);
			});

			test('GIVEN err THEN returns err', () => {
				const x = err('Some error message');
				const op = vi.fn(() => false);
				const cb = vi.fn((value: number) => value > 1);

				expect<boolean>(x.mapOrElse(op, cb)).toEqual(false);
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith('Some error message');
				expect(op).toHaveLastReturnedWith(false);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('mapErr', () => {
			test('GIVEN ok THEN returns ok', () => {
				const x = ok(2);
				const cb = vi.fn((error: string) => error.length);

				expect<Result<number, number>>(x.mapErr(cb)).toEqual(ok(2));
				expect(cb).not.toHaveBeenCalled();
			});

			test('GIVEN ok THEN returns err with mapped value', () => {
				const x = err('Some error message');
				const cb = vi.fn((error: string) => error.length);

				expect<Result<number, number>>(x.mapErr(cb)).toEqual(err(18));
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith('Some error message');
				expect(cb).toHaveLastReturnedWith(18);
			});
		});

		describe('mapErrInto', () => {
			test('GIVEN ok THEN returns itself', () => {
				const x = ok(2);
				const cb = vi.fn((error: string) => ok(error.length));

				expect<Result<number, number>>(x.mapErrInto(cb)).toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});

			test('GIVEN err THEN returns mapped result', () => {
				const x = err('Some error message');
				const cb = vi.fn((error: string) => ok(error.length));

				expect<Result<number, number>>(x.mapErrInto(cb)).toEqual(ok(18));
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith('Some error message');
				expect(cb).toHaveLastReturnedWith(ok(18));
			});
		});

		describe('inspect', () => {
			test('GIVEN ok THEN calls callback and returns self', () => {
				const x = ok(2);
				const cb = vi.fn();

				expect<typeof x>(x.inspect(cb)).toBe(x);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
			});

			test('GIVEN err THEN returns self', () => {
				const x = err('Some error message');
				const cb = vi.fn();

				expect<typeof x>(x.inspect(cb)).toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('inspectAsync', () => {
			test('GIVEN ok THEN calls callback and returns self', async () => {
				const x = ok(2);
				let finished = false;
				const cb = vi.fn(() => sleep(5).then(() => (finished = true)));

				await expect<Promise<typeof x>>(x.inspectAsync(cb)).resolves.toBe(x);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith(2);
				expect(finished).toBe(true);
			});

			test('GIVEN err THEN returns self', async () => {
				const x = err('Some error message');
				const cb = vi.fn();

				await expect<Promise<typeof x>>(x.inspectAsync(cb)).resolves.toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});
		});

		describe('inspectErr', () => {
			test('GIVEN ok THEN calls callback and returns self', () => {
				const x = ok(2);
				const cb = vi.fn();

				expect<typeof x>(x.inspectErr(cb)).toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});

			test('GIVEN err THEN returns self', () => {
				const x = err('Some error message');
				const cb = vi.fn();

				expect<typeof x>(x.inspectErr(cb)).toBe(x);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith('Some error message');
			});
		});

		describe('inspectErrAsync', () => {
			test('GIVEN ok THEN calls callback and returns self', async () => {
				const x = ok(2);
				const cb = vi.fn();

				await expect<Promise<typeof x>>(x.inspectErrAsync(cb)).resolves.toBe(x);
				expect(cb).not.toHaveBeenCalled();
			});

			test('GIVEN err THEN returns self', async () => {
				const x = err('Some error message');
				let finished = false;
				const cb = vi.fn(() => sleep(5).then(() => (finished = true)));

				await expect<Promise<typeof x>>(x.inspectErrAsync(cb)).resolves.toBe(x);
				expect(cb).toHaveBeenCalledTimes(1);
				expect(cb).toHaveBeenCalledWith('Some error message');
				expect(finished).toBe(true);
			});
		});

		describe('iter', () => {
			test('GIVEN ok THEN yields one value', () => {
				const x = ok(2);

				expect<number[]>([...x.iter()]).toStrictEqual([2]);
			});

			test('GIVEN err THEN yields no values', () => {
				const x = err('Some error message');

				expect<number[]>([...x.iter()]).toStrictEqual([]);
			});
		});

		describe('expect', () => {
			test('GIVEN ok THEN returns value', () => {
				const x = ok(2);

				expect<number>(x.expect('Whoops!')).toBe(2);
			});

			test('GIVEN err THEN throws ResultError', () => {
				const x = err('Some error message');

				expectResultError('Whoops!', 'Some error message', () => x.expect('Whoops!'));
			});
		});

		describe('expectErr', () => {
			test('GIVEN ok THEN throws ResultError', () => {
				const x = ok(2);

				expectResultError('Whoops!', 2, () => x.expectErr('Whoops!'));
			});

			test('GIVEN err THEN returns error', () => {
				const x = err('Some error message');

				expect<string>(x.expectErr('Whoops!')).toBe('Some error message');
			});
		});

		describe('unwrap', () => {
			test('GIVEN ok THEN returns value', () => {
				const x = ok(2);

				expect<number>(x.unwrap()).toBe(2);
			});

			test('GIVEN err THEN throws ResultError', () => {
				const x = err('Some error message');

				expectResultError('Unwrap failed', 'Some error message', () => x.unwrap());
			});
		});

		describe('unwrapErr', () => {
			test('GIVEN ok THEN throws ResultError', () => {
				const x = ok(2);

				expectResultError('Unwrap failed', 2, () => x.unwrapErr());
			});

			test('GIVEN err THEN returns error', () => {
				const x = err('Some error message');

				expect<string>(x.unwrapErr()).toBe('Some error message');
			});
		});

		describe('unwrapOr', () => {
			test('GIVEN ok THEN returns value', () => {
				const x = ok(2);

				expect<number>(x.unwrapOr(5)).toBe(2);
			});

			test('GIVEN err THEN returns default', () => {
				const x = err('Some error message');

				expect<5>(x.unwrapOr(5)).toBe(5);
			});

			test('GIVEN Result<T, E> THEN returns union', () => {
				const x = ok(2) as Result<number, string>;

				expect<number | null>(x.unwrapOr(null)).toBe(2);
			});
		});

		describe('unwrapOrElse', () => {
			test('GIVEN ok THEN returns value', () => {
				const x = ok(2);

				expect<number>(x.unwrapOrElse(() => 5)).toBe(2);
			});

			test('GIVEN err THEN returns default', () => {
				const x = err('Some error message');

				expect<5>(x.unwrapOrElse(() => 5)).toBe(5);
			});

			test('GIVEN Result<T, E> THEN returns union', () => {
				const x = ok(2) as Result<number, string>;

				expect<number | null>(x.unwrapOrElse(() => null)).toBe(2);
			});
		});

		describe('unwrapRaw', () => {
			test('GIVEN ok THEN returns value', () => {
				const x = ok(2);

				expect<number>(x.unwrapRaw()).toBe(2);
			});

			test('GIVEN err THEN throws Error', () => {
				const error = new Error('Some error message');
				const x = err(error);

				expect(() => x.unwrapRaw()).toThrowError(error);
			});
		});

		describe('and', () => {
			test('GIVEN x=ok and y=ok THEN returns y', () => {
				const x = ok(2);
				const y = ok('Hello');

				expect<typeof y>(x.and(y)).toBe(y);
			});

			test('GIVEN x=ok and y=err THEN returns y', () => {
				const x = ok(2);
				const y = err('Late error');

				expect<typeof y>(x.and(y)).toBe(y);
			});

			test('GIVEN x=err and y=ok THEN returns x', () => {
				const x = err('Early error');
				const y = ok('Hello');

				expect<typeof x>(x.and(y)).toBe(x);
			});

			test('GIVEN x=err and y=err THEN returns x', () => {
				const x = err('Early error');
				const y = err('Late error');

				expect<typeof x>(x.and(y)).toBe(x);
			});
		});

		describe('andThen', () => {
			const cb = (value: number) => (value === 0 ? err('overflowed') : ok(4 / value));

			test('GIVEN ok AND ok-returning callback THEN returns ok', () => {
				const x = ok(4);
				const op = vi.fn(cb);

				expect<Result<number, string>>(x.andThen(op)).toEqual(ok(1));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith(4);
				expect(op).toHaveLastReturnedWith(ok(1));
			});

			test('GIVEN ok AND err-returning callback THEN returns err', () => {
				const x = ok(0);
				const op = vi.fn(cb);

				expect<Result<number, string>>(x.andThen(op)).toEqual(err('overflowed'));
				expect(op).toHaveBeenCalledTimes(1);
				expect(op).toHaveBeenCalledWith(0);
				expect(op).toHaveLastReturnedWith(err('overflowed'));
			});

			test('GIVEN err THEN always returns err', () => {
				const x = err('not a number');
				const op = vi.fn(cb);

				expect<typeof x>(x.andThen(op)).toBe(x);
				expect(op).not.toHaveBeenCalled();
			});
		});

		describe('or', () => {
			test('GIVEN x=ok and y=ok THEN returns x', () => {
				const x = ok(2);
				const y = ok(100);

				expect<typeof x>(x.or(y)).toBe(x);
			});

			test('GIVEN x=ok and y=err THEN returns x', () => {
				const x = ok(2);
				const y = err('Late error');

				expect<typeof x>(x.or(y)).toBe(x);
			});

			test('GIVEN x=err and y=ok THEN returns y', () => {
				const x = err('Early error');
				const y = ok(2);

				expect<typeof y>(x.or(y)).toBe(y);
			});

			test('GIVEN x=err and y=err THEN returns y', () => {
				const x = err('Early error');
				const y = err('Late error');

				expect<typeof y>(x.or(y)).toBe(y);
			});
		});

		describe('orElse', () => {
			const square = (value: number) => ok(value * value);
			const wrapErr = (error: number) => err(error);

			test('GIVEN x=ok, a->ok, b->ok THEN returns x without calling a or b', () => {
				const x = ok(2);
				const a = vi.fn(square);
				const b = vi.fn(square);

				expect<typeof x>(x.orElse(a).orElse(b)).toBe(x);
				expect(a).not.toHaveBeenCalled();
				expect(b).not.toHaveBeenCalled();
			});

			test('GIVEN x=ok, a->ok, b->err THEN returns x without calling a or b', () => {
				const x = ok(2);
				const a = vi.fn(square);
				const b = vi.fn(wrapErr);

				expect<typeof x>(x.orElse(a).orElse(b)).toBe(x);
				expect(a).not.toHaveBeenCalled();
				expect(b).not.toHaveBeenCalled();
			});

			test('GIVEN x=err, a->ok, b->err THEN returns ok without calling b', () => {
				const x = err(3);
				const a = vi.fn(square);
				const b = vi.fn(wrapErr);

				expect<Ok<number>>(x.orElse(a).orElse(b)).toEqual(ok(9));
				expect(a).toHaveBeenCalledTimes(1);
				expect(a).toHaveBeenCalledWith(3);
				expect(a).toHaveLastReturnedWith(ok(9));
				expect(b).not.toHaveBeenCalled();
			});

			test('GIVEN x=err, a->err, b->err THEN returns ok calling a and b', () => {
				const x = err(3);
				const a = vi.fn(wrapErr);
				const b = vi.fn(wrapErr);

				expect<Err<number>>(x.orElse(a).orElse(b)).toEqual(err(3));
				expect(a).toHaveBeenCalledTimes(1);
				expect(a).toHaveBeenCalledWith(3);
				expect(a).toHaveLastReturnedWith(err(3));
				expect(b).toHaveBeenCalledTimes(1);
				expect(b).toHaveBeenCalledWith(3);
				expect(b).toHaveLastReturnedWith(err(3));
			});
		});

		describe('contains', () => {
			test('GIVEN ok AND matching value THEN returns true', () => {
				const x = ok(2);

				expect<boolean>(x.contains(2)).toBe(true);
			});

			test('GIVEN ok AND different value THEN returns false', () => {
				const x = ok(3);

				expect<boolean>(x.contains(2)).toBe(false);
			});

			test('GIVEN err THEN always returns false', () => {
				const x = err('Some error message');

				expect<false>(x.contains(2)).toBe(false);
			});
		});

		describe('containsErr', () => {
			test('GIVEN ok THEN always returns false', () => {
				const x = ok(2);

				expect<false>(x.containsErr('Some error message')).toBe(false);
			});

			test('GIVEN err AND matching value THEN returns true', () => {
				const x = err('Some error message');

				expect<boolean>(x.containsErr('Some error message')).toBe(true);
			});

			test('GIVEN err AND different value THEN returns false', () => {
				const x = err('Some other error message');

				expect<boolean>(x.containsErr('Some error message')).toBe(false);
			});
		});

		describe('transpose', () => {
			test('GIVEN Ok<Some<T>> THEN returns Some<Ok<T>>', () => {
				const x = ok(some(5));

				expect(x.transpose()).toEqual(some(ok(5)));
			});

			test('GIVEN Ok<None> THEN returns None', () => {
				const x = ok(none);

				expect(x.transpose()).toEqual(none);
			});

			test('GIVEN Err<E> THEN returns Some<Err<E>>', () => {
				const x = err('Some error message');

				expect(x.transpose()).toEqual(some(err('Some error message')));
			});
		});

		describe('flatten', () => {
			test('GIVEN Ok<Ok<T>> THEN returns Ok<T>', () => {
				const x = ok(ok('Hello'));

				expect<Ok<string>>(x.flatten()).toEqual(ok('Hello'));
			});

			test('GIVEN Ok<Err<E>> THEN returns Err<E>', () => {
				const x = ok(err(6));

				expect<Err<number>>(x.flatten()).toEqual(err(6));
			});

			test('GIVEN Err<E> THEN returns Err<E>', () => {
				const x = err(6);

				expect<typeof x>(x.flatten()).toBe(x);
			});
		});

		describe('intoOkOrErr', () => {
			test('GIVEN ok(s) THEN returns s', () => {
				const x = ok(3);

				expect<number>(x.intoOkOrErr()).toBe(3);
			});

			test('GIVEN err(e) THEN returns e', () => {
				const x = err(4);

				expect<number>(x.intoOkOrErr()).toBe(4);
			});
		});

		describe('intoPromise', () => {
			test('GIVEN ok(Promise(s)) THEN returns Promise(ok(s))', async () => {
				const x = ok(Promise.resolve(3));

				await expect<Promise<Ok<number>>>(x.intoPromise()).resolves.toEqual(ok(3));
			});

			test('GIVEN err(Promise(e)) THEN returns Promise(err(e))', async () => {
				const x = err(Promise.resolve(3));

				await expect<Promise<Err<number>>>(x.intoPromise()).resolves.toEqual(err(3));
			});
		});

		describe('eq', () => {
			test('GIVEN x=ok(s), y=ok(s) THEN returns true', () => {
				const x = ok(3);
				const y = ok(3);

				expect<boolean>(x.eq(y)).toBe(true);
			});

			test('GIVEN x=ok(s), y=ok(t) / s !== t THEN returns false', () => {
				const x = ok(3);
				const y = ok(4);

				expect<boolean>(x.eq(y)).toBe(false);
			});

			test('GIVEN x=ok(s), y=err(e) THEN always returns false', () => {
				const x = ok(3);
				const y = err(3);

				expect<false>(x.eq(y)).toBe(false);
			});

			test('GIVEN x=err(e), y=ok(t) THEN always returns false', () => {
				const x = err(3);
				const y = ok(3);

				expect<false>(x.eq(y)).toBe(false);
			});

			test('GIVEN x=err(e), y=err(e) THEN returns true', () => {
				const x = err(3);
				const y = err(3);

				expect<boolean>(x.eq(y)).toBe(true);
			});

			test('GIVEN x=err(e), y=err(t) / e !== t THEN returns false', () => {
				const x = ok(3);
				const y = ok(4);

				expect<boolean>(x.eq(y)).toBe(false);
			});
		});

		describe('ne', () => {
			test('GIVEN x=ok(s), y=ok(s) THEN returns false', () => {
				const x = ok(3);
				const y = ok(3);

				expect<boolean>(x.ne(y)).toBe(false);
			});

			test('GIVEN x=ok(s), y=ok(t) / s !== t THEN returns true', () => {
				const x = ok(3);
				const y = ok(4);

				expect<boolean>(x.ne(y)).toBe(true);
			});

			test('GIVEN x=ok(s), y=err(e) THEN always returns true', () => {
				const x = ok(3);
				const y = err(3);

				expect<true>(x.ne(y)).toBe(true);
			});

			test('GIVEN x=err(e), y=ok(t) THEN always returns true', () => {
				const x = err(3);
				const y = ok(3);

				expect<true>(x.ne(y)).toBe(true);
			});

			test('GIVEN x=err(e), y=err(e) THEN returns false', () => {
				const x = err(3);
				const y = err(3);

				expect<boolean>(x.ne(y)).toBe(false);
			});

			test('GIVEN x=err(e), y=err(t) / e !== t THEN returns true', () => {
				const x = ok(3);
				const y = ok(4);

				expect<boolean>(x.ne(y)).toBe(true);
			});
		});

		describe('match', () => {
			test('GIVEN ok THEN calls ok callback', () => {
				const x = Result.ok(2);
				const ok = vi.fn((value: number) => value * 2);
				const err = vi.fn((error: string) => error.length);

				expect<number>(x.match({ ok, err })).toBe(4);
				expect(ok).toHaveBeenCalledTimes(1);
				expect(ok).toHaveBeenCalledWith(2);
				expect(ok).toHaveLastReturnedWith(4);
				expect(err).not.toHaveBeenCalled();
			});

			test('GIVEN ok THEN calls ok callback', () => {
				const x = Result.err('Some error message');
				const ok = vi.fn((value: number) => value * 2);
				const err = vi.fn((error: string) => error.length);

				expect<number>(x.match({ ok, err })).toBe(18);
				expect(ok).not.toHaveBeenCalled();
				expect(err).toHaveBeenCalledTimes(1);
				expect(err).toHaveBeenCalledWith('Some error message');
				expect(err).toHaveLastReturnedWith(18);
			});
		});
	});

	describe('ok', () => {
		test('GIVEN ok THEN returns { isOk->true, isErr->false }', () => {
			const x = ok(42);

			expect<boolean>(x.isOk()).toBe(true);
			expect<false>(x.isErr()).toBe(false);
		});
	});

	describe('err', () => {
		test('GIVEN err THEN returns { isOk->false, isErr->true }', () => {
			const x = err(new Error());

			expect<false>(x.isOk()).toBe(false);
			expect<boolean>(x.isErr()).toBe(true);
		});
	});

	describe('from', () => {
		const { from } = Result;

		test.each([
			['T', 42],
			['Ok(T)', ok(42)],
			['() => T', () => 42],
			['() => Ok(T)', () => ok(42)]
		])('GIVEN from(%s) THEN returns Ok(T)', (_, cb) => {
			const x = from(cb);

			expect(x).toStrictEqual(ok(42));
		});

		test.each([
			['Err(E)', err(error)],
			['() => Err(E)', () => err(error)],
			['() => throw E', makeThrow]
		])('GIVEN from(%s) THEN returns Err(E)', (_, resolvable) => {
			const x = from(resolvable);

			expect(x).toStrictEqual(err(error));
		});
	});

	describe('fromAsync', () => {
		const { fromAsync } = Result;

		test.each([
			['T', 42],
			['Promise.resolve(T)', Promise.resolve(42)],
			['Ok(T)', ok(42)],
			['Promise.resolve(Ok(T))', Promise.resolve(ok(42))],
			['() => T', () => 42],
			['() => Promise.resolve(T)', () => Promise.resolve(42)],
			['() => Ok(T)', () => ok(42)],
			['() => Promise.resolve(Ok(T))', () => Promise.resolve(ok(42))]
		])('GIVEN fromAsync(%s) THEN returns Ok(T)', async (_, cb) => {
			const x = await fromAsync(cb);

			expect(x).toStrictEqual(ok(42));
		});

		test.each([
			['Err(E)', err(error)],
			['() => throw E', makeThrow],
			['() => Promise.reject(E)', () => Promise.reject(error)],
			['() => Err(E)', () => err(error)],
			['() => Promise.reject(Err(E))', () => Promise.reject(err(error))]
		])('GIVEN fromAsync(%s) THEN returns Err(E)', async (_, resolvable) => {
			const x = await fromAsync(resolvable);

			expect(x).toStrictEqual(err(error));
		});
	});

	describe('all', () => {
		test('GIVEN empty array THEN returns Result<[], never>', () => {
			expect<Result<[], never>>(Result.all([])).toEqual(ok([]));
		});

		type Expected = Result<[number, boolean, bigint], string>;

		test('GIVEN array of Ok THEN returns Ok', () => {
			const a: Result<number, string> = ok(5);
			const b: Result<boolean, string> = ok(true);
			const c: Result<bigint, string> = ok(1n);

			expect<Expected>(Result.all([a, b, c])).toEqual(ok([5, true, 1n]));
		});

		test('GIVEN array of Ok with one Err THEN returns Err', () => {
			const a: Result<number, string> = ok(5);
			const b: Result<boolean, string> = ok(true);
			const c: Result<bigint, string> = err('Error!');

			expect<Expected>(Result.all([a, b, c])).toBe(c);
		});
	});

	describe('any', () => {
		test('GIVEN empty array THEN returns Result<[], never>', () => {
			expect<Result<never, []>>(Result.any([])).toEqual(err([]));
		});

		type Expected = Result<number | boolean | bigint, [string, string, string]>;

		test('GIVEN array with at least one Ok THEN returns first Ok', () => {
			const a: Result<number, string> = ok(5);
			const b: Result<boolean, string> = ok(true);
			const c: Result<bigint, string> = err('Error!');

			expect<Expected>(Result.any([a, b, c])).toBe(a);
		});

		test('GIVEN array of Ok with one Err THEN returns Err', () => {
			const a: Result<number, string> = err('Not a number!');
			const b: Result<boolean, string> = err('Not a boolean!');
			const c: Result<bigint, string> = err('Error!');

			expect<Expected>(Result.any([a, b, c])).toEqual(err(['Not a number!', 'Not a boolean!', 'Error!']));
		});
	});

	describe('types', () => {
		test('GIVEN Ok<T> THEN assigns to Result<T, E>', () => {
			expect<Result<number, string>>(ok(4));
		});

		test('GIVEN Err<E> THEN assigns to Result<T, E>', () => {
			expect<Result<number, string>>(err('foo'));
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
