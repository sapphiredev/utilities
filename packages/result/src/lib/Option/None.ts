import { err, type Err } from '../Result/Err';
import { ok, type Ok } from '../Result/Ok';
import type { IOption } from './IOption';
import { OptionError } from './OptionError';
import type { Some } from './Some';

export class None implements IOption<any> {
	public isSome(): false {
		return false;
	}

	public isSomeAnd(cb?: (value: never) => boolean): false;
	public isSomeAnd(): false {
		return false;
	}

	public isNone(): true {
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

	public mapOr<R>(defaultValue: R, cb?: (value: never) => R): R;
	public mapOr<R>(defaultValue: R): R {
		return defaultValue;
	}

	public mapOrElse<R>(defaultValue: () => R, cb?: (value: never) => R): R;
	public mapOrElse<R>(defaultValue: () => R): R {
		return defaultValue();
	}

	public inspect(cb?: (value: never) => void): this;
	public inspect(): this {
		return this;
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

	public and(option: IOption<any>): this;
	public and(): this {
		return this;
	}

	public andThen(cb: (value: never) => IOption<any>): this;
	public andThen(): this {
		return this;
	}

	public or<R extends IOption<any>>(option: R): R {
		return option;
	}

	public orElse<R extends IOption<any>>(cb: () => R): R {
		return cb();
	}

	public xor<T>(option: None): None;
	public xor<T>(option: Some<T>): Some<T>;
	public xor<T>(option: IOption<T>): Some<T> | None;
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

	public zip(other: IOption<any>): None;
	public zip(): None {
		return this;
	}

	public zipWith(other: IOption<any>, f: (s: never, o: never) => any): None;
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

	public eq(other: None): true;
	public eq(other: Some<any>): false;
	public eq(other: IOption<any>): boolean;
	public eq(other: IOption<any>): boolean {
		return other.isNone();
	}

	public ne(other: None): false;
	public ne(other: Some<any>): true;
	public ne(other: IOption<any>): boolean;
	public ne(other: IOption<any>): boolean {
		return other.isSome();
	}

	public match<U>(branches: { some(value: any): U; none(): U }): U {
		return branches.none();
	}

	public *[Symbol.iterator](): Generator<never> {
		// Yields no values
	}
}

export const none = new None();
