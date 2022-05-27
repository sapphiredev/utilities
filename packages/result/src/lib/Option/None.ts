import { err, type Err } from '../Result/Err';
import { ok, type Ok } from '../Result/Ok';
import type { IOption } from './IOption';
import { OptionError } from './OptionError';
import type { Some } from './Some';

export class None implements IOption<any> {
	public isSome(): false {
		return false;
	}

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

	public unwrapOr<T>(defaultValue: T): T {
		return defaultValue;
	}

	public unwrapOrElse<T>(cb: () => T): T {
		return cb();
	}

	public map(): None {
		return this;
	}

	public mapOr<U>(defaultValue: U): U {
		return defaultValue;
	}

	public mapOrElse<U>(defaultValue: () => U): U {
		return defaultValue();
	}

	public inspect(): this {
		return this;
	}

	public okOr<E>(error: E): Err<E> {
		return err(error);
	}

	public okOrElse<E>(cb: () => E): Err<E> {
		return err(cb());
	}

	public *iter(): Generator<any> {
		// Yields no values
	}

	public and(): None {
		return this;
	}

	public andThen(): None {
		return this;
	}

	public or<R extends IOption<any>>(option: R): R {
		return option;
	}

	public orElse<R extends IOption<any>>(cb: () => R): R {
		return cb();
	}

	public xor<T>(option: IOption<T>): Some<T> | None {
		return option.isSome() ? this : this;
	}

	public filter(): None {
		return this;
	}

	public contains(): false {
		return false;
	}

	public zip(): None {
		return this;
	}

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

	public eq(other: IOption<any>): boolean {
		return other.isNone();
	}

	public ne(other: IOption<any>): boolean {
		return other.isSome();
	}

	public match<U>(branches: { some(value: any): U; none(): U }): U {
		return branches.none();
	}

	public *[Symbol.iterator](): Generator<any> {
		// Yields no values
	}
}

export const none = new None();
