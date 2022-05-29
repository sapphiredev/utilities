import type { IValue } from '../common/IValue';
import { toJSON, toPrimitive, toString, valueOf } from '../common/utils';
import type { IOption } from '../Option/IOption';
import { none, type None } from '../Option/None';
import { some, type Some } from '../Option/Some';
import type { Err } from './Err';
import type { IResult } from './IResult';
import { ResultError } from './ResultError';

export class Ok<T> implements IResult<T, any>, IValue<T> {
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

	public isErrAnd(cb?: (error: never) => boolean): false;
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

	public mapErr(cb?: (error: never) => any): this;
	public mapErr(): this {
		return this;
	}

	public inspect(cb: (value: T) => void): this {
		cb(this.value);
		return this;
	}

	public inspectErr(cb?: (error: never) => void): this;
	public inspectErr(): this {
		return this;
	}

	public *iter(): Generator<T> {
		yield this.value;
	}

	public expect(message?: string): T;
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

	public unwrapOr(defaultValue: T): T;
	public unwrapOr(): T {
		return this.value;
	}

	public unwrapOrElse(op: (error: any) => T): T;
	public unwrapOrElse(): T {
		return this.value;
	}

	public and<R extends IResult<any, any>>(result: R): R {
		return result;
	}

	public andThen<R extends IResult<any, any>>(cb: (value: T) => R): R {
		return cb(this.value);
	}

	public or(result: IResult<T, any>): this;
	public or(): this {
		return this;
	}

	public orElse(cb: (error: never) => IResult<T, any>): this;
	public orElse(): this {
		return this;
	}

	public contains(value: T): boolean {
		return this.value === value;
	}

	public containsErr(error?: unknown): false;
	public containsErr(): false {
		return false;
	}

	public transpose(this: Ok<None>): None;
	public transpose<Inner>(this: Ok<Some<Inner>>): Some<Ok<Inner>>;
	public transpose<Inner>(this: Ok<IOption<Inner>>): IOption<Ok<Inner>>;
	public transpose<IT>(this: Ok<IOption<IT>>): IOption<Ok<IT>> {
		return this.value.match({
			some: (value) => some(ok(value)) as any,
			none: () => none as any
		});
	}

	public flatten<Inner extends IResult<any, any>>(this: Ok<Inner>): Inner {
		return this.value;
	}

	public intoOkOrErr() {
		return this.value;
	}

	public eq(other: Err<any>): false;
	public eq(other: IResult<T, any>): boolean;
	public eq(other: IResult<T, any>): boolean {
		return other.isOkAnd((value) => this.value === value);
	}

	public ne(other: Err<any>): true;
	public ne(other: IResult<T, any>): boolean;
	public ne(other: IResult<T, any>): boolean {
		return !this.eq(other);
	}

	public match<U>(branches: { ok(value: T): U; err(error: any): U }): U {
		return branches.ok(this.value);
	}

	public *[Symbol.iterator](): Generator<T> {
		yield this.value;
	}

	public toString(): IValue.ToString<T> {
		return toString(this.value);
	}

	public valueOf(): IValue.ValueOf<T> {
		return valueOf(this.value);
	}

	public toJSON(): IValue.ToJSON<T> {
		return toJSON(this.value);
	}

	public [Symbol.toPrimitive](hint: 'number'): IValue.ToNumber<T>;
	public [Symbol.toPrimitive](hint: 'string'): IValue.ToString<T>;
	public [Symbol.toPrimitive](hint: IValue.PrimitiveHint): IValue.ToPrimitive<T>;
	public [Symbol.toPrimitive](hint: IValue.PrimitiveHint): IValue.ToPrimitive<T> {
		return toPrimitive(hint, this.value);
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
export function ok<T>(x?: T): Ok<T | undefined> {
	return new Ok(x);
}
