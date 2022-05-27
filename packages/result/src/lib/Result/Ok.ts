import type { IOption } from '../Option/IOption';
import { none, type None } from '../Option/None';
import { some, type Some } from '../Option/Some';
import type { IResult } from './IResult';
import { ResultError } from './ResultError';

export class Ok<T> implements IResult<T, any> {
	private readonly value: T;

	public constructor(value: T) {
		this.value = value;
	}

	public isOk(): true {
		return true;
	}

	public isOkAnd<R extends boolean>(cb: (value: T) => R): R {
		return cb(this.value);
	}

	public isErr(): false {
		return false;
	}

	public isErrAnd(): false {
		return false;
	}

	public ok(): Some<T> {
		return some(this.value);
	}

	public err(): None {
		return none;
	}

	public map<U>(cb: (value: T) => U): Ok<U> {
		return ok(cb(this.value));
	}

	public mapOr<U>(_: U, cb: (value: T) => U): U {
		return cb(this.value);
	}

	public mapOrElse<U>(_: (error: never) => U, cb: (value: T) => U): U {
		return cb(this.value);
	}

	public mapErr(): Ok<T> {
		return this;
	}

	public inspect(cb: (value: T) => void): this {
		cb(this.value);
		return this;
	}

	public inspectErr(): this {
		return this;
	}

	public *iter(): Generator<T> {
		yield this.value;
	}

	public expect(): T {
		return this.value;
	}

	public expectErr(message: string): never {
		throw new ResultError(message, this.value);
	}

	public unwrap(): T {
		return this.value;
	}

	public unwrapErr(): never {
		throw new ResultError('Unwrap failed', this.value);
	}

	public unwrapOr(): T {
		return this.value;
	}

	public unwrapOrElse(): T {
		return this.value;
	}

	public and<R extends IResult<any, any>>(result: R): R {
		return result;
	}

	public andThen<R extends IResult<any, any>>(cb: (value: T) => R): R {
		return cb(this.value);
	}

	public or(): Ok<T> {
		return this;
	}

	public orElse(): Ok<T> {
		return this;
	}

	public contains(value: T): boolean {
		return this.value === value;
	}

	public containsErr(): false {
		return false;
	}

	public transpose<IT>(this: Ok<IOption<IT>>): IOption<Ok<IT>> {
		return this.value.match({
			some: (value) => some(ok(value)) as IOption<Ok<IT>>,
			none: () => none as IOption<Ok<IT>>
		});
	}

	public flatten<Inner extends IResult<any, any>>(this: Ok<Inner>): Inner {
		return this.value;
	}

	public intoOkOrErr() {
		return this.value;
	}

	public eq(other: IResult<T, any>): boolean {
		return other.isOkAnd((value) => this.value === value);
	}

	public ne(other: IResult<T, any>): boolean {
		return !this.eq(other);
	}

	public match<U>(branches: { ok(value: T): U; err(error: any): U }): U {
		return branches.ok(this.value);
	}

	public *[Symbol.iterator](): Generator<T> {
		yield this.value;
	}
}

/**
 * Creates an Ok with no value.
 * @return A successful Result.
 */
export function ok(): Ok<unknown>;

/**
 * Creates an Ok.
 * @typeparam T The result's type.
 * @param x Value to use.
 * @return A successful Result.
 */
export function ok<T>(x: T): Ok<T>;
export function ok<T>(x?: T): Ok<unknown> {
	return new Ok(x);
}
