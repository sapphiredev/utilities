import { isFunction, returnThis, type Awaitable, type If } from './common/utils';
import { OptionError } from './OptionError';
import { err, ok, Result, type Err, type Ok } from './Result';

const ValueProperty = Symbol.for('@sapphire/result:Option.value');
const ExistsProperty = Symbol.for('@sapphire/result:Option.exists');

export class Option<T, Exists extends boolean = boolean> {
	/**
	 * Branded value to ensure `Success` is typed correctly.
	 * @internal
	 */
	protected declare __STATUS__: Exists;

	private readonly [ValueProperty]: If<Exists, T, null>;
	private readonly [ExistsProperty]: Exists;

	private constructor(value: If<Exists, T, null>, exists: Exists) {
		this[ValueProperty] = value;
		this[ExistsProperty] = exists;
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
	public isSome(): this is Some<T> {
		return this[ExistsProperty];
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
	public isSomeAnd<R extends T>(cb: (value: T) => value is R): this is Some<R>;
	public isSomeAnd<R extends boolean>(cb: (value: T) => R): this is Some<R> & R;
	public isSomeAnd<R extends boolean>(cb: (value: T) => R): this is Some<R> & R {
		return this.isSome() && cb(this[ValueProperty]);
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
	public isNone(): this is None {
		return !this[ExistsProperty];
	}

	/**
	 * Returns `true` if the option is a `None` value.
	 *
	 * @example
	 * ```typescript
	 * const x: Option<number> = some(2);
	 * assert.equal(x.isNoneOr((x) => x > 1), true);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = some(0);
	 * assert.equal(x.isNoneOr((x) => x > 1), false);
	 * ```
	 * @example
	 * ```typescript
	 * const x: Option<number> = none;
	 * assert.equal(x.isNoneOr((x) => x > 1), true);
	 * ```
	 *
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.is_none}
	 */
	public isNoneOr<R extends T>(cb: (value: T) => value is R): this is None | Some<R>;
	public isNoneOr<R extends boolean>(cb: (value: T) => R): If<Exists, R, true>;
	public isNoneOr<R extends boolean>(cb: (value: T) => R): If<Exists, R, true> {
		return this.match({ some: (value) => cb(value), none: () => true });
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
	public expect(message: string): If<Exists, T, never> {
		if (this.isNone()) throw new OptionError(message);
		// @ts-expect-error Complex types
		return this[ValueProperty];
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
	public unwrap(): If<Exists, T, never> {
		if (this.isNone()) throw new OptionError('Unwrap failed');
		// @ts-expect-error Complex types
		return this[ValueProperty];
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
	public unwrapOr<OutputValue>(defaultValue: OutputValue): If<Exists, T, OutputValue> {
		return this.match({ some: (value) => value, none: () => defaultValue });
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
	public unwrapOrElse<OutputValue>(cb: () => OutputValue): If<Exists, T, OutputValue> {
		return this.match({ some: (value) => value, none: cb });
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
	public map<U>(cb: (value: T) => U): If<Exists, Some<U>, None> {
		return this.match({ some: (value) => some(cb(value)), none: returnThis });
	}

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
	public mapInto<OutputOption extends AnyOption>(cb: (value: T) => OutputOption): If<Exists, OutputOption, None> {
		return this.match({ some: (value) => cb(value), none: returnThis });
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
	public mapOr<MappedOutputValue, DefaultOutputValue>(
		defaultValue: DefaultOutputValue,
		cb: (value: T) => MappedOutputValue
	): If<Exists, MappedOutputValue, DefaultOutputValue> {
		return this.match({ some: (value) => cb(value), none: () => defaultValue });
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
	public mapOrElse<OutputValue, OutputNone>(defaultValue: () => OutputNone, cb: (value: T) => OutputValue): If<Exists, OutputValue, OutputNone> {
		return this.match({ some: (value) => cb(value), none: () => defaultValue() });
	}

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
	public mapNoneInto<OutputOption extends AnyOption>(cb: () => OutputOption): If<Exists, Some<T>, OutputOption> {
		return this.match({ some: returnThis, none: cb });
	}

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
	public inspect(cb: (value: T) => void): this {
		if (this.isSome()) cb(this[ValueProperty]);
		return this;
	}

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
	public async inspectAsync(cb: (value: T) => Awaitable<unknown>): Promise<this> {
		if (this.isSome()) await cb(this[ValueProperty]);
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
	public okOr<ErrorValue>(error: ErrorValue): If<Exists, Ok<T>, Err<ErrorValue>> {
		return this.match({ some: (value) => ok(value), none: () => err(error) });
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
	public okOrElse<ErrorValue>(cb: () => ErrorValue): If<Exists, Ok<T>, Err<ErrorValue>> {
		return this.match({ some: (value) => ok(value), none: () => err(cb()) });
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
	 * @see {@link Option.iter}
	 * @see {@link https://doc.rust-lang.org/std/option/enum.Option.html#method.iter}
	 */
	public *iter(): Generator<T> {
		if (this.isSome()) yield this[ValueProperty];
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
	public and<OutputOption extends AnyOption>(option: OutputOption): If<Exists, OutputOption, None> {
		return this.match({ some: () => option, none: returnThis });
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
	public andThen<OutputOption extends AnyOption>(cb: (value: T) => OutputOption): If<Exists, OutputOption, None> {
		return this.match({ some: (value) => cb(value), none: returnThis });
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
	public or<OutputOption extends AnyOption>(option: OutputOption): If<Exists, Some<T>, OutputOption> {
		return this.match({ some: returnThis, none: () => option });
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
	public orElse<OutputOption extends AnyOption>(cb: () => OutputOption): If<Exists, Some<T>, OutputOption> {
		return this.match({ some: returnThis, none: () => cb() });
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
	public xor<OtherValue, OtherExists extends boolean>(
		option: Option<OtherValue, OtherExists>
	): If<Exists, If<OtherExists, None, Some<T>>, Option<OtherValue, OtherExists>> {
		return this.match<If<OtherExists, None, Some<T>>, Option<OtherValue, OtherExists>>({
			some() {
				return (option.isNone() ? this : none) as If<OtherExists, None, Some<T>>;
			},
			none: () => option
		});
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
	public filter<R extends T>(predicate: (value: T) => value is R): Option<R>;
	public filter(predicate: (value: T) => boolean): Option<T>;
	public filter(predicate: (value: T) => boolean): Option<T> {
		return this.isSomeAnd(predicate) ? this : none;
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
	public contains<const Value extends T>(value: If<Exists, Value, unknown>): this is Some<Value> {
		return this.isSomeAnd((inner) => inner === value);
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
	public zip<OtherValue, OtherExists extends boolean>(
		other: Option<OtherValue, OtherExists>
	): Option<[T, OtherValue], If<Exists, OtherExists, false>> {
		// @ts-expect-error Complex types
		return this.isSome() && other.isSome() ? some([this[ValueProperty], other[ValueProperty]] as [T, OtherValue]) : none;
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
	public zipWith<OtherValue, OtherExists extends boolean, ReturnValue>(
		other: Option<OtherValue, OtherExists>,
		f: (value0: T, value1: OtherValue) => ReturnValue
	): Option<ReturnValue, If<Exists, OtherExists, false>> {
		// @ts-expect-error Complex types
		return this.isSome() && other.isSome() ? some(f(this[ValueProperty], other[ValueProperty])) : none;
	}

	/**
	 * Unzips an option containing a tuple of two options.
	 *
	 * If self is `Some([a, b])` this method returns `[Some(a), Some(b)]`. Otherwise, `[None, None]` is returned.
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
	public unzip<Value0, Value1, Exists extends boolean>(
		this: Option<readonly [Value0, Value1], Exists>
	): [Option<Value0, Exists>, Option<Value1, Exists>] {
		// @ts-expect-error Complex types
		return this.match({
			some: ([value0, value1]) => [some(value0), some(value1)],
			none: () => [none, none]
		});
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
	public transpose<ResultValue, ResultError, ResultSuccess extends boolean, Exists extends boolean>(
		this: Option<Result<ResultValue, ResultError, ResultSuccess>, Exists>
	): If<Exists, Result<Some<ResultValue>, ResultError, ResultSuccess>, Ok<None>> {
		return this.match<Result<Some<ResultValue>, ResultError, ResultSuccess>, Ok<None>>({
			// @ts-expect-error Complex types
			some: (result) => result.map(some),
			none: () => ok(none)
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
	public flatten<InnerOption extends AnyOption, Exists extends boolean>(this: Option<InnerOption, Exists>): If<Exists, InnerOption, None> {
		return this.match({ some: (inner) => inner, none: returnThis });
	}

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
	public intoPromise(): Promise<Option<Awaited<T>, Exists>> {
		// @ts-expect-error Complex types
		return this.match({
			some: async (value) => some(await value), // NOSONAR
			none: () => Promise.resolve(none)
		});
	}

	/**
	 * Checks whether or not `other` equals with self.
	 * @param other The other option to compare.
	 *
	 * @see {@link https://doc.rust-lang.org/std/cmp/trait.PartialEq.html#tymethod.eq}
	 */
	public eq<OtherValue extends T, OtherExists extends boolean>(other: Option<OtherValue, OtherExists>): this is Option<OtherValue, OtherExists> {
		// @ts-expect-error Complex types
		return this.isSome() === other.isSome() && this[ValueProperty] === other[ValueProperty];
	}

	/**
	 * Checks whether or not `other` doesn't equal with self.
	 * @param other The other option to compare.
	 *
	 * @see {@link https://doc.rust-lang.org/std/cmp/trait.PartialEq.html#method.ne}
	 */
	public ne(other: Option<T, boolean>): boolean {
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
	public match<SomeValue, NoneValue>(branches: {
		some(this: Some<T>, value: T): SomeValue;
		none(this: None): NoneValue;
	}): If<Exists, SomeValue, NoneValue> {
		// @ts-expect-error Complex types
		return this.isSome() ? branches.some.call(this, this[ValueProperty]) : branches.none.call(this);
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
	public [Symbol.iterator](): Generator<T> {
		return this.iter();
	}

	public get [Symbol.toStringTag](): If<Exists, 'Some', 'None'> {
		return this.match({ some: () => 'Some', none: () => 'None' });
	}

	public static readonly none = new Option<any, false>(null, false);

	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	public static some<T>(this: void, value: T): Some<T> {
		return new Option<T, true>(value, true);
	}

	/**
	 * Checks if the `instance` object is an instance of `Option`, or if it is a `Option`-like object. This override
	 * exists to interoperate with other versions of this class, such as the one coming from another version of this
	 * library or from a different build.
	 *
	 * @param instance The instance to check.
	 * @returns Whether or not the instance is a `Option`.
	 *
	 * @example
	 * ```typescript
	 * import { Option } from '@sapphire/result';
	 * const { some } = require('@sapphire/result');
	 *
	 * some(2) instanceof Option; // true
	 * ```
	 */
	public static [Symbol.hasInstance](instance: unknown): boolean {
		return typeof instance === 'object' && instance !== null && ValueProperty in instance && ExistsProperty in instance;
	}

	/**
	 * @deprecated Use {@link Option.isOption} instead.
	 *
	 * Checks if the `instance` object is an instance of `Option`, or if it is a `Option`-like object.
	 *
	 * @param instance The instance to check.
	 * @returns true if the instance is a `Option` or a `Option`-like object, false otherwise.
	 *
	 * @example
	 * ```typescript
	 * import { Option } from '@sapphire/result';
	 * const { some } = require('@sapphire/result');
	 *
	 * Option.isOption(some(2)); // true
	 * ```
	 */
	public static is(instance: unknown): instance is AnyOption {
		return Option[Symbol.hasInstance](instance);
	}

	/**
	 * Checks if the `instance` object is an instance of `Option`, or if it is a `Option`-like object.
	 *
	 * @param instance The instance to check.
	 * @returns true if the instance is a `Option` or a `Option`-like object, false otherwise.
	 *
	 * @example
	 * ```typescript
	 * import { Option } from '@sapphire/result';
	 * const { some } = require('@sapphire/result');
	 *
	 * Option.isOption(some(2)); // true
	 * ```
	 */
	public static isOption(instance: unknown): instance is AnyOption {
		return Option[Symbol.hasInstance](instance);
	}

	/**
	 * Creates a {@link Result} out of a callback.
	 *
	 * @typeparam T The result's type.
	 * @typeparam E The error's type.
	 */
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	public static from<T>(this: void, op: OptionResolvable<T> | (() => OptionResolvable<T>)): Option<T> {
		try {
			return resolve(isFunction(op) ? op() : op);
		} catch {
			return none;
		}
	}

	/**
	 * Creates a {@link Result} out of a promise or async callback.
	 *
	 * @typeparam T The result's type.
	 * @typeparam E The error's type.
	 */
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	public static async fromAsync<T>(this: void, op: Awaitable<OptionResolvable<T>> | (() => Awaitable<OptionResolvable<T>>)): Promise<Option<T>> {
		try {
			return resolve(await (isFunction(op) ? op() : op));
		} catch {
			return none;
		}
	}

	/**
	 * Creates an {@link Ok} that is the combination of all collected {@link Ok} values as an array, or the first
	 * {@link Err} encountered.
	 *
	 * @param results An array of {@link Result}s.
	 * @returns A new {@link Result}.
	 */
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	public static all<const Entries extends readonly AnyOption[]>(this: void, results: Entries): Option<UnwrapSomeArray<Entries>> {
		const values: unknown[] = [];
		for (const result of results) {
			if (result.isNone()) return result;

			values.push(result[ValueProperty]);
		}

		return some(values as UnwrapSomeArray<Entries>);
	}

	/**
	 * Returns the first encountered {@link Some}, or a {@link None} if none was found.
	 *
	 * @param options An array of {@link Option}s.
	 * @returns A new {@link Option}.
	 */
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	public static any<const Entries extends readonly AnyOption[]>(this: void, results: Entries): Option<UnwrapSome<Entries[number]>> {
		for (const result of results) {
			if (result.isSome()) return result;
		}

		return none;
	}
}

export namespace Option {
	export type Some<T> = Option<T, true>;
	export type None<T = any> = Option<T, false>;
	export type Any = Option<any>;
	export type Resolvable<T, Exists extends boolean = boolean> = T | null | undefined | Option<T, Exists>;
	export type UnwrapSome<T extends AnyOption> = T extends Some<infer S> ? S : never;
	export type UnwrapSomeArray<T extends readonly AnyOption[] | []> = {
		-readonly [P in keyof T]: UnwrapSome<T[P]>;
	};
}

export const { some, none } = Option;

function resolve<T>(value: Option.Resolvable<T>): Option<T> {
	if (value === null || value === undefined) return none;
	if (Option.isOption(value)) return value;
	return some(value);
}

export type OptionResolvable<T, Exists extends boolean = boolean> = Option.Resolvable<T, Exists>;

export type Some<T> = Option.Some<T>;
export type None<T = any> = Option.None<T>;
export type AnyOption = Option.Any;

export type UnwrapSome<T extends AnyOption> = Option.UnwrapSome<T>;
export type UnwrapSomeArray<T extends readonly AnyOption[] | []> = Option.UnwrapSomeArray<T>;
