import type { Awaitable } from '../common/utils.js';
import type { Option } from '../Option.js';
import { err, type Err } from '../Result/Err.js';
import { ok, type Ok } from '../Result/Ok.js';
import type { IOption } from './IOption.js';
import { OptionError } from './OptionError.js';
import type { Some } from './Some.js';

export class None implements IOption<any> {
	public isSome(): false {
		return false;
	}

	public isSomeAnd(cb?: (value: never) => boolean): false;
	public isSomeAnd(): false {
		return false;
	}

	public isNone(): this is None {
		return true;
	}

	public expect(message: string): never {
		throw new OptionError(message);
	}

	public unwrap(): never {
		throw new OptionError('Unwrap failed');
	}

	public unwrapOr<R>(defaultValue: R): R {
		return defaultValue;
	}

	public unwrapOrElse<R>(cb: () => R): R {
		return cb();
	}

	public map(cb: (value: never) => any): this;
	public map(): this {
		return this;
	}

	public mapInto(cb: (value: never) => Option<any>): this;
	public mapInto(): this {
		return this;
	}

	public mapOr<R>(defaultValue: R, cb?: (value: never) => R): R;
	public mapOr<R>(defaultValue: R): R {
		return defaultValue;
	}

	public mapOrElse<R>(defaultValue: () => R, cb?: (value: never) => R): R;
	public mapOrElse<R>(defaultValue: () => R): R {
		return defaultValue();
	}

	public mapNoneInto<R extends Option<any>>(cb: () => R): R {
		return cb();
	}

	public inspect(cb?: (value: never) => void): this;
	public inspect(): this {
		return this;
	}

	public inspectAsync(cb?: (value: never) => Awaitable<unknown>): Promise<this>;
	public inspectAsync(): Promise<this> {
		return Promise.resolve(this);
	}

	public okOr<E>(error: E): Err<E> {
		return err(error);
	}

	public okOrElse<E>(cb: () => E): Err<E> {
		return err(cb());
	}

	public *iter(): Generator<never> {
		// Yields no values
	}

	public and(option: Option<any>): this;
	public and(): this {
		return this;
	}

	public andThen(cb: (value: never) => Option<any>): this;
	public andThen(): this {
		return this;
	}

	public or<R extends Option<any>>(option: R): R {
		return option;
	}

	public orElse<R extends Option<any>>(cb: () => R): R {
		return cb();
	}

	public xor<T>(option: None): None;
	public xor<T>(option: Some<T>): Some<T>;
	public xor<T>(option: Option<T>): Some<T> | None;
	public xor<T>(option: Some<T> | None): Some<T> | None {
		return option.isSome() ? option : this;
	}

	public filter(predicate: (value: never) => boolean): None;
	public filter(): None {
		return this;
	}

	public contains(value?: any): false;
	public contains(): false {
		return false;
	}

	public zip(other: Option<any>): None;
	public zip(): None {
		return this;
	}

	public zipWith(other: Option<any>, f: (s: never, o: never) => any): None;
	public zipWith(): None {
		return this;
	}

	public unzip(): [None, None] {
		return [this, this];
	}

	public transpose(): Ok<None> {
		return ok(this);
	}

	public flatten(): None {
		return this;
	}

	public intoPromise(): Promise<None> {
		return Promise.resolve(none);
	}

	public eq(other: None): true;
	public eq(other: Some<any>): false;
	public eq(other: Option<any>): boolean;
	public eq(other: Option<any>): boolean {
		return other.isNone();
	}

	public ne(other: None): false;
	public ne(other: Some<any>): true;
	public ne(other: Option<any>): boolean;
	public ne(other: Option<any>): boolean {
		return other.isSome();
	}

	public match<SomeValue, NoneValue>(branches: { some(value: never): SomeValue; none(): NoneValue }): NoneValue {
		return branches.none();
	}

	public *[Symbol.iterator](): Generator<never> {
		// Yields no values
	}
}

export const none = new None();
