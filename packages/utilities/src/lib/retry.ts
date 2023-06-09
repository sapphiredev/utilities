import type { Awaitable } from './types';

/**
 * Asynchronously calls the callback function until it either succeeds or it runs out of retries.
 * For a synchronous variant, see [retrySync](./retrySync.d.ts).
 * @param cb The function to be retried is passed in as a callback function.
 * @param retries The number of retries is also passed in as a parameter. Minimum of 0.
 * @returns The result of the callback function is returned.
 */
export async function retry<T>(cb: () => Awaitable<T>, retries: number): Promise<T> {
	if (retries < 0) throw new RangeError('Expected retries to be a number >= 0');
	if (retries === 0) return cb();

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
