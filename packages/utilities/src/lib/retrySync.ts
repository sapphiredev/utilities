/**
 * Synchronously calls the callback function until it either succeeds or it runs out of retries.
 * For an asynchronous variant, see [retry](./retry.d.ts).
 * @param cb The function to be retried is passed in as a callback function.
 * @param retries The number of retries is also passed in as a parameter. Minimum of 0.
 * @returns The result of the callback function is returned.
 */
export function retrySync<T>(cb: () => T, retries: number): T {
	if (retries < 0) throw new RangeError('Expected retries to be a number >= 0');
	if (retries === 0) return cb();

	let lastError: unknown;
	for (let i = 0; i < retries; ++i) {
		try {
			return cb();
		} catch (error) {
			lastError = error;
		}
	}

	throw lastError;
}
