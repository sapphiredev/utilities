import { sleep } from './sleep';
import type { Awaitable } from './types';

/**
 * Executes a function {@link cb} and validates the result with function {@link cbCondition},
 * and repeats this until {@link cbCondition} returns `true` or the {@link timeoutMilliseconds} is reached.
 *
 * For a synchronous variant, see [pollSync](./pollSync.d.ts).
 * @param cb The function that should be executed.
 * @param cbCondition A function that when given the result of `fn` should return `true` if the polling should stop and should return `false` if the polling should continue.
 * @param intervalMilliseconds The interval in between each poll.
 * @param timeoutMilliseconds The maximum amount of time to poll before timing out and throwing an error.
 * @param verbose Whether to log to the console on each polling interval, allowing the tracing of the amount of required attempts.
 * @returns The result of {@link cb} as soon as {@link cbCondition} returns `true`, or an error if {@link timeoutMilliseconds} is reached.
 * @throws If {@link timeoutMilliseconds} is reached.
 */
export async function poll<T>(
	cb: () => Awaitable<T>,
	cbCondition: (arg: Awaitable<T>) => boolean,
	intervalMilliseconds: number,
	timeoutMilliseconds: number,
	verbose?: boolean
): Promise<Awaitable<T>> {
	if (timeoutMilliseconds < 0) {
		throw new RangeError('Expected timeoutMilliseconds to be a number >= 0');
	}

	if (timeoutMilliseconds === 0) return cb();

	const startTime = Date.now();
	let result = await cb();

	while (!cbCondition(result)) {
		if (verbose) {
			console.log(`Waiting ${intervalMilliseconds} ms before polling again...`);
		}

		await sleep(intervalMilliseconds);

		result = await cb();

		const currentTime = Date.now();
		if (currentTime - startTime > timeoutMilliseconds) {
			throw new Error(`Polling task timed out after ${timeoutMilliseconds} milliseconds`);
		}
	}

	return result;
}
