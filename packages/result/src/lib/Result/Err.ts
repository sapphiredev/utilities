import { none, type None } from '../Option/None';
import { some, type Some } from '../Option/Some';
import type { IResult } from './IResult';
import { ResultError } from './ResultError';

export class Err<E> implements IResult<any, E> {
	private readonly error: E;

	public constructor(error: E) {
		this.error = error;
	}

	public isOk(): false {
		return false;
	}

	public isOkAnd(): false {
		return false;
	}

	public isErr(): true {
		return true;
	}

	public isErrAnd(cb: (error: E) => boolean): boolean {
		return cb(this.error);
	}

	public ok(): None {
		return none;
	}

	public err(): Some<E> {
		return some(this.error);
	}

	public map<U>(): IResult<U, E> {
		return this as unknown as IResult<U, E>;
	}

	public mapOr<U>(defaultValue: U): U {
		return defaultValue;
	}

	public mapOrElse<U>(op: (error: E) => U): U {
		return op(this.error);
	}

	public mapErr<F>(cb: (error: E) => F): IResult<any, F> {
		return err(cb(this.error));
	}

	public inspect(): this {
		return this;
	}

	public inspectErr(cb: (error: E) => void): this {
		cb(this.error);
		return this;
	}

	public *iter(): Generator<never> {
		// Yields no values
	}

	public expect(message: string): never {
		throw new ResultError(message, this.error);
	}

	public expectErr(): E {
		return this.error;
	}

	public unwrap(): never {
		throw new ResultError('Unwrap failed', this.error);
	}

	public unwrapErr(): E {
		return this.error;
	}

	public unwrapOr<T>(defaultValue: T): T {
		return defaultValue;
	}

	public unwrapOrElse<T>(op: (error: E) => T): T {
		return op(this.error);
	}

	public and(): Err<E> {
		return this;
	}

	public andThen(): Err<E> {
		return this;
	}

	public or<R extends IResult<any, any>>(result: R): R {
		return result;
	}

	public orElse<R extends IResult<any, any>>(cb: (error: E) => R): R {
		return cb(this.error);
	}

	public contains(): boolean {
		return false;
	}

	public containsErr(error: E): boolean {
		return this.error === error;
	}

	public transpose(): Some<Err<E>> {
		return some(this);
	}

	public flatten(): Err<E> {
		return this;
	}

	public intoOkOrErr(): E {
		return this.error;
	}

	public eq(other: IResult<any, E>): boolean {
		return other.isErrAnd((error) => this.error === error);
	}

	public ne(other: IResult<any, E>): boolean {
		return !this.eq(other);
	}

	public match<U>(branches: { ok(value: any): U; err(error: E): U }): U {
		return branches.err(this.error);
	}

	public *[Symbol.iterator](): Generator<any> {
		// Yields no values
	}
}

/**
 * Creates an Err with no error.
 * @return An erroneous Result.
 */
export function err(): Err<unknown>;

/**
 * Creates an Err.
 * @typeparam E The error's type.
 * @param x Value to use.
 * @return An erroneous Result.
 */
export function err<E>(x: E): Err<E>;
export function err<E>(x?: E): Err<unknown> {
	return new Err(x);
}
