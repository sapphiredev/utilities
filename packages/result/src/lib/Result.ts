import { isFunction, type Awaitable } from './common/utils';
import { Err, err as _err } from './Result/Err';
import { Ok, ok as _ok } from './Result/Ok';

export * from './Result/ResultError';

/**
 * A type used to express computations that can fail, it can be used for returning and propagating errors. This is a
 * type union with the variants `Ok(T)`, representing success and containing a value, and `Err(E)`, representing error
 * and containing an error value.
 *
 * @typeparam T The result's type.
 * @typeparam E The error's type.
 *
 * @see {@link https://doc.rust-lang.org/std/result/index.html}
 */
export type Result<T, E> = Result.Ok<T> | Result.Err<E>;

export namespace Result {
	export type Resolvable<T, E> = T | Result<T, E>;
	function resolve<T, E>(value: Resolvable<T, E>) {
		if (is(value)) return value;
		return ok(value);
	}

	export function is<T, E>(value: Result<T, E>): true;
	export function is(value: any): value is Result<unknown, unknown>;
	export function is(value: any) {
		return value instanceof Ok || value instanceof Err;
	}

	/**
	 * Creates a {@link Result} out of a callback.
	 * @typeparam T The result's type.
	 * @typeparam E The error's type.
	 */
	export function from<T, E = unknown>(op: Resolvable<T, E> | (() => Resolvable<T, E>)): Result<T, E> {
		if (!isFunction(op)) return resolve(op);

		try {
			return resolve(op());
		} catch (error) {
			return err(error as E);
		}
	}

	/**
	 * Creates a {@link Result} out of a promise or async callback.
	 * @typeparam T The result's type.
	 * @typeparam E The error's type.
	 */
	export async function fromAsync<T, E = unknown>(op: Awaitable<Resolvable<T, E>> | (() => Awaitable<Resolvable<T, E>>)): Promise<Result<T, E>> {
		try {
			return resolve(await (isFunction(op) ? op() : op));
		} catch (error) {
			return err(error as E);
		}
	}

	export const err = _err;
	export const ok = _ok;

	export type Err<E> = import('./Result/Err').Err<E>;
	export type Ok<T> = import('./Result/Ok').Ok<T>;

	export type UnwrapOk<T> = T extends Result<infer S, unknown> ? S : never;
	export type UnwrapErr<T> = T extends Result<unknown, infer S> ? S : never;
}
