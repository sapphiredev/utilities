import type { Awaitable } from './types';

/**
 * This code is used to retry a function call a specified number of times.
 * The function will retry the call to the callback function until it either succeeds or it runs out of retries.
 * @param  cb The function to be retried is passed in as a callback function.
 * @param  retries The number of retries is also passed in as a parameter.
 * @returns The result of the callback function is returned.
 */
export async function retry<T>(cb: () => Awaitable<T>, retries: number): Promise<T> {
	if (retries < 1) throw new RangeError('Expected retries to be a number >= 1');

	let lastError: unknown;
	for (let i = 0; i < retries; ++i) {
		try {
			return await cb();
		} catch (error) {
			lastError = error;
		}
	}

	throw lastError;
}
