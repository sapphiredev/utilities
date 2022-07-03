import type { Option } from '../Option';
import type { Result } from '../Result';
import { err, type Err } from '../Result/Err';
import { ok, type Ok } from '../Result/Ok';
import { none, type None } from './None';

export class Some<T> {
	private readonly value: T;

	public constructor(value: T) {
		this.value = value;
	}

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
	public isSome(): true {
		return true;
	}

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
	public isSomeAnd<R extends boolean>(cb: (value: T) => R): R {
		return cb(this.value);
	}

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
	public isNone(): false {
		return false;
	}

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
	public expect(message: string): T;
	public expect(): T {
		return this.value;
	}

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
	public unwrap(): T {
		return this.value;
	}

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
	public unwrapOr(defaultValue: T): T;
	public unwrapOr(): T {
		return this.value;
	}

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
	public unwrapOrElse(cb: () => T): T;
	public unwrapOrElse(): T {
		return this.value;
	}

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
	public map<U>(cb: (value: T) => U): Some<U> {
		return some(cb(this.value));
	}

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
	public mapOr<U>(_: U, cb: (value: T) => U): U {
		return cb(this.value);
	}

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
	public mapOrElse<U>(_: () => U, cb: (value: T) => U): U {
		return cb(this.value);
	}

	/**
	 * Calls the provided closure with a reference to the contained value (if `Some`).
	 * @param cb The predicate.
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
	public inspect(cb: (value: T) => void): this {
		cb(this.value);
		return this;
	}

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
	public okOr(err?: any): Ok<T>;
	public okOr(): Ok<T> {
		return ok(this.value);
	}

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
	public okOrElse(cb: () => any): Ok<T>;
	public okOrElse(): Ok<T> {
		return ok(this.value);
	}

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
	public *iter(): Generator<T> {
		yield this.value;
	}

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
	public and<R extends Option<any>>(option: R): R {
		return option;
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
	public andThen<R extends Option<any>>(cb: (value: T) => R): R {
		return cb(this.value);
	}

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
	public or(option: Option<any>): this;
	public or(): this {
		return this;
	}

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
	public orElse(cb?: () => Option<any>): this;
	public orElse(): this {
		return this;
	}

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
	public xor(option: Some<T>): None;
	public xor(option: None): this;
	public xor(option: Option<T>): this | None;
	public xor(option: Option<T>): this | None {
		return option.isSome() ? none : this;
	}

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
	public filter(predicate: (value: T) => true): this;
	public filter(predicate: (value: T) => false): None;
	public filter(predicate: (value: T) => boolean): this | None;
	public filter(predicate: (value: T) => boolean): this | None {
		return predicate(this.value) ? this : none;
	}

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
	public contains(value: T): boolean {
		return this.value === value;
	}

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
	public zip(other: None): None;
	public zip<U>(other: Some<U>): Some<[T, U]>;
	public zip<U>(other: Option<U>): Option<[T, U]>;
	public zip<U>(other: Option<U>): Option<[T, U]> {
		return other.map((o) => [this.value, o] as [T, U]);
	}

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
	public zipWith<U, R>(other: None, f: (s: T, o: U) => R): None;
	public zipWith<U, R>(other: Some<U>, f: (s: T, o: U) => R): Some<R>;
	public zipWith<U, R>(other: Option<U>, f: (s: T, o: U) => R): Option<R>;
	public zipWith<U, R>(other: Option<U>, f: (s: T, o: U) => R): Option<R> {
		return other.map((o) => f(this.value, o));
	}

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
	public unzip<I, U>(this: Some<readonly [I, U]>): [Some<I>, Some<U>] {
		const [s, o] = this.value;
		return [some(s), some(o)];
	}

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
	public transpose<Inner>(this: Some<Ok<Inner>>): Ok<Some<Inner>>;
	public transpose<Inner>(this: Some<Err<Inner>>): Err<Some<Inner>>;
	public transpose<IT, E>(this: Some<Result<IT, E>>): Result<Some<IT>, E>;
	public transpose<IT, E>(this: Some<Result<IT, E>>): Result<Some<IT>, E> {
		return this.value.match({
			ok: (v) => ok(some(v)),
			err: (e) => err(e)
		});
	}

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
	public flatten<Inner extends Option<any>>(this: Some<Inner>): Inner {
		return this.value;
	}

	/**
	 * Checks whether or not `other` equals with self.
	 * @param other The other option to compare.
	 *
	 * @see {@link https://doc.rust-lang.org/std/cmp/trait.PartialEq.html#tymethod.eq}
	 */
	public eq(other: None): false;
	public eq(other: Option<T>): boolean;
	public eq(other: Option<T>): boolean {
		return other.isSomeAnd((value) => this.value === value);
	}

	/**
	 * Checks whether or not `other` doesn't equal with self.
	 * @param other The other option to compare.
	 *
	 * @see {@link https://doc.rust-lang.org/std/cmp/trait.PartialEq.html#method.ne}
	 */
	public ne(other: None): true;
	public ne(other: Option<T>): boolean;
	public ne(other: Option<T>): boolean {
		return !this.eq(other);
	}

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
	public match<Some, None>(branches: { some(value: T): Some; none(): None }): Some {
		return branches.some(this.value);
	}

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
	public *[Symbol.iterator](): Generator<T> {
		yield this.value;
	}
}

export function some<T>(value: T): Some<T> {
	return new Some<T>(value);
}
