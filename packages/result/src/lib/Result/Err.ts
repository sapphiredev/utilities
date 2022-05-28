import type { IValue } from '../common/IValue';
import { toJSON, toPrimitive, toString, valueOf } from '../common/utils';
import { none, type None } from '../Option/None';
import { some, type Some } from '../Option/Some';
import type { IResult } from './IResult';
import { ResultError } from './ResultError';

export class Err<E> implements IResult<any, E>, IValue<E> {
	private readonly error: E;

	public constructor(error: E) {
		this.error = error;
	}

	public isOk(): false {
		return false;
	}

	public isOkAnd(cb?: (value: never) => boolean): false;
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

	public map(cb?: (value: never) => unknown): this;
	public map(): this {
		return this;
	}

	public mapOr<U>(defaultValue: U, cb?: (value: never) => U): U;
	public mapOr<U>(defaultValue: U): U {
		return defaultValue;
	}

	public mapOrElse<U>(op: (error: E) => U, cb?: (value: never) => U): U;
	public mapOrElse<U>(op: (error: E) => U): U {
		return op(this.error);
	}

	public mapErr<F>(cb: (error: E) => F): Err<F> {
		return err(cb(this.error));
	}

	public inspect(cb?: (value: never) => void): this;
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

	public expectErr(message?: string): E;
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

	public and(result?: IResult<any, E>): this;
	public and(): this {
		return this;
	}

	public andThen(cb?: (value: never) => IResult<any, E>): this;
	public andThen(): this {
		return this;
	}

	public or<R extends IResult<any, any>>(result: R): R {
		return result;
	}

	public orElse<R extends IResult<any, any>>(cb: (error: E) => R): R {
		return cb(this.error);
	}

	public contains(value?: any): false;
	public contains(): false {
		return false;
	}

	public containsErr(error: E): boolean {
		return this.error === error;
	}

	public transpose(): Some<this> {
		return some(this);
	}

	public flatten(): this {
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

	public *[Symbol.iterator](): Generator<never> {
		// Yields no values
	}

	public toString(): IValue.ToString<E> {
		return toString(this.error);
	}

	public valueOf(): IValue.ValueOf<E> {
		return valueOf(this.error);
	}

	public toJSON(): IValue.ToJSON<E> {
		return toJSON(this.error);
	}

	public [Symbol.toPrimitive](hint: 'number'): IValue.ToNumber<E>;
	public [Symbol.toPrimitive](hint: 'string'): IValue.ToString<E>;
	public [Symbol.toPrimitive](hint: IValue.PrimitiveHint): IValue.ToPrimitive<E>;
	public [Symbol.toPrimitive](hint: IValue.PrimitiveHint): IValue.ToPrimitive<E> {
		return toPrimitive(hint, this.error);
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
