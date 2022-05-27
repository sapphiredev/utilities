import { isFunction, type Awaitable } from './common/utils';
import { err as _err } from './Result/Err';
import { ok as _ok } from './Result/Ok';

export * from './Result/IResult';
export * from './Result/ResultError';

/**
 * The union of the two variations of `Result`.
 * @typeparam T The result's type.
 * @typeparam E The error's type.
 */
export type Result<T, E> = Result.Ok<T> | Result.Err<E>;

export namespace Result {
	/**
	 * Creates a {@link Result} out of a callback.
	 * @typeparam T The result's type.
	 * @typeparam E The error's type.
	 */
	export function from<T, E = unknown>(cb: () => T): Result<T, E> {
		try {
			return ok(cb());
		} catch (error) {
			return err(error as E);
		}
	}

	/**
	 * Creates a {@link Result} out of a promise or async callback.
	 * @typeparam T The result's type.
	 * @typeparam E The error's type.
	 */
	export async function fromAsync<T, E = unknown>(promiseOrCb: Awaitable<T> | (() => Awaitable<T>)): Promise<Result<T, E>> {
		try {
			return ok(await (isFunction(promiseOrCb) ? promiseOrCb() : promiseOrCb));
		} catch (error) {
			return err(error as E);
		}
	}

	export const err = _err;
	export const ok = _ok;

	export type Err<E> = import('./Result/Err').Err<E>;
	export type Ok<T> = import('./Result/Ok').Ok<T>;
}
