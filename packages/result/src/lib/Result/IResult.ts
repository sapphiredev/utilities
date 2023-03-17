import type { Awaitable } from '../common/utils.js';
import type { Option } from '../Option.js';
import type { Result } from '../Result.js';
import type { ResultErr } from './Err.js';
import type { ResultOk } from './Ok.js';

/**
 * A type used to express computations that can fail, it can be used for returning and propagating errors. This is a
 * type union with the variants `Ok(T)`, representing success and containing a value, and `Err(E)`, representing error
 * and containing an error value.
 *
 * @typeparam T The result's type.
 * @typeparam E The error's type.
 *
 * @see {@link https://doc.rust-lang.org/std/result/index.html}
 */
export interface IResult<T, E> {
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
	isOk(): this is ResultOk<T>;

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
	isOkAnd<R extends boolean>(cb: (value: T) => R): this is ResultOk<T> & R;

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
	isErr(): this is ResultErr<E>;

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
	isErrAnd<R extends boolean>(cb: (error: E) => R): this is ResultErr<E> & R;

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
	ok(): Option<T>;

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
	err(): Option<E>;

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
	map<U>(cb: (value: T) => U): Result<U, E>;

	/**
	 * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Ok` value, leaving an `Err` value
	 * untouched.
	 *
	 * Unlike {@link map}, this method does not wrap the returned value inside `Ok`, but instead, it returns the
	 * returned value.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = ok(2);
	 * assert.equal(x.mapInto((value) => ok(value * value)), ok(4));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = ok(0);
	 * assert.equal(
	 *   x.mapInto((value) => (value === 0 ? err('zero is not divisible') : ok(1 / value))),
	 *   err('zero is not divisible')
	 * );
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, string> = err('Some error message');
	 * assert.equal(x.mapInto((value) => ok(4)), err('Some error message'));
	 * ```
	 *
	 * @note This is an extension not supported in Rust
	 */
	mapInto<IT, IE>(cb: (value: T) => Result<IT, IE>): Result<IT, E | IE>;

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
	mapOr<U>(defaultValue: U, cb: (value: T) => U): U;

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
	mapOrElse<U>(op: (error: E) => U, cb: (value: T) => U): U;

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
	mapErr<F>(cb: (error: E) => F): Result<T, F>;

	/**
	 * Maps a `Result<T, E>` to `Result<T, F>` by applying a function to a contained `Err` value, leaving an `Ok` value
	 * untouched.
	 *
	 * This function can be used to pass through a successful result while handling an error.
	 *
	 * Unlike {@link mapErr}, this method does not wrap the returned value inside `Err`, but instead, it returns the
	 * returned value.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * const x: Result<number, Error> = ok(2);
	 * assert.equal(x.mapErrInto((error) => err(error.message)), ok(2));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, Error> = err(new Error('Some error message'));
	 * assert.equal(x.mapErrInto((error) => err(error.message)), err('Some error message'));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Result<number, Error> = err(new Error('Some error message'));
	 * assert.equal(x.mapErrInto((error) => ok(4)), ok(4));
	 * ```
	 *
	 * @note This is an extension not supported in Rust
	 */
	mapErrInto<IT, IE>(cb: (error: E) => Result<IT, IE>): Result<T | IT, IE>;

	/**
	 * Calls the provided closure with a reference to the contained value (if `Ok`).
	 * @param cb The predicate.
	 * @seealso {@link inspectAsync} for the awaitable version.
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
	inspect(cb: (value: T) => void): this;

	/**
	 * Calls the provided closure with a reference to the contained value (if `Ok`) and awaits it.
	 * @param cb The predicate.
	 * @seealso {@link inspect} for the sync version.
	 *
	 * @example
	 * ```typescript
	 * await ok(2).inspectAsync(console.log);
	 * // Logs: 2
	 * ```
	 * @example
	 * ```typescript
	 * await err('Some error message').inspectAsync(console.log);
	 * // Doesn't log
	 * ```
	 *
	 * @note This is an extension not supported in Rust
	 */
	inspectAsync(cb: (value: T) => Awaitable<void>): Promise<this>;

	/**
	 * Calls the provided closure with a reference to the contained error (if `Err`).
	 * @param cb The predicate.
	 * @seealso {@link inspectErrAsync} for the awaitable version.
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
	inspectErr(cb: (error: E) => void): this;

	/**
	 * Calls the provided closure with a reference to the contained error (if `Err`) and awaits it.
	 * @param cb The predicate.
	 * @seealso {@link inspectErr} for the sync version.
	 *
	 * @example
	 * ```typescript
	 * await ok(2).inspectErrAsync(console.log);
	 * // Doesn't log
	 * ```
	 * @example
	 * ```typescript
	 * await err('Some error message').inspectErrAsync(console.log);
	 * // Logs: Some error message
	 * ```
	 *
	 * @note This is an extension not supported in Rust
	 */
	inspectErrAsync(cb: (error: E) => Awaitable<void>): Promise<this>;

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
	iter(): Generator<T>;

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
	expect(message: string): T;

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
	expectErr(message: string): E;

	/**
	 * Returns the contained `Ok` value.
	 *
	 * If the value is an `Err`, it throws a {@link ResultError} with the message, and the content of the `Err`.
	 * @seealso {@link unwrapOr}
	 * @seealso {@link unwrapOrElse}
	 * @seealso {@link unwrapErr}
	 * @seealso {@link unwrapRaw}
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
	unwrap(): T;

	/**
	 * Returns the contained `Err` value.
	 *
	 * If the value is an `Ok`, it throws a {@link ResultError} with the message, and the content of the `Ok`.
	 * @seealso {@link unwrap}
	 * @seealso {@link unwrapOr}
	 * @seealso {@link unwrapOrElse}
	 * @seealso {@link unwrapRaw}
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
	unwrapErr(): E;

	/**
	 * Returns the contained `Ok` value or the provided default.
	 *
	 * Arguments passed to `unwrapOr` are eagerly evaluated; if you are passing the result of a function call, it is
	 * recommended to use {@link unwrapOrElse}, which is lazily evaluated.
	 * @seealso {@link unwrap}
	 * @seealso {@link unwrapOrElse}
	 * @seealso {@link unwrapErr}
	 * @seealso {@link unwrapRaw}
	 *
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
	unwrapOr<V>(defaultValue: V): T | V;

	/**
	 * Returns the contained `Ok` value or computes it from a closure.
	 * @seealso {@link unwrap}
	 * @seealso {@link unwrapOr}
	 * @seealso {@link unwrapErr}
	 * @seealso {@link unwrapRaw}
	 *
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
	unwrapOrElse<V>(op: (error: E) => V): T | V;

	/**
	 * Returns the contained `Ok` value.
	 *
	 * If the value is an `Err`, it throws the contained error.
	 * @seealso {@link unwrap}
	 * @seealso {@link unwrapOr}
	 * @seealso {@link unwrapOrElse}
	 * @seealso {@link unwrapErr}
	 *
	 * @example
	 * ```typescript
	 * const x = ok(2);
	 * assert.equal(x.unwrapRaw(), 2);
	 * ```
	 * @example
	 * ```typescript
	 * const x = err('Emergency failure');
	 * assert.throws(() => x.unwrapRaw(), {
	 *   name: 'Error',
	 *   message: 'Unwrap failed',
	 *   value: 'Emergency failure'
	 * });
	 * ```
	 */
	unwrapRaw(): T | never;

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
	and<U>(result: Result<U, E>): Result<U, E>;

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
	andThen<U>(cb: (value: T) => Result<U, E>): Result<U, E>;

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
	or<F>(result: Result<T, F>): Result<T, F>;

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
	orElse<F>(cb: (error: E) => Result<T, F>): Result<T, F>;

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
	contains(value: T): boolean;

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
	containsErr(error: E): boolean;

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
	transpose<IT>(this: Result<Option<IT>, E>): Option<Result<IT, E>>;

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
	flatten<IT>(this: Result<Result<IT, E>, E>): Result<IT, E>;

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
	intoOkOrErr(): T | E;

	/**
	 * Returns a `Promise` object with the awaited value (if `Ok`) or the awaited error (if `Err`).
	 *
	 * @example
	 * ```typescript
	 * let x = ok(Promise.resolve(3));
	 * assert.equal(await x.intoPromise(), ok(3));
	 * ```
	 *
	 * @note This is an extension not supported in Rust
	 */
	intoPromise(): Promise<Result<Awaited<T>, Awaited<E>>>;

	/**
	 * Checks whether or not `other` equals with self.
	 * @param other The other result to compare.
	 *
	 * @see {@link https://doc.rust-lang.org/std/cmp/trait.PartialEq.html#tymethod.eq}
	 */
	eq(other: Result<T, E>): boolean;

	/**
	 * Checks whether or not `other` doesn't equal with self.
	 * @param other The other result to compare.
	 *
	 * @see {@link https://doc.rust-lang.org/std/cmp/trait.PartialEq.html#method.ne}
	 */
	ne(other: Result<T, E>): boolean;

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
	match<OkValue, ErrValue>(branches: { ok(value: T): OkValue; err(error: E): ErrValue }): OkValue | ErrValue;

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
	[Symbol.iterator](): Generator<T>;
}
