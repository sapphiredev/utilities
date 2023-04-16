import { isFunction, type Awaitable } from './common/utils.js';
import { createErr, ResultErr } from './Result/Err.js';
import { createOk, ResultOk } from './Result/Ok.js';

export type * from './Result/IResult.js';
export * from './Result/ResultError.js';
export { createOk as ok, createErr as err, type ResultOk as Ok, type ResultErr as Err };

/**
 * The union of the two variations of `Result`.
 * @typeparam T The result's type.
 * @typeparam E The error's type.
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
		return value instanceof ResultOk || value instanceof ResultErr;
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

	/**
	 * Creates an {@link Ok} that is the combination of all collected {@link Ok} values as an array, or the first
	 * {@link Err} encountered.
	 * @param results An array of {@link Result}s.
	 * @returns A new {@link Result}.
	 */
	export function all<T extends readonly Result<any, any>[]>(results: [...T]): Result<UnwrapOkArray<T>, UnwrapErrArray<T>[number]> {
		const values: unknown[] = [];
		for (const result of results) {
			if (result.isErr()) {
				return result;
			}

			values.push(result.unwrap());
		}

		return ok(values as UnwrapOkArray<T>);
	}

	/**
	 * Returns the first encountered {@link Ok}, or an {@link Err} that is the combination of all collected error values.
	 * @param results An array of {@link Result}s.
	 * @returns A new {@link Result}.
	 */
	export function any<T extends readonly Result<any, any>[]>(results: [...T]): Result<UnwrapOkArray<T>[number], UnwrapErrArray<T>> {
		const errors: unknown[] = [];
		for (const result of results) {
			if (result.isOk()) {
				return result;
			}

			errors.push(result.unwrapErr());
		}

		return err(errors as UnwrapErrArray<T>);
	}

	export const err = createErr;
	export const ok = createOk;

	export type Err<E> = ResultErr<E>;
	export type Ok<T> = ResultOk<T>;

	export type UnwrapOk<T extends Result<any, any>> = T extends Ok<infer S> ? S : never;
	export type UnwrapErr<T extends Result<any, any>> = T extends Err<infer S> ? S : never;

	export type UnwrapOkArray<T extends readonly Result<any, any>[] | []> = {
		-readonly [P in keyof T]: UnwrapOk<T[P]>;
	};
	export type UnwrapErrArray<T extends readonly Result<any, any>[] | []> = {
		-readonly [P in keyof T]: UnwrapErr<T[P]>;
	};
}
