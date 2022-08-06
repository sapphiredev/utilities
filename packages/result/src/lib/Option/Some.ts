import type { Awaitable } from '../common/utils';
import type { Option } from '../Option';
import type { Result } from '../Result';
import { err, type Err } from '../Result/Err';
import { ok, type Ok } from '../Result/Ok';
import type { IOption } from './IOption';
import { none, type None } from './None';

export class Some<T> implements IOption<T> {
	private readonly value: T;

	public constructor(value: T) {
		this.value = value;
	}

	public isSome(): this is Some<T> {
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

	public map<U>(cb: (value: T) => U): Some<U> {
		return some(cb(this.value));
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

	public okOr(err?: any): Ok<T>;
	public okOr(): Ok<T> {
		return ok(this.value);
	}

	public okOrElse(cb: () => any): Ok<T>;
	public okOrElse(): Ok<T> {
		return ok(this.value);
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

	public xor(option: Some<T>): None;
	public xor(option: None): this;
	public xor(option: Option<T>): this | None;
	public xor(option: Option<T>): this | None {
		return option.isSome() ? none : this;
	}

	public filter(predicate: (value: T) => true): this;
	public filter(predicate: (value: T) => false): None;
	public filter(predicate: (value: T) => boolean): this | None;
	public filter(predicate: (value: T) => boolean): this | None {
		return predicate(this.value) ? this : none;
	}

	public contains(value: T): boolean {
		return this.value === value;
	}

	public zip(other: None): None;
	public zip<U>(other: Some<U>): Some<[T, U]>;
	public zip<U>(other: Option<U>): Option<[T, U]>;
	public zip<U>(other: Option<U>): Option<[T, U]> {
		return other.map((o) => [this.value, o] as [T, U]);
	}

	public zipWith<U, R>(other: None, f: (s: T, o: U) => R): None;
	public zipWith<U, R>(other: Some<U>, f: (s: T, o: U) => R): Some<R>;
	public zipWith<U, R>(other: Option<U>, f: (s: T, o: U) => R): Option<R>;
	public zipWith<U, R>(other: Option<U>, f: (s: T, o: U) => R): Option<R> {
		return other.map((o) => f(this.value, o));
	}

	public unzip<I, U>(this: Some<readonly [I, U]>): [Some<I>, Some<U>] {
		const [s, o] = this.value;
		return [some(s), some(o)];
	}

	public transpose<Inner>(this: Some<Ok<Inner>>): Ok<Some<Inner>>;
	public transpose<Inner>(this: Some<Err<Inner>>): Err<Some<Inner>>;
	public transpose<IT, E>(this: Some<Result<IT, E>>): Result<Some<IT>, E>;
	public transpose<IT, E>(this: Some<Result<IT, E>>): Result<Some<IT>, E> {
		return this.value.match({
			ok: (v) => ok(some(v)),
			err: (e) => err(e)
		});
	}

	public flatten<Inner extends Option<any>>(this: Some<Inner>): Inner {
		return this.value;
	}

	public eq(other: None): false;
	public eq(other: Option<T>): boolean;
	public eq(other: Option<T>): boolean {
		return other.isSomeAnd((value) => this.value === value);
	}

	public ne(other: None): true;
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

export function some<T>(value: T): Some<T> {
	return new Some<T>(value);
}
