/**
 * Sleeps for the specified number of milliseconds.
 * @param ms The number of milliseconds to sleep.
 * @param value The value to resolve the promise with.
 * @see {@link sleepSync} for a synchronous version.
 */
export function sleep<T = undefined>(ms: number, value?: T): Promise<T> {
	return new Promise((resolve) => setTimeout(() => resolve(value!), ms));
}

/**
 * Sleeps for the specified number of milliseconds synchronously.
 * @param ms The number of milliseconds to sleep.
 * @param value The value to return.
 * @see {@link sleep} for an asynchronous version.
 */
export function sleepSync<T = undefined>(ms: number, value?: T): T {
	const start = Date.now();
	while (Date.now() - start < ms) continue;
	return value!;
}
