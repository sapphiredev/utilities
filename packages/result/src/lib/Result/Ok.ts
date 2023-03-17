import type { Awaitable } from '../common/utils.js';
import type { Option } from '../Option.js';
import { createNone, type OptionNone } from '../Option/None.js';
import { createSome, type OptionSome } from '../Option/Some.js';
import type { Result } from '../Result.js';
import type { ResultErr } from './Err.js';
import type { IResult } from './IResult.js';
import { ResultError } from './ResultError.js';

export class ResultOk<T> implements IResult<T, any> {
	private readonly value: T;

	public constructor(value: T) {
		this.value = value;
	}

	public isOk(): this is ResultOk<T> {
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

	public ok(): OptionSome<T> {
		return createSome(this.value);
	}

	public err(): OptionNone {
		return createNone;
	}

	public map<U>(cb: (value: T) => U): ResultOk<U> {
		return createOk(cb(this.value));
	}

	public mapInto<R extends Result<any, any>>(cb: (value: T) => R): R {
		return cb(this.value);
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

	public mapErrInto(cb: (error: never) => Result<any, any>): this;
	public mapErrInto(): this {
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

	public inspectErr(cb?: (error: never) => void): this;
	public inspectErr(): this {
		return this;
	}

	public inspectErrAsync(cb?: (error: never) => Awaitable<unknown>): Promise<this>;
	public inspectErrAsync(): Promise<this> {
		return Promise.resolve(this);
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

	public unwrapOr(defaultValue: unknown): T;
	public unwrapOr(): T {
		return this.value;
	}

	public unwrapOrElse(op: (error: any) => unknown): T;
	public unwrapOrElse(): T {
		return this.value;
	}

	public unwrapRaw(): T {
		return this.value;
	}

	public and<R extends Result<any, any>>(result: R): R {
		return result;
	}

	public andThen<R extends Result<any, any>>(cb: (value: T) => R): R {
		return cb(this.value);
	}

	public or(result: Result<T, any>): this;
	public or(): this {
		return this;
	}

	public orElse(cb: (error: never) => Result<T, any>): this;
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

	public transpose(this: ResultOk<OptionNone>): OptionNone;
	public transpose<Inner>(this: ResultOk<OptionSome<Inner>>): OptionSome<ResultOk<Inner>>;
	public transpose<Inner>(this: ResultOk<Option<Inner>>): Option<ResultOk<Inner>>;
	public transpose<IT>(this: ResultOk<Option<IT>>): Option<ResultOk<IT>> {
		return this.value.match({
			some: (value) => createSome(createOk(value)),
			none: () => createNone
		});
	}

	public flatten<Inner extends Result<any, any>>(this: ResultOk<Inner>): Inner {
		return this.value;
	}

	public intoOkOrErr() {
		return this.value;
	}

	public async intoPromise(): Promise<ResultOk<Awaited<T>>> {
		return createOk(await this.value);
	}

	public eq(other: ResultErr<any>): false;
	public eq(other: Result<T, any>): boolean;
	public eq(other: Result<T, any>): boolean {
		return other.isOkAnd((value) => this.value === value);
	}

	public ne(other: ResultErr<any>): true;
	public ne(other: Result<T, any>): boolean;
	public ne(other: Result<T, any>): boolean {
		return !this.eq(other);
	}

	public match<OkValue, ErrValue>(branches: { ok(value: T): OkValue; err(error: never): ErrValue }): OkValue {
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
export function createOk(): ResultOk<unknown>;

/**
 * Creates an Ok.
 * @typeparam T The result's type.
 * @param x Value to use.
 * @return A successful Result.
 */
export function createOk<T>(x: T): ResultOk<T>;
export function createOk<T>(x?: T): ResultOk<T | undefined> {
	return new ResultOk(x);
}
