import type { Option } from '../Option';
import { none, type None } from '../Option/None';
import { some, type Some } from '../Option/Some';
import type { Result } from '../Result';
import type { Err } from './Err';
import { ResultError } from './ResultError';

export class Ok<T> {
	private readonly value: T;

	public constructor(value: T) {
		this.value = value;
	}

	/**
	 * Returns `true` if the result is `Ok`.
	 *
	 * @example
	 * ```typescript
	 * const x = ok(-3);
	 * assert.equal(x.isOk(), true);
	 * ```
	 * @example
	 * ```typescript
	 * const x = err('Some error message');
	 * assert.equal(x.isOk(), false);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.is_ok}
	 */
	public isOk(): true {
		return true;
	}

	/**
	 * Returns `true` if the result is `Ok` and the value inside of it matches a predicate.
	 *
	 * @example
	 * ```typescript
	 * const x = ok(2);
	 * assert.equal(x.isOkAnd((value) => value > 1), true);
	 * ```
	 * @example
	 * ```typescript
	 * const x = ok(0);
	 * assert.equal(x.isOkAnd((value) => value > 1), false);
	 * ```
	 * @example
	 * ```typescript
	 * const x = err('Some error message');
	 * assert.equal(x.isOkAnd((value) => value > 1), false);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.is_ok_and}
	 */
	public isOkAnd<R extends boolean>(cb: (value: T) => R): R {
		return cb(this.value);
	}

	/**
	 * Returns `true` if the result is `Err`.
	 *
	 * @example
	 * ```typescript
	 * const x = ok(-3);
	 * assert.equal(x.isErr(), false);
	 * ```
	 * @example
	 * ```typescript
	 * const x = err('Some error message');
	 * assert.equal(x.isErr(), true);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.is_err}
	 */
	public isErr(): false {
		return false;
	}

	/**
	 * Returns `true` if the result is `Err` and the value inside of it matches a predicate.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * const x = ok(2);
	 * assert.equal(x.isErrAnd((error) => error instanceof TypeError), false);
	 * ```
	 * @example
	 * ```typescript
	 * const x = err(new Error('Some error message'));
	 * assert.equal(x.isErrAnd((error) => error instanceof TypeError), false);
	 * ```
	 * @example
	 * ```typescript
	 * const x = err(new TypeError('Some error message'));
	 * assert.equal(x.isErrAnd((error) => error instanceof TypeError), true);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.is_err_and}
	 */
	public isErrAnd(cb?: (error: never) => boolean): false;
	public isErrAnd(): false {
		return false;
	}

	/**
	 * Converts from `Result<T, E>` to `Option<T>`.
	 *
	 * Converts itself into an `Option<T>`, and discarding the error, if any.
	 *
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = ok(2);
	 * assert.equal(x.ok(), some(2));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = err('Some error message');
	 * assert.equal(x.ok(), none);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.ok}
	 */
	public ok(): Some<T> {
		return some(this.value);
	}

	/**
	 * Converts from `Result<T, E>` to `Option<E>`.
	 *
	 * Converts itself into an `Option<E>`, and discarding the successful value, if any.
	 *
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = ok(2);
	 * assert.equal(x.err(), none);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = err('Some error message');
	 * assert.equal(x.err(), 'Some error message');
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.err}
	 */
	public err(): None {
		return none;
	}

	/**
	 * Maps a `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok` value, leaving an `Err` value
	 * untouched.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = ok(2);
	 * assert.equal(x.map((value) => value * 2), ok(4));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = err('Some error message');
	 * assert.equal(x.map((value) => value * 2), err('Some error message'));
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.map}
	 */
	public map<U>(cb: (value: T) => U): Ok<U> {
		return ok(cb(this.value));
	}

	/**
	 * Returns the provided default (if `Err`), or applies a function to the contained value (if `Ok`),
	 *
	 * Arguments passed to `mapOr` are eagerly evaluated; if you are passing the result of a function call, it is
	 * recommended to use `mapOrElse`, which is lazily evaluated.
	 * @param defaultValue The default value to use.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * const x = ok('hello');
	 * assert.equal(x.mapOr(42, (value) => value.length), 5);
	 * ```
	 * @example
	 * ```typescript
	 * const x = err('Some error message');
	 * assert.equal(x.mapOr(42, (value) => value.length), 42);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or}
	 */
	public mapOr<U>(_: U, cb: (value: T) => U): U {
		return cb(this.value);
	}

	/**
	 * Maps a `Result<T, E>` to `U` by applying fallback function default to a contained `Err` value, or function `cb`
	 * to a contained `Ok` value.
	 *
	 * This function can be used to unpack a successful result while handling an error.
	 * @param op The predicate that is run on `Err`.
	 * @param cb The predicate that is run on `Ok`.
	 *
	 * @example
	 * ```typescript
	 * const x: Result<string, string> = ok('hello');
	 * assert.equal(x.mapOrElse((error) => error.length, (value) => value.length), 5);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<string, string> = err('Some error message');
	 * assert.equal(x.mapOrElse((error) => error.length, (value) => value.length), 18);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.map_or_else}
	 */
	public mapOrElse<U>(_: (error: never) => U, cb: (value: T) => U): U {
		return cb(this.value);
	}

	/**
	 * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value
	 * untouched.
	 *
	 * This function can be used to pass through a successful result while handling an error.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * const x: Result<number, Error> = ok(2);
	 * assert.equal(x.mapErr((error) => error.message), ok(2));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, Error> = err(new Error('Some error message'));
	 * assert.equal(x.mapErr((error) => error.message), err('Some error message'));
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.map_err}
	 */
	public mapErr(cb?: (error: never) => any): this;
	public mapErr(): this {
		return this;
	}

	/**
	 * Calls the provided closure with a reference to the contained value (if `Ok`).
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * ok(2).inspect(console.log);
	 * // Logs: 2
	 * ```
	 * @example
	 * ```typescript
	 * err('Some error message').inspect(console.log);
	 * // Doesn't log
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect}
	 */
	public inspect(cb: (value: T) => void): this {
		cb(this.value);
		return this;
	}

	/**
	 * Calls the provided closure with a reference to the contained error (if `Err`).
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * ok(2).inspectErr(console.log);
	 * // Doesn't log
	 * ```
	 * @example
	 * ```typescript
	 * err('Some error message').inspectErr(console.log);
	 * // Logs: Some error message
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.inspect_err}
	 */
	public inspectErr(cb?: (error: never) => void): this;
	public inspectErr(): this {
		return this;
	}

	/**
	 * Returns an iterator over the possibly contained value.
	 *
	 * The iterator yields one value if the result is `Ok`, otherwise none.
	 *
	 * @example
	 * ```typescript
	 * const x = ok(7);
	 * for (const value of x.iter()) {
	 *   console.log(value);
	 * }
	 * // Logs 7
	 * ```
	 * @example
	 * ```typescript
	 * const x = err('Nothing!');
	 * for (const value of x.iter()) {
	 *   console.log(value);
	 * }
	 * // Doesn't log
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.iter}
	 */
	public *iter(): Generator<T> {
		yield this.value;
	}

	/**
	 * Returns the contained `Ok` value.
	 *
	 * If the value is an `Err`, it throws a {@link ResultError} with the given message and the content of the `Err`.
	 * @param message The message for the error.
	 *
	 * @example
	 * ```typescript
	 * const x = ok(2);
	 * assert.equal(x.expect('Whoops!'), 2);
	 * ```
	 * @example
	 * ```typescript
	 * const x = err('Emergency failure');
	 * assert.throws(() => x.expect('Whoops!'), {
	 *   name: 'ResultError',
	 *   message: 'Whoops',
	 *   value: 'Emergency failure'
	 * });
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.expect}
	 */
	public expect(message?: string): T;
	public expect(): T {
		return this.value;
	}

	/**
	 * Returns the contained `Err` value.
	 *
	 * If the value is an `Ok`, it throws a {@link ResultError} with the given message and the content of the `Ok`.
	 * @param message The message for the error.
	 *
	 * @example
	 * ```typescript
	 * const x = ok(2);
	 * assert.throws(() => x.expectErr('Whoops!'), {
	 *   name: 'ResultError',
	 *   message: 'Whoops',
	 *   value: 2
	 * });
	 * ```
	 * @example
	 * ```typescript
	 * const x = err('Emergency failure');
	 * assert.equal(x.expectErr('Whoops!'), 'Emergency failure');
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.expect_err}
	 */
	public expectErr(message: string): never {
		throw new ResultError(message, this.value);
	}

	/**
	 * Returns the contained `Ok` value.
	 *
	 * If the value is an `Err`, it throws a {@link ResultError} with the message, and the content of the `Err`.
	 * @seealso {@link unwrapOr}
	 * @seealso {@link unwrapOrElse}
	 *
	 * @example
	 * ```typescript
	 * const x = ok(2);
	 * assert.equal(x.unwrap(), 2);
	 * ```
	 * @example
	 * ```typescript
	 * const x = err('Emergency failure');
	 * assert.throws(() => x.unwrap(), {
	 *   name: 'ResultError',
	 *   message: 'Unwrap failed',
	 *   value: 'Emergency failure'
	 * });
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap}
	 */
	public unwrap(): T {
		return this.value;
	}

	/**
	 * Returns the contained `Err` value.
	 *
	 * If the value is an `Ok`, it throws a {@link ResultError} with the message, and the content of the `Ok`.
	 *
	 * @example
	 * ```typescript
	 * const x = ok(2);
	 * assert.throws(() => x.unwrapErr(), {
	 *   name: 'ResultError',
	 *   message: 'Unwrap failed',
	 *   value: 2
	 * });
	 * ```
	 * @example
	 * ```typescript
	 * const x = err('Emergency failure');
	 * assert.equal(x.unwrapErr(), 'Emergency failure');
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_err}
	 */
	public unwrapErr(): never {
		throw new ResultError('Unwrap failed', this.value);
	}

	/**
	 * Returns the contained `Ok` value or the provided default.
	 *
	 * Arguments passed to `unwrapOr` are eagerly evaluated; if you are passing the result of a function call, it is
	 * recommended to use {@link unwrapOrElse}, which is lazily evaluated.
	 * @param defaultValue The default value.
	 *
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = ok(9);
	 * assert.equal(x.unwrapOr(2), 9);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = err('Error');
	 * assert.equal(x.unwrapOr(2), 2);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_or}
	 */
	public unwrapOr(defaultValue: T): T;
	public unwrapOr(): T {
		return this.value;
	}

	/**
	 * Returns the contained `Ok` value or computes it from a closure.
	 * @param op The predicate.
	 *
	 * @example
	 * ```typescript
	 * const count = (x: string) => x.length;
	 *
	 * assert.equal(ok(2).unwrapOrElse(count), 2);
	 * assert.equal(err('hello').unwrapOrElse(count), 5);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.unwrap_or_else}
	 */
	public unwrapOrElse(op: (error: any) => T): T;
	public unwrapOrElse(): T {
		return this.value;
	}

	/**
	 * Returns `result` if the result is `Ok`, otherwise returns the `Err` value of itself.
	 * @param result The result to check.
	 *
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = ok(2);
	 * const y: Result<string, string> = err('Late error');
	 * assert.equal(x.and(y), err('Late error'));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = err('Early error');
	 * const y: Result<string, string> = err('Late error');
	 * assert.equal(x.and(y), err('Early error'));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = ok(2);
	 * const y: Result<string, string> = ok('Hello');
	 * assert.equal(x.and(y), ok('Hello'));
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.and}
	 */
	public and<R extends Result<any, any>>(result: R): R {
		return result;
	}

	/**
	 * Calls `cb` if the result is `Ok`, otherwise returns the `Err` value of self.
	 *
	 * This function can be used for control flow based on `Result` values.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * function fractionOf4(value: number) {
	 *   return value === 0 ? err('overflowed') : ok(4 / value);
	 * }
	 *
	 * assert.equal(ok(2).andThen(fractionOf4), ok(4));
	 * assert.equal(ok(0).andThen(fractionOf4), err('overflowed'));
	 * assert.equal(err('not a number').andThen(fractionOf4), err('not a number'));
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.and_then}
	 */
	public andThen<R extends Result<any, any>>(cb: (value: T) => R): R {
		return cb(this.value);
	}

	/**
	 * Return `result` if the result is `Err`, otherwise returns the `Ok` value of self.
	 *
	 * Arguments passed to or are eagerly evaluated; if you are passing the result of a function call, it is recommended
	 * to use {@link orElse}, which is lazily evaluated.
	 * @param result The result to check.
	 *
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = ok(2);
	 * const y: Result<number, string> = err('Late error');
	 * assert.equal(x.or(y), ok(2));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = err('Early error');
	 * const y: Result<number, string> = ok(2);
	 * assert.equal(x.or(y), ok(2));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = err('Early error');
	 * const y: Result<number, string> = err('Late error');
	 * assert.equal(x.or(y), err('Late error'));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = ok(2);
	 * const y: Result<number, string> = ok(100);
	 * assert.equal(x.or(y), ok(2));
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.or}
	 */
	public or(result: Result<T, any>): this;
	public or(): this {
		return this;
	}

	/**
	 * Calls `cb` if the result is `Err`, otherwise returns the `Ok` value of self.
	 *
	 * This function can be used for control flow based on result values.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * const square = (x: number): Result<number, string> => ok(x * x);
	 * const wrapErr = (x: number): Result<number, string> => err(x);
	 *
	 * assert.equal(ok(2).orElse(square).orElse(square), ok(2));
	 * assert.equal(ok(2).orElse(wrapErr).orElse(square), ok(2));
	 * assert.equal(err(3).orElse(square).orElse(wrapErr), ok(9));
	 * assert.equal(err(3).orElse(wrapErr).orElse(wrapErr), err(3));
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.or_else}
	 */
	public orElse(cb: (error: never) => Result<T, any>): this;
	public orElse(): this {
		return this;
	}

	/**
	 * Returns `true` if the result is an `Ok` and the given value strict equals it.
	 * @param value The value to compare.
	 *
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = ok(2);
	 * assert.equal(x.contains(2), true);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = ok(3);
	 * assert.equal(x.contains(2), false);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = err('Some error message');
	 * assert.equal(x.contains(2), false);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.contains}
	 */
	public contains(value: T): boolean {
		return this.value === value;
	}

	/**
	 * Returns `true` if the result is an `Err` and the given error strict equals it.
	 * @param error The error to compare.
	 *
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = ok(2);
	 * assert.equal(x.containsErr('Some error message'), false);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = err('Some error message');
	 * assert.equal(x.containsErr('Some error message'), true);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = err('Some other error message');
	 * assert.equal(x.containsErr('Some error message'), false);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.contains_err}
	 */
	public containsErr(error?: unknown): false;
	public containsErr(): false {
		return false;
	}

	/**
	 * Transposes a `Result` of an `Option` into an `Option` of a `Result`.
	 *
	 * `ok(none)` will be mapped to `none`. `ok(some(v))` and `err(e)` will be mapped to `some(ok(v))` and `some(err(e))`.
	 *
	 * @example
	 * ```typescript
	 * const x: Result<Option<number>, Error> = ok(some(5));
	 * const y: Option<Result<number, Error>> = some(ok(5));
	 * assert.equal(x.transpose(), y);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.transpose}
	 */
	public transpose(this: Ok<None>): None;
	public transpose<Inner>(this: Ok<Some<Inner>>): Some<Ok<Inner>>;
	public transpose<Inner>(this: Ok<Option<Inner>>): Option<Ok<Inner>>;
	public transpose<IT>(this: Ok<Option<IT>>): Option<Ok<IT>> {
		return this.value.match({
			some: (value) => some(ok(value)),
			none: () => none
		});
	}

	/**
	 * Converts from `Result<Result<T, E>, E>` to `Result<T, E>`.
	 *
	 * @example
	 * ```typescript
	 * const x: Result<Result<string, number>, number> = ok(ok('Hello'));
	 * assert.equal(x.flatten(), ok('Hello'));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<Result<string, number>, number> = ok(err(6));
	 * assert.equal(x.flatten(), err(6));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<Result<string, number>, number> = err(6);
	 * assert.equal(x.flatten(), err(6));
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.flatten}
	 */
	public flatten<Inner extends Result<any, any>>(this: Ok<Inner>): Inner {
		return this.value;
	}

	/**
	 * Returns the `Ok` value if self is `Ok`, and the `Err` value if self is `Err`.
	 *
	 * @example
	 * ```typescript
	 * let x: Result<number, number> = ok(3);
	 * assert.equal(x.intoOkOrErr(), 3);
	 * ```
	 * @example
	 * ```typescript
	 * let x: Result<number, number> = err(4);
	 * assert.equal(x.intoOkOrErr(), 4);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.into_ok_or_err}
	 */
	public intoOkOrErr() {
		return this.value;
	}

	/**
	 * Checks whether or not `other` equals with self.
	 * @param other The other result to compare.
	 *
	 * @see {@link https://doc.rust-lang.org/std/cmp/trait.PartialEq.html#tymethod.eq}
	 */
	public eq(other: Err<any>): false;
	public eq(other: Result<T, any>): boolean;
	public eq(other: Result<T, any>): boolean {
		return other.isOkAnd((value) => this.value === value);
	}

	/**
	 * Checks whether or not `other` doesn't equal with self.
	 * @param other The other result to compare.
	 *
	 * @see {@link https://doc.rust-lang.org/std/cmp/trait.PartialEq.html#method.ne}
	 */
	public ne(other: Err<any>): true;
	public ne(other: Result<T, any>): boolean;
	public ne(other: Result<T, any>): boolean {
		return !this.eq(other);
	}

	/**
	 * Runs `ok` function if self is `Ok`, otherwise runs `err` function.
	 * @param branches The branches to match.
	 *
	 * @example
	 * ```typescript
	 * const result = ok(4).match({
	 *   ok: (v) => v,
	 *   err: () => 0
	 * });
	 * assert.equal(result, 4);
	 * ```
	 * @example
	 * ```typescript
	 * const result = err('Hello').match({
	 *   ok: (v) => v,
	 *   err: () => 0
	 * });
	 * assert.equal(result, 0);
	 * ```
	 */
	public match<Ok, Err>(branches: { ok(value: T): Ok; err(error: never): Err }): Ok {
		return branches.ok(this.value);
	}

	/**
	 * Returns an iterator over the possibly contained value.
	 *
	 * The iterator yields one value if the result is `Ok`, otherwise none.
	 *
	 * @example
	 * ```typescript
	 * const x = ok(7);
	 * for (const value of x) {
	 *   console.log(value);
	 * }
	 * // Logs 7
	 * ```
	 * @example
	 * ```typescript
	 * const x = err('Nothing!');
	 * for (const value of x) {
	 *   console.log(value);
	 * }
	 * // Doesn't log
	 * ```
	 *
	 * @see {@link IResult.iter}
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.iter}
	 */
	public *[Symbol.iterator](): Generator<T> {
		yield this.value;
	}
}

/**
 * Creates an Ok with no value.
 * @return A successful Result.
 */
export function ok(): Ok<unknown>;

/**
 * Creates an Ok.
 * @typeparam T The result's type.
 * @param x Value to use.
 * @return A successful Result.
 */
export function ok<T>(x: T): Ok<T>;
export function ok<T>(x?: T): Ok<T | undefined> {
	return new Ok(x);
}
