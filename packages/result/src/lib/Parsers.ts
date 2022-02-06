import { err, ok, Result } from './Result';

/**
 * Creates a {@link Result} out of a callback.
 * @typeparam T The result's type.
 * @typeparam E The error's type.
 */
export function from<T, E = unknown>(cb: (...args: unknown[]) => T): Result<T, E> {
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
export async function fromAsync<T, E = unknown>(promiseOrCb: Awaitable<T> | ((...args: unknown[]) => Awaitable<T>)): Promise<Result<T, E>> {
	try {
		return ok(await (isFunction(promiseOrCb) ? promiseOrCb() : promiseOrCb));
	} catch (error) {
		return err(error as E);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
function isFunction(input: unknown): input is Function {
	return typeof input === 'function';
}

type Awaitable<T> = PromiseLike<T> | T;
