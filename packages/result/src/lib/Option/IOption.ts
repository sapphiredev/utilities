import type { Awaitable } from '../common/utils.js';
import type { Option } from '../Option.js';
import type { Result } from '../Result.js';
import type { OptionNone } from './None.js';
import type { OptionSome } from './Some.js';

export interface IOption<T> {
	/**
	 * Returns `true` if the option is a `Some` value.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<number> = some(2);
	 * assert.equal(x.isSome(), true);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = none;
	 * assert.equal(x.isSome(), false);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.is_some}
	 */
	isSome(): this is OptionSome<T>;

	/**
	 * Returns `true` if the option is a `Some` and the value inside of it matches a predicate.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<number> = some(2);
	 * assert.equal(x.isSomeAnd((x) => x > 1), true);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = some(0);
	 * assert.equal(x.isSomeAnd((x) => x > 1), false);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = none;
	 * assert.equal(x.isSomeAnd((x) => x > 1), false);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.is_some_and}
	 */
	isSomeAnd(cb: (value: T) => boolean): boolean;

	/**
	 * Returns `true` if the option is a `None` value.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<number> = some(2);
	 * assert.equal(x.isNone(), false);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = none;
	 * assert.equal(x.isNone(), true);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.is_none}
	 */
	isNone(): this is OptionNone;

	/**
	 * Returns the contained `Some` value.
	 * @param message The message for the error.
	 * If the value is an `Err`, it throws an {@link OptionError} with the given message.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<string> = some(2);
	 * assert.equal(x.expect('Whoops!'), 2);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<string> = none;
	 * assert.throws(() => x.expect('Whoops!'), {
	 *   name: 'OptionError',
	 *   message: 'Whoops'
	 * });
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.expect}
	 */
	expect(message: string): T;

	/**
	 * Returns the contained `Some` value.
	 *
	 * If the value is an `Err`, it throws an {@link OptionError} with the message.
	 * @seealso {@link unwrapOr}
	 * @seealso {@link unwrapOrElse}
	 *
	 * @example
	 * ```typescript
	 * const x: Option<string> = some(2);
	 * assert.equal(x.unwrap(), 2);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<string> = none;
	 * assert.throws(() => x.unwrap(), {
	 *   name: 'OptionError',
	 *   message: 'Unwrap failed'
	 * });
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.unwrap}
	 */
	unwrap(): T;

	/**
	 * Returns the contained `Some` value or a provided default.
	 *
	 * Arguments passed to `unwrapOr` are eagerly evaluated; if you are passing the result of a function call, it is
	 * recommended to use {@link unwrapOrElse}, which is lazily evaluated.
	 *
	 * @example
	 * ```typescript
	 * assert.equal(some(2).unwrapOr(0), 2);
	 * ```
	 * @example
	 * ```typescript
	 * assert.equal(none.unwrapOr(0), 0);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.unwrap_or}
	 */
	unwrapOr<V>(defaultValue: V): T | V;

	/**
	 * Returns the contained Some value or computes it from a closure.
	 *
	 * @example
	 * ```typescript
	 * assert.equal(some(2).unwrapOrElse(() => 0), 2);
	 * ```
	 * @example
	 * ```typescript
	 * assert.equal(none.unwrapOrElse(() => 0), 0);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.unwrap_or_else}
	 */
	unwrapOrElse<V>(cb: () => V): T | V;

	/**
	 * Maps an `Option<T>` to `Option<U>` by applying a function to a contained value.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * const maybeSomeString = some('Hello, world!');
	 * const maybeSomeLength = maybeSomeString.map((value) => value.length);
	 *
	 * assert.equal(maybeSomeLength, some(13));
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.map}
	 */
	map<U>(cb: (value: T) => U): Option<U>;

	/**
	 * Maps a `Some<T>` to the returned `Option<U>` by applying a function to a contained value, leaving `None`
	 * untouched.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * const input: Option<string> = some('Hello, world!');
	 * const result = input.mapInto((value) => some(value.length));
	 *
	 * assert.equal(result, some(13));
	 * ```
	 * @example
	 * ```typescript
	 * const input: Option<string> = none;
	 * const result = input.mapInto((value) => some(value.length));
	 *
	 * assert.equal(result, none);
	 * ```
	 *
	 * @note This is an extension not supported in Rust
	 */
	mapInto<Inner>(cb: (value: T) => Option<Inner>): Option<Inner>;

	/**
	 * Returns the provided default result (if none), or applies a function to the contained value (if any).
	 *
	 * Arguments passed to `mapOr` are eagerly evaluated; if you are passing the result of a function call, it is
	 * recommended to use {@link mapOrElse}, which is lazily evaluated.
	 * @param defaultValue The default value.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<string> = some('hello');
	 * assert.equal(x.mapOr(42, (value) => value.length), 5);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<string> = none;
	 * assert.equal(x.mapOr(42, (value) => value.length), 42);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.map_or}
	 */
	mapOr<U>(defaultValue: U, cb: (value: T) => U): U;

	/**
	 * Computes a default function result (if none), or applies a different function to the contained value (if any).
	 * @param defaultValue The default value.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<string> = some('hello');
	 * assert.equal(x.mapOrElse(() => 42, (value) => value.length), 5);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<string> = none;
	 * assert.equal(x.mapOrElse(() => 42, (value) => value.length), 42);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.map_or_else}
	 */
	mapOrElse<U>(defaultValue: () => U, cb: (value: T) => U): U;

	/**
	 * Maps a `None` to the returned `Option<U>` by applying a function to a contained value, leaving `Some<T>`
	 * untouched.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * const input: Option<string> = some('Hello, world!');
	 * const result = input.mapNoneInto(() => some(13));
	 *
	 * assert.equal(result, some('Hello, world!'));
	 * ```
	 * @example
	 * ```typescript
	 * const input: Option<string> = none;
	 * const result = input.mapNoneInto(() => some(13));
	 *
	 * assert.equal(result, some(13));
	 * ```
	 *
	 * @note This is an extension not supported in Rust
	 */
	mapNoneInto<Inner>(cb: () => Option<Inner>): Option<T | Inner>;

	/**
	 * Calls the provided closure with a reference to the contained value (if `Some`).
	 * @param cb The predicate.
	 * @seealso {@link inspectAsync} for the awaitable version.
	 *
	 * @example
	 * ```typescript
	 * some(2).inspect(console.log);
	 * // Logs: 2
	 * ```
	 * @example
	 * ```typescript
	 * none.inspect(console.log);
	 * // Doesn't log
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.inspect}
	 */
	inspect(cb: (value: T) => void): this;

	/**
	 * Calls the provided closure with a reference to the contained value (if `Some`).
	 * @param cb The predicate.
	 * @seealso {@link inspect} for the sync version.
	 *
	 * @example
	 * ```typescript
	 * await some(2).inspectAsync(console.log);
	 * // Logs: 2
	 * ```
	 * @example
	 * ```typescript
	 * await none.inspectAsync(console.log);
	 * // Doesn't log
	 * ```
	 *
	 * @note This is an extension not supported in Rust
	 */
	inspectAsync(cb: (value: T) => Awaitable<void>): Promise<this>;

	/**
	 * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(err)`.
	 *
	 * Arguments passed to `okOr` are eagerly evaluated; if you are passing the result of a function call, it is
	 * recommended to use {@link okOrElse}, which is lazily evaluated.
	 * @param err The error to be used.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<string> = some('hello');
	 * assert.equal(x.okOr(0), ok('hello'));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<string> = none;
	 * assert.equal(x.okOr(0), err(0));
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.ok_or}
	 */
	okOr<E>(err: E): Result<T, E>;

	/**
	 * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(err())`.
	 * @param cb The error to be used.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<string> = some('hello');
	 * assert.equal(x.okOrElse(() => 0), ok('hello'));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<string> = none;
	 * assert.equal(x.okOrElse(() => 0), err(0));
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.ok_or_else}
	 */
	okOrElse<E>(cb: () => E): Result<T, E>;

	/**
	 * Returns an iterator over the possibly contained value.
	 *
	 * The iterator yields one value if the result is `Some`, otherwise none.
	 *
	 * @example
	 * ```typescript
	 * const x = some(7);
	 * for (const value of x) {
	 *   console.log(value);
	 * }
	 * // Logs 7
	 * ```
	 * @example
	 * ```typescript
	 * const x = none;
	 * for (const value of x) {
	 *   console.log(value);
	 * }
	 * // Doesn't log
	 * ```
	 *
	 * @see {@link Option.iter}
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.iter}
	 */
	iter(): Generator<T>;

	/**
	 * Returns `None` if the option is `None`, otherwise returns `option`.
	 * @param option The option.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<number> = some(2);
	 * const y: Option<string> = none;
	 * assert.equal(x.and(y), none);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = none;
	 * const y: Option<string> = some('foo');
	 * assert.equal(x.and(y), none);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = some(2);
	 * const y: Option<string> = some('foo');
	 * assert.equal(x.and(y), some('foo'));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = none;
	 * const y: Option<string> = none;
	 * assert.equal(x.and(y), none);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.and}
	 */
	and<U>(option: Option<U>): Option<U>;

	/**
	 * Calls `cb` if the result is `Ok`, otherwise returns the `Err` value of self.
	 *
	 * This function can be used for control flow based on `Result` values.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * function fractionOf4(value: number) {
	 *   return value === 0 ? none : some(4 / value);
	 * }
	 *
	 * assert.equal(some(2).andThen(fractionOf4), some(4));
	 * assert.equal(some(0).andThen(fractionOf4), none);
	 * assert.equal(none.andThen(fractionOf4), none);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.and_then}
	 */
	andThen<U>(cb: (value: T) => Option<U>): Option<U>;

	/**
	 * Returns the option if it contains a value, otherwise returns `option`.
	 * @param option The option.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<number> = some(2);
	 * const y: Option<number> = none;
	 * assert.equal(x.or(y), some(2));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = none;
	 * const y: Option<number> = some(100);
	 * assert.equal(x.or(y), some(100));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = some(2);
	 * const y: Option<number> = some(100);
	 * assert.equal(x.or(y), some(2));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = none;
	 * const y: Option<number> = none;
	 * assert.equal(x.or(y), none);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.or}
	 */
	or(option: Option<T>): Option<T>;

	/**
	 * Calls `cb` if the result is `Ok`, otherwise returns the `Err` value of self.
	 *
	 * This function can be used for control flow based on `Result` values.
	 * @param cb The predicate.
	 *
	 * @example
	 * ```typescript
	 * const nobody = (): Option<string> => none;
	 * const vikings = (): Option<string> => some('vikings');
	 *
	 * assert.equal(some('barbarians').orElse(vikings), some('barbarians'));
	 * assert.equal(none.orElse(vikings), some('vikings'));
	 * assert.equal(none.orElse(nobody), none);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.or_else}
	 */
	orElse(cb: () => Option<T>): Option<T>;

	/**
	 * Returns `Some` if exactly one of self or `option` is `Some`, otherwise returns `None`.
	 * @param option The option to compare.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<number> = some(2);
	 * const y: Option<number> = none;
	 * assert.equal(x.xor(y), some(2));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = none;
	 * const y: Option<number> = some(2);
	 * assert.equal(x.xor(y), some(2));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = some(2);
	 * const y: Option<number> = some(2);
	 * assert.equal(x.xor(y), none);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = none;
	 * const y: Option<number> = none;
	 * assert.equal(x.xor(y), none);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.xor}
	 */
	xor(option: Option<T>): Option<T>;

	/**
	 * Returns None if the option is None, otherwise calls `predicate` with the wrapped value and returns:
	 *
	 * - `Some(t)` if `predicate` returns `true` (where t is the wrapped value), and
	 * - `None` if `predicate` returns `false`.
	 * @param predicate The predicate.
	 *
	 * @example
	 * ```typescript
	 * function isEven(value: number) {
	 *   return n % 2 === 0;
	 * }
	 *
	 * assert.equal(none.filter(isEven), none);
	 * assert.equal(some(3).filter(isEven), none);
	 * assert.equal(some(4).filter(isEven), some(4));
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.filter}
	 */
	filter(predicate: (value: T) => boolean): Option<T>;

	/**
	 * Returns `true` if the option is a `Some` value containing the given value.
	 * @param value The value to compare.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<number> = some(2);
	 * assert.equal(x.contains(2), true);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = some(3);
	 * assert.equal(x.contains(2), false);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = none;
	 * assert.equal(x.contains(2), false);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.contains}
	 */
	contains(value: T): boolean;

	/**
	 * Zips self with another `Option`.
	 *
	 * If self is `Some(s)` and `other` is `Some(o)`, this method returns `Some([s, o])`. Otherwise, `None` is returned.
	 * @param other The option to zip self with.
	 *
	 * @example
	 * ```typescript
	 * const x = some(1);
	 * const y = some('hi');
	 * const z = none;
	 *
	 * assert.equal(x.zip(y), some([1, 'hi']));
	 * assert.equal(x.zip(z), none);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.zip}
	 */
	zip<U>(other: Option<U>): Option<[T, U]>;

	/**
	 * Zips self and another `Option` with function `f`.
	 *
	 * If self is `Some(s)` and other is `Some(o)`, this method returns `Some(f(s, o))`. Otherwise, `None` is returned.
	 * @param other The option to zip self with.
	 * @param f The function that computes the returned value.
	 *
	 * @example
	 * ```typescript
	 * class Point {
	 *   public readonly x: number;
	 *   public readonly y: number;
	 *
	 *   public constructor(x: number, y: number) {
	 *     this.x = x;
	 *     this.y = y;
	 *   }
	 * }
	 *
	 * const x = some(17.5);
	 * const y = some(42.7);
	 *
	 * assert.equal(x.zipWith(y, (s, o) => new Point(s, o)), some(new Point(17.5, 42.7)));
	 * assert.equal(x.zipWith(none, (s, o) => new Point(s, o)), none);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.zip_with}
	 */
	zipWith<U, R>(other: Option<U>, f: (s: T, o: U) => R): Option<R>;

	/**
	 * Unzips an option containing a tuple of two options.
	 *
	 * If self is `Some((a, b))` this method returns `[Some(a), Some(b)]`. Otherwise, `[None, None]` is returned.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<[number, string]> = some([1, 'hi']);
	 * assert.equal(x.unzip(), [some(1), some('hi')]);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<[number, string]> = none;
	 * assert.equal(x.unzip(), [none, none]);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.unzip}
	 */
	unzip<Inner, U>(this: Option<readonly [Inner, U]>): [Option<Inner>, Option<U>];

	/**
	 * Transposes an `Option` of a `Result` into a `Result` of an `Option`.
	 *
	 * `none` will be mapped to `ok(none)`. `some(ok(v))` and `some(err(e))` will be mapped to `ok(some(v))` and `err(e)`.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<Result<number, Error>> = some(ok(5));
	 * const y: Result<Option<number>, Error> = ok(some(5));
	 * assert.equal(x.transpose(), y);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.transpose}
	 */
	transpose<IT, E>(this: Option<Result<IT, E>>): Result<Option<IT>, E>;

	/**
	 * Converts from `Result<Result<T, E>, E>` to `Result<T, E>`.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<Option<number>> = some(some(6));
	 * assert.equal(x.flatten(), some(6));
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<Option<number>> = some(none);
	 * assert.equal(x.flatten(), none);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<Option<number>> = none;
	 * assert.equal(x.flatten(), none);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/result/enum.Result.html#method.flatten}
	 */
	flatten<IT>(this: Option<Option<IT>>): Option<IT>;

	/**
	 * Returns a `Promise` object with the awaited value (if `Some`).
	 *
	 * @example
	 * ```typescript
	 * let x = some(Promise.resolve(3));
	 * assert.equal(await x.intoPromise(), some(3));
	 * ```
	 *
	 * @note This is an extension not supported in Rust
	 */
	intoPromise(): Promise<Option<Awaited<T>>>;

	/**
	 * Checks whether or not `other` equals with self.
	 * @param other The other option to compare.
	 *
	 * @see {@link https://doc.rust-lang.org/std/cmp/trait.PartialEq.html#tymethod.eq}
	 */
	eq(other: Option<T>): boolean;

	/**
	 * Checks whether or not `other` doesn't equal with self.
	 * @param other The other option to compare.
	 *
	 * @see {@link https://doc.rust-lang.org/std/cmp/trait.PartialEq.html#method.ne}
	 */
	ne(other: Option<T>): boolean;

	/**
	 * Runs `ok` function if self is `Ok`, otherwise runs `err` function.
	 * @param branches The branches to match.
	 *
	 * @example
	 * ```typescript
	 * const option = some(4).match({
	 *   some: (v) => v,
	 *   none: () => 0
	 * });
	 * assert.equal(option, 4);
	 * ```
	 * @example
	 * ```typescript
	 * const option = none.match({
	 *   some: (v) => v,
	 *   none: () => 0
	 * });
	 * assert.equal(option, 0);
	 * ```
	 */
	match<SomeValue, NoneValue>(branches: { some(value: T): SomeValue; none(): NoneValue }): SomeValue | NoneValue;

	/**
	 * Returns an iterator over the possibly contained value.
	 *
	 * The iterator yields one value if the result is `Some`, otherwise none.
	 *
	 * @example
	 * ```typescript
	 * const x = some(7);
	 * for (const value of x) {
	 *   console.log(value);
	 * }
	 * // Logs 7
	 * ```
	 * @example
	 * ```typescript
	 * const x = none;
	 * for (const value of x) {
	 *   console.log(value);
	 * }
	 * // Doesn't log
	 * ```
	 *
	 * @see {@link IOption.iter}
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.iter}
	 */
	[Symbol.iterator](): Generator<T>;
}
