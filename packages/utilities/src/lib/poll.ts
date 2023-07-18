import { sleep } from './sleep';
import type { Awaitable } from './types';

/** The options for the {@link poll} function */
export interface PollOptions {
	/**
	 * An optional AbortSignal to abort the polling.
	 */
	signal?: AbortSignal | undefined;

	/**
	 * The amount of attempts to try, if any.
	 * @default Infinite
	 */
	maximumRetries?: number | null | undefined;

	/**
	 * The amount of time to wait between each poll.
	 * @default 0
	 */
	waitBetweenRetries?: number | null | undefined;

	/**
	 * Whether to log to the console on each polling interval, allowing the tracing of the amount of required attempts.
	 * @default false
	 */
	verbose?: boolean | undefined;
}

/**
 * Executes a function {@link cb} and validates the result with function {@link cbCondition},
 * and repeats this until {@link cbCondition} returns `true` or the {@link timeout} is reached.
 *
 * For a synchronous variant, see [pollSync](./pollSync.d.ts).
 * @param cb The function that should be executed.
 * @param cbCondition A function that when given the result of `cb` should return `true` if the polling should stop and should return `false` if the polling should continue.
 * @param options Options to provide further modifying behaviour.
 * @returns The result of {@link cb} as soon as {@link cbCondition} returns `true`, or an error if {@link timeout} is reached.
 * @throws If {@link timeout} is reached.
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
	let result = await cb(signal);
	for (let retries = 0; retries < maximumRetries && !(await cbCondition(result, signal)); retries++) {
		signal?.throwIfAborted();

		if (waitBetweenRetries > 0) {
			if (options.verbose) console.log(`Waiting ${waitBetweenRetries}ms before polling again...`);
			await sleep(waitBetweenRetries, undefined, { signal });
		}

		result = await cb(signal);
	}

	return result;
}
