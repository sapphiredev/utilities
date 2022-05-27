import { isFunction, type Awaitable } from './common/utils';
import { Err, err as _err } from './Result/Err';
import { Ok, ok as _ok } from './Result/Ok';

export * from './Result/IResult';
export * from './Result/ResultError';

/**
 * The union of the two variations of `Result`.
 * @typeparam T The result's type.
 * @typeparam E The error's type.
 */
export type Result<T, E> = Result.Ok<T> | Result.Err<E>;

export namespace Result {
	export type Resolvable<T, E> = T | Result<T, E>;
	function resolve<T, E>(value: Resolvable<T, E>) {
		if (value instanceof Ok || value instanceof Err) return value;
		return ok(value);
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
}
