/**
 * Sleeps for the specified number of milliseconds synchronously.
 * We should probably note that unlike {@link sleep} (which uses CPU tick times),
 * sleepSync uses wall clock times, so the precision is near-absolute by comparison.
 * That, and that synchronous means that nothing else in the thread will run for the length of the timer.
 *
 * For an asynchronous variant, see [sleep](./sleep.d.ts).
 * @param ms The number of milliseconds to sleep.
 * @param value A value to return.
 * @see {@link sleep} for an asynchronous version.
 */
export function sleepSync<T = undefined>(ms: number, value?: T): T {
	const end = Date.now() + ms;
	while (Date.now() < end) continue;
	return value!;
}
