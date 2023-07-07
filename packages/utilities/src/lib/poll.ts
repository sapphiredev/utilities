import { sleep } from './sleep';
import type { Awaitable } from './types';

/** The options for the {@link poll} function */
export interface PollOptions {
	/**
	 * Whether to log to the console on each polling interval, allowing the tracing of the amount of required attempts.
	 */
	verbose?: boolean;
}

/**
 * Executes a function {@link cb} and validates the result with function {@link cbCondition},
 * and repeats this until {@link cbCondition} returns `true` or the {@link timeout} is reached.
 *
 * For a synchronous variant, see [pollSync](./pollSync.d.ts).
 * @param cb The function that should be executed.
 * @param cbCondition A function that when given the result of `fn` should return `true` if the polling should stop and should return `false` if the polling should continue.
 * @param interval The interval in between each poll.
 * @param timeout The maximum amount of time to poll before timing out and throwing an error.
 * @param options Options to provide further modifying behaviour.
 * @returns The result of {@link cb} as soon as {@link cbCondition} returns `true`, or an error if {@link timeout} is reached.
 * @throws If {@link timeout} is reached.
 */
export async function poll<T>(
	cb: () => Awaitable<T>,
	cbCondition: (arg: Awaited<T>) => boolean,
	interval: number,
	timeout: number,
	options: PollOptions = {}
): Promise<Awaitable<T>> {
	if (timeout < 0) {
		throw new RangeError('Expected timeoutMilliseconds to be a number >= 0');
	}

	if (timeout === 0) return cb();

	const startTime = Date.now();
	let result = await cb();

	while (!cbCondition(result)) {
		if (options.verbose) {
			console.log(`Waiting ${interval} ms before polling again...`);
		}

		await sleep(interval);

		result = await cb();

		const currentTime = Date.now();
		if (currentTime - startTime > timeout) {
			throw new Error(`Polling task timed out after ${timeout} milliseconds`);
		}
	}

	return result;
}
