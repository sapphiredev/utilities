import { isFunction, returnThis, type Awaitable, type If } from './common/utils';
import { none, some, type None, type Option, type Some } from './Option';
import { ResultError } from './ResultError';

const ValueProperty = Symbol.for('@sapphire/result:Result.value');
const SuccessProperty = Symbol.for('@sapphire/result:Result.success');

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
export class Result<T, E, const Success extends boolean = boolean> {
	/**
	 * Branded value to ensure `Success` is typed correctly.
	 * @internal
	 */
	declare protected __STATUS__: Success;

	private readonly [ValueProperty]: If<Success, T, E>;
	private readonly [SuccessProperty]: Success;

	private constructor(value: If<Success, T, E>, success: Success) {
		this[ValueProperty] = value;
		this[SuccessProperty] = success;
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
	public isOk(): this is Ok<T, E> {
		return this[SuccessProperty];
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
	public isOkAnd<R extends T>(cb: (value: T) => value is R): this is Ok<R, E>;
	public isOkAnd<R extends boolean>(cb: (value: T) => R): this is Ok<T, E> & R;
	public isOkAnd<R extends boolean>(cb: (value: T) => R): this is Ok<T, E> & R {
		return this.isOk() && cb(this[ValueProperty]);
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
	public isErr(): this is Err<E, T> {
		return !this[SuccessProperty];
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
	public isErrAnd<R extends E>(cb: (error: E) => error is R): this is Err<R, T>;
	public isErrAnd<R extends boolean>(cb: (error: E) => R): this is Err<E, T> & R;
	public isErrAnd<R extends boolean>(cb: (error: E) => R): this is Err<E, T> & R {
		return this.isErr() && cb(this[ValueProperty]);
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
	public ok(): If<Success, Some<T>, None> {
		return this.match({ ok: (value) => some(value), err: () => none });
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
	public err(): If<Success, None, Some<E>> {
		return this.match({ ok: () => none, err: (error) => some(error) });
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
	public map<OutputValue>(cb: (value: If<Success, T, never>) => OutputValue): Result<OutputValue, E, Success> {
		// @ts-expect-error Complex types
		return this.match({ ok: (value) => ok(cb(value)), err: returnThis });
	}

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
	public mapInto<OutputResult extends AnyResult>(cb: (value: If<Success, T, never>) => OutputResult): If<Success, OutputResult, Err<E>> {
		return this.match({ ok: (value) => cb(value), err: returnThis });
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
	public mapOr<MappedOutputValue, DefaultOutputValue>(
		defaultValue: DefaultOutputValue,
		cb: (value: If<Success, T, never>) => MappedOutputValue
	): If<Success, MappedOutputValue, DefaultOutputValue> {
		return this.match({ ok: (value) => cb(value), err: () => defaultValue });
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
	public mapOrElse<OutputValue, OutputError>(
		op: (error: If<Success, never, E>) => OutputError,
		cb: (value: If<Success, T, never>) => OutputValue
	): If<Success, OutputValue, OutputError> {
		return this.match({ ok: (value) => cb(value), err: (error) => op(error) });
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
	public mapErr<OutputError>(cb: (error: If<Success, never, E>) => OutputError): Result<T, OutputError, Success> {
		// @ts-expect-error Complex types
		return this.match({ ok: returnThis, err: (error) => err(cb(error)) });
	}

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
	public mapErrInto<OutputResult extends AnyResult>(cb: (error: If<Success, never, E>) => OutputResult): If<Success, Ok<T>, OutputResult> {
		return this.match({ ok: returnThis, err: (error) => cb(error) });
	}

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
	public inspect(cb: (value: T) => unknown): this {
		if (this.isOk()) cb(this[ValueProperty]);
		return this;
	}

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
	public async inspectAsync(cb: (value: T) => Awaitable<unknown>): Promise<this> {
		if (this.isOk()) await cb(this[ValueProperty]);
		return this;
	}

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
	public inspectErr(cb: (error: E) => unknown): this {
		if (this.isErr()) cb(this[ValueProperty]);
		return this;
	}

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
	public async inspectErrAsync(cb: (error: E) => Awaitable<unknown>): Promise<this> {
		if (this.isErr()) await cb(this[ValueProperty]);
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
		if (this.isOk()) yield this[ValueProperty];
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
	public expect(message: string): If<Success, T, never> {
		if (this.isErr()) throw new ResultError(message, this[ValueProperty]);
		return this[ValueProperty] as If<Success, T, never>;
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
	public expectErr(message: string): If<Success, never, E> {
		if (this.isOk()) throw new ResultError(message, this[ValueProperty]);
		return this[ValueProperty] as If<Success, never, E>;
	}

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
	public unwrap(): If<Success, T, never> {
		if (this.isErr()) throw new ResultError('Unwrap failed', this[ValueProperty]);
		return this[ValueProperty] as If<Success, T, never>;
	}

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
	public unwrapErr(): If<Success, never, E> {
		if (this.isOk()) throw new ResultError('Unwrap failed', this[ValueProperty]);
		return this[ValueProperty] as If<Success, never, E>;
	}

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
	public unwrapOr<OutputValue>(defaultValue: OutputValue): If<Success, T, OutputValue> {
		return this.match({ ok: (value) => value, err: () => defaultValue });
	}

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
	public unwrapOrElse<OutputValue>(op: (error: E) => OutputValue): If<Success, T, OutputValue> {
		return this.match({ ok: (value) => value, err: (error) => op(error) });
	}

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
	public unwrapRaw(): If<Success, T, never> {
		// eslint-disable-next-line @typescript-eslint/no-throw-literal
		if (this.isErr()) throw this[ValueProperty];
		// @ts-expect-error Complex types
		return this[ValueProperty] as T;
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
	public and<OutputResult extends AnyResult>(result: OutputResult): If<Success, OutputResult, Err<E>> {
		return this.match({ ok: () => result, err: returnThis });
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
	public andThen<OutputResult extends AnyResult>(cb: (value: T) => OutputResult): If<Success, OutputResult, Err<E>> {
		return this.match({ ok: (value) => cb(value), err: returnThis });
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
	public or<OutputResult extends AnyResult>(result: OutputResult): If<Success, Ok<T>, OutputResult> {
		return this.match({ ok: returnThis, err: () => result });
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
	public orElse<OutputResult extends AnyResult>(cb: (error: E) => OutputResult): If<Success, Ok<T>, OutputResult> {
		return this.match({ ok: returnThis, err: (error) => cb(error) });
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
	public contains<const Value extends T>(this: Ok<T>, value: Value): this is Ok<Value>;
	public contains(this: Err<E>, value: T): false;
	public contains(value: T): boolean {
		return this.isOkAnd((inner) => inner === value);
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
	public containsErr(this: Ok<T>, error: E): false;
	public containsErr<const Value extends E>(this: Err<E>, error: Value): this is Err<Value>;
	public containsErr(error: E): boolean {
		return this.isErrAnd((inner) => inner === error);
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
	public transpose<InnerValue>(this: Result<Option<InnerValue>, E, Success>): If<Success, Option<Ok<InnerValue>>, Some<Err<E>>> {
		return this.match({
			ok: (value) => value.map((value) => ok(value)),
			err() {
				return some(this);
			}
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
	public flatten<InnerResult extends AnyResult>(this: Result<InnerResult, E, Success>): If<Success, InnerResult, Err<E>> {
		return this.match({ ok: (value) => value, err: returnThis });
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
	public intoOkOrErr(): If<Success, T, E> {
		return this[ValueProperty];
	}

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
	public intoPromise(): Promise<If<Success, Ok<Awaited<T>>, Err<Awaited<E>>>> {
		// @ts-expect-error Complex types
		return this.match<Ok<Awaited<T>>, Err<Awaited<E>>>({
			// @ts-expect-error Complex types
			ok: async (value) => ok(await value), // NOSONAR
			// @ts-expect-error Complex types
			err: async (error) => err(await error) // NOSONAR
		});
	}

	/**
	 * Checks whether or not `other` equals with self.
	 * @param other The other result to compare.
	 *
	 * @see {@link https://doc.rust-lang.org/std/cmp/trait.PartialEq.html#tymethod.eq}
	 */
	public eq<OtherValue extends T, OtherError extends E, OtherSuccess extends boolean>(
		other: Result<OtherValue, OtherError, OtherSuccess>
	): this is Result<OtherValue, OtherError, OtherSuccess> {
		// @ts-expect-error Complex types
		return this.isOk() === other.isOk() && this[ValueProperty] === other[ValueProperty];
	}

	/**
	 * Checks whether or not `other` doesn't equal with self.
	 * @param other The other result to compare.
	 *
	 * @see {@link https://doc.rust-lang.org/std/cmp/trait.PartialEq.html#method.ne}
	 */
	public ne(other: Result<T, E>): boolean {
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
	public match<OkValue, ErrValue>(branches: {
		ok(this: Ok<T>, value: If<Success, T, never>): OkValue;
		err(this: Err<E>, error: If<Success, never, E>): ErrValue;
	}): If<Success, OkValue, ErrValue> {
		// @ts-expect-error Complex types
		return this.isOk() ? branches.ok.call(this, this[ValueProperty]) : branches.err.call(this, this[ValueProperty] as E);
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
	public [Symbol.iterator](): Generator<T> {
		return this.iter();
	}

	public get [Symbol.toStringTag](): If<Success, 'Ok', 'Err'> {
		return this.match({ ok: () => 'Ok', err: () => 'Err' });
	}

	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	public static ok<T = undefined, E = any>(this: void, value?: T): Ok<T, E>;
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	public static ok<T, E = any>(this: void, value: T): Ok<T, E> {
		return new Result<T, E, true>(value, true);
	}

	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	public static err<E = undefined, T = any>(this: void, value?: E): Err<E, T>;
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	public static err<E, T = any>(this: void, value: E): Err<E, T> {
		return new Result<T, E, false>(value, false);
	}

	/**
	 * Checks if the `instance` object is an instance of `Result`, or if it is a `Result`-like object. This override
	 * exists to interoperate with other versions of this class, such as the one coming from another version of this
	 * library or from a different build.
	 *
	 * @param instance The instance to check.
	 * @returns Whether or not the instance is a `Result`.
	 *
	 * @example
	 * ```typescript
	 * import { Result } from '@sapphire/result';
	 * const { ok } = require('@sapphire/result');
	 *
	 * ok(2) instanceof Result; // true
	 * ```
	 */
	public static [Symbol.hasInstance](instance: unknown): boolean {
		return typeof instance === 'object' && instance !== null && ValueProperty in instance && SuccessProperty in instance;
	}

	/**
	 * @deprecated Use {@link Result.isResult} instead.
	 *
	 * Checks if the `instance` object is an instance of `Result`, or if it is a `Result`-like object.
	 *
	 * @param instance The instance to check.
	 * @returns true if the instance is a `Result` or a `Result`-like object, false otherwise.
	 *
	 * @example
	 * ```typescript
	 * import { Result } from '@sapphire/result';
	 * const { ok } = require('@sapphire/result');
	 *
	 * Result.isResult(ok(2)); // true
	 * ```
	 */
	public static is(instance: unknown): instance is AnyResult {
		return Result[Symbol.hasInstance](instance);
	}

	/**
	 * Checks if the `instance` object is an instance of `Result`, or if it is a `Result`-like object.
	 *
	 * @param instance The instance to check.
	 * @returns true if the instance is a `Result` or a `Result`-like object, false otherwise.
	 *
	 * @example
	 * ```typescript
	 * import { Result } from '@sapphire/result';
	 * const { ok } = require('@sapphire/result');
	 *
	 * Result.isResult(ok(2)); // true
	 * ```
	 */
	public static isResult(instance: unknown): instance is AnyResult {
		return Result[Symbol.hasInstance](instance);
	}

	/**
	 * Creates a {@link Result} out of a callback.
	 *
	 * @typeparam T The result's type.
	 * @typeparam E The error's type.
	 */
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	public static from<T, E = unknown>(this: void, op: ResultResolvable<T, E> | (() => ResultResolvable<T, E>)): Result<T, E> {
		try {
			return resolve(isFunction(op) ? op() : op);
		} catch (error) {
			return err(error as E);
		}
	}

	/**
	 * Creates a {@link Result} out of a promise or async callback.
	 *
	 * @typeparam T The result's type.
	 * @typeparam E The error's type.
	 */
	public static async fromAsync<T, E = unknown>(
		// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
		this: void,
		op: Awaitable<ResultResolvable<T, E>> | (() => Awaitable<ResultResolvable<T, E>>)
	): Promise<Result<T, E>> {
		try {
			return resolve(await (isFunction(op) ? op() : op));
		} catch (error) {
			return err(error as E);
		}
	}

	/**
	 * Creates an {@link Ok} that is the combination of all collected {@link Ok} values as an array, or the first
	 * {@link Err} encountered.
	 *
	 * @param results An array of {@link Result}s.
	 * @returns A new {@link Result}.
	 */
	public static all<const Entries extends readonly AnyResult[]>(
		// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
		this: void,
		results: Entries
	): Result<UnwrapOkArray<Entries>, UnwrapErrArray<Entries>[number]> {
		const values: unknown[] = [];
		for (const result of results) {
			if (result.isErr()) return result;

			values.push(result[ValueProperty]);
		}

		return ok(values as UnwrapOkArray<Entries>);
	}

	/**
	 * Returns the first encountered {@link Ok}, or an {@link Err} that is the combination of all collected error values.
	 *
	 * @param results An array of {@link Result}s.
	 * @returns A new {@link Result}.
	 */
	public static any<const Entries extends readonly AnyResult[]>(
		// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
		this: void,
		results: Entries
	): Result<UnwrapOk<Entries[number]>, UnwrapErrArray<Entries>> {
		const errors: unknown[] = [];
		for (const result of results) {
			if (result.isOk()) return result;

			errors.push(result[ValueProperty]);
		}

		return err(errors as UnwrapErrArray<Entries>);
	}
}

export namespace Result {
	export type Ok<T, E = any> = Result<T, E, true>;
	export type Err<E, T = any> = Result<T, E, false>;
	export type Any = Result<any, any>;
	export type Resolvable<T, E = any, Success extends boolean = boolean> = T | Result<T, E, Success>;
	export type UnwrapOk<T extends AnyResult> = T extends Ok<infer S> ? S : never;
	export type UnwrapErr<T extends AnyResult> = T extends Err<infer S> ? S : never;

	export type UnwrapOkArray<T extends readonly AnyResult[] | []> = {
		-readonly [P in keyof T]: UnwrapOk<T[P]>;
	};
	export type UnwrapErrArray<T extends readonly AnyResult[] | []> = {
		-readonly [P in keyof T]: UnwrapErr<T[P]>;
	};
}

export const { ok, err } = Result;

function resolve<T, E>(value: Result.Resolvable<T, E>): Result<T, E> {
	return Result.isResult(value) ? value : ok(value);
}

export type ResultResolvable<T, E = any, Success extends boolean = boolean> = Result.Resolvable<T, E, Success>;

export type Ok<T, E = any> = Result.Ok<T, E>;
export type Err<E, T = any> = Result.Err<E, T>;
export type AnyResult = Result.Any;

export type UnwrapOk<T extends AnyResult> = Result.UnwrapOk<T>;
export type UnwrapErr<T extends AnyResult> = Result.UnwrapErr<T>;

export type UnwrapOkArray<T extends readonly AnyResult[] | []> = Result.UnwrapOkArray<T>;
export type UnwrapErrArray<T extends readonly AnyResult[] | []> = Result.UnwrapErrArray<T>;
