import type { Awaitable } from '../common/utils.js';
import type { Option } from '../Option.js';
import type { Result } from '../Result.js';
import { createErr, type ResultErr } from '../Result/Err.js';
import { createOk, type ResultOk } from '../Result/Ok.js';
import type { IOption } from './IOption.js';
import { createNone, type OptionNone } from './None.js';

export class OptionSome<T> implements IOption<T> {
	private readonly value: T;

	public constructor(value: T) {
		this.value = value;
	}

	public isSome(): this is OptionSome<T> {
		return true;
	}

	public isSomeAnd<R extends boolean>(cb: (value: T) => R): R {
		return cb(this.value);
	}

	public isNone(): false {
		return false;
	}

	public expect(message: string): T;
	public expect(): T {
		return this.value;
	}

	public unwrap(): T {
		return this.value;
	}

	public unwrapOr(defaultValue: unknown): T;
	public unwrapOr(): T {
		return this.value;
	}

	public unwrapOrElse(cb: () => unknown): T;
	public unwrapOrElse(): T {
		return this.value;
	}

	public map<U>(cb: (value: T) => U): OptionSome<U> {
		return createSome(cb(this.value));
	}

	public mapInto<R extends Option<any>>(cb: (value: T) => R): R {
		return cb(this.value);
	}

	public mapOr<U>(_: U, cb: (value: T) => U): U {
		return cb(this.value);
	}

	public mapOrElse<U>(_: () => U, cb: (value: T) => U): U {
		return cb(this.value);
	}

	public mapNoneInto(cb: () => Option<any>): this;
	public mapNoneInto(): this {
		return this;
	}

	public inspect(cb: (value: T) => void): this {
		cb(this.value);
		return this;
	}

	public async inspectAsync(cb: (value: T) => Awaitable<unknown>): Promise<this> {
		await cb(this.value);
		return this;
	}

	public okOr(err?: any): ResultOk<T>;
	public okOr(): ResultOk<T> {
		return createOk(this.value);
	}

	public okOrElse(cb: () => any): ResultOk<T>;
	public okOrElse(): ResultOk<T> {
		return createOk(this.value);
	}

	public *iter(): Generator<T> {
		yield this.value;
	}

	public and<R extends Option<any>>(option: R): R {
		return option;
	}

	public andThen<R extends Option<any>>(cb: (value: T) => R): R {
		return cb(this.value);
	}

	public or(option: Option<any>): this;
	public or(): this {
		return this;
	}

	public orElse(cb?: () => Option<any>): this;
	public orElse(): this {
		return this;
	}

	public xor(option: OptionSome<T>): OptionNone;
	public xor(option: OptionNone): this;
	public xor(option: Option<T>): this | OptionNone;
	public xor(option: Option<T>): this | OptionNone {
		return option.isSome() ? createNone : this;
	}

	public filter(predicate: (value: T) => true): this;
	public filter(predicate: (value: T) => false): OptionNone;
	public filter(predicate: (value: T) => boolean): this | OptionNone;
	public filter(predicate: (value: T) => boolean): this | OptionNone {
		return predicate(this.value) ? this : createNone;
	}

	public contains(value: T): boolean {
		return this.value === value;
	}

	public zip(other: OptionNone): OptionNone;
	public zip<U>(other: OptionSome<U>): OptionSome<[T, U]>;
	public zip<U>(other: Option<U>): Option<[T, U]>;
	public zip<U>(other: Option<U>): Option<[T, U]> {
		return other.map((o) => [this.value, o] as [T, U]);
	}

	public zipWith<U, R>(other: OptionNone, f: (s: T, o: U) => R): OptionNone;
	public zipWith<U, R>(other: OptionSome<U>, f: (s: T, o: U) => R): OptionSome<R>;
	public zipWith<U, R>(other: Option<U>, f: (s: T, o: U) => R): Option<R>;
	public zipWith<U, R>(other: Option<U>, f: (s: T, o: U) => R): Option<R> {
		return other.map((o) => f(this.value, o));
	}

	public unzip<I, U>(this: OptionSome<readonly [I, U]>): [OptionSome<I>, OptionSome<U>] {
		const [s, o] = this.value;
		return [createSome(s), createSome(o)];
	}

	public transpose<Inner>(this: OptionSome<ResultOk<Inner>>): ResultOk<OptionSome<Inner>>;
	public transpose<Inner>(this: OptionSome<ResultErr<Inner>>): ResultErr<OptionSome<Inner>>;
	public transpose<IT, E>(this: OptionSome<Result<IT, E>>): Result<OptionSome<IT>, E>;
	public transpose<IT, E>(this: OptionSome<Result<IT, E>>): Result<OptionSome<IT>, E> {
		return this.value.match({
			ok: (v) => createOk(createSome(v)),
			err: (e) => createErr(e)
		});
	}

	public flatten<Inner extends Option<any>>(this: OptionSome<Inner>): Inner {
		return this.value;
	}

	public async intoPromise(): Promise<OptionSome<Awaited<T>>> {
		return createSome(await this.value);
	}

	public eq(other: OptionNone): false;
	public eq(other: Option<T>): boolean;
	public eq(other: Option<T>): boolean {
		return other.isSomeAnd((value) => this.value === value);
	}

	public ne(other: OptionNone): true;
	public ne(other: Option<T>): boolean;
	public ne(other: Option<T>): boolean {
		return !this.eq(other);
	}

	public match<SomeValue, NoneValue>(branches: { some(value: T): SomeValue; none(): NoneValue }): SomeValue {
		return branches.some(this.value);
	}

	public *[Symbol.iterator](): Generator<T> {
		yield this.value;
	}
}

export function createSome<T>(value: T): OptionSome<T> {
	return new OptionSome<T>(value);
}
