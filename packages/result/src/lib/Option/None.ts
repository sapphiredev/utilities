import type { Awaitable } from '../common/utils.js';
import type { Option } from '../Option.js';
import { createErr, type ResultErr } from '../Result/Err.js';
import { createOk, type ResultOk } from '../Result/Ok.js';
import type { IOption } from './IOption.js';
import { OptionError } from './OptionError.js';
import type { OptionSome } from './Some.js';

export class OptionNone implements IOption<any> {
	public isSome(): false {
		return false;
	}

	public isSomeAnd(cb?: (value: never) => boolean): false;
	public isSomeAnd(): false {
		return false;
	}

	public isNone(): this is OptionNone {
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

	public okOr<E>(error: E): ResultErr<E> {
		return createErr(error);
	}

	public okOrElse<E>(cb: () => E): ResultErr<E> {
		return createErr(cb());
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

	public xor<T>(option: OptionNone): OptionNone;
	public xor<T>(option: OptionSome<T>): OptionSome<T>;
	public xor<T>(option: Option<T>): OptionSome<T> | OptionNone;
	public xor<T>(option: OptionSome<T> | OptionNone): OptionSome<T> | OptionNone {
		return option.isSome() ? option : this;
	}

	public filter(predicate: (value: never) => boolean): OptionNone;
	public filter(): OptionNone {
		return this;
	}

	public contains(value?: any): false;
	public contains(): false {
		return false;
	}

	public zip(other: Option<any>): OptionNone;
	public zip(): OptionNone {
		return this;
	}

	public zipWith(other: Option<any>, f: (s: never, o: never) => any): OptionNone;
	public zipWith(): OptionNone {
		return this;
	}

	public unzip(): [OptionNone, OptionNone] {
		return [this, this];
	}

	public transpose(): ResultOk<OptionNone> {
		return createOk(this);
	}

	public flatten(): OptionNone {
		return this;
	}

	public intoPromise(): Promise<OptionNone> {
		return Promise.resolve(createNone);
	}

	public eq(other: OptionNone): true;
	public eq(other: OptionSome<any>): false;
	public eq(other: Option<any>): boolean;
	public eq(other: Option<any>): boolean {
		return other.isNone();
	}

	public ne(other: OptionNone): false;
	public ne(other: OptionSome<any>): true;
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

export const createNone = new OptionNone();
