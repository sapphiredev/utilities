import { sleep } from './sleep';
import type { Awaitable } from './types';

/**
 * The options for the {@link poll} function
 */
export interface PollOptions {
	/**
	 * The amount of attempts to try, if any.
	 *
	 * @defaultValue Infinite
	 */
	maximumRetries?: number | null | undefined;

	/**
	 * An optional AbortSignal to abort the polling.
	 */
	signal?: AbortSignal | undefined;

	/**
	 * Whether to log to the console on each polling interval, allowing the tracing of the amount of required attempts.
	 *
	 * @defaultValue false
	 */
	verbose?: boolean | undefined;

	/**
	 * The amount of time to wait between each poll.
	 *
	 * @defaultValue 0
	 */
	waitBetweenRetries?: number | null | undefined;
}

/**
 * Executes a function {@link cb} and validates the result with function {@link cbCondition},
 * and repeats this until {@link cbCondition} returns `true` or the `timeout` is reached.
 *
 * For a synchronous variant, see [pollSync](./pollSync.d.ts).
 *
 * @param cb The function that should be executed.
 * @param cbCondition A function that when given the result of `cb` should return `true` if the polling should stop and should return `false` if the polling should continue.
 * @param options Options to provide further modifying behaviour.
 * @returns The result of {@link cb} as soon as {@link cbCondition} returns `true`, or an error if `timeout` is reached.
 * @throws If `timeout` is reached.
 */
export async function poll<T>(
	cb: (signal: AbortSignal | undefined) => Awaitable<T>,
	cbCondition: (value: Awaited<T>, signal: AbortSignal | undefined) => Awaitable<boolean>,
	options: PollOptions = {}
): Promise<Awaitable<T>> {
	const signal = options.signal ?? undefined;

	const maximumRetries = options.maximumRetries ?? Infinity;
	if (typeof maximumRetries !== 'number') throw new TypeError('Expected maximumRetries to be a number');
	if (!(maximumRetries >= 0)) throw new RangeError('Expected maximumRetries to be a non-negative number');

	const waitBetweenRetries = options.waitBetweenRetries ?? 0;
	if (typeof waitBetweenRetries !== 'number') throw new TypeError('Expected waitBetweenRetries to be a number');
	if (!Number.isSafeInteger(waitBetweenRetries) || waitBetweenRetries < 0) {
		throw new RangeError('Expected waitBetweenRetries to be a positive safe integer');
	}

	signal?.throwIfAborted();
	// eslint-disable-next-line promise/prefer-await-to-callbacks, n/callback-return
	let result = await cb(signal);
	for (let retries = 0; retries < maximumRetries && !(await cbCondition(result, signal)); retries++) {
		signal?.throwIfAborted();

		if (waitBetweenRetries > 0) {
			if (options.verbose) console.log(`Waiting ${waitBetweenRetries}ms before polling again...`);
			await sleep(waitBetweenRetries, undefined, { signal });
		}

		// eslint-disable-next-line promise/prefer-await-to-callbacks, n/callback-return
		result = await cb(signal);
	}

	return result;
}
