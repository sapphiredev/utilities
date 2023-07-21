import type { PollOptions } from './poll';
import { sleepSync } from './sleepSync';

/** The options for the {@link pollSync} function */
export interface SyncPollOptions extends Omit<PollOptions, 'signal'> {
	/**
	 * The amount of milliseconds before throwing an AbortError.
	 * @default Infinite
	 */
	timeout?: number | null | undefined;
}

const DOMException: typeof globalThis.DOMException =
	globalThis.DOMException ??
	// DOMException was only made a global in Node v17.0.0, but this library supports Node v16.0.0 and up
	AbortSignal.abort().reason.constructor;

/**
 * Executes a function {@link cb} and validates the result with function {@link cbCondition},
 * and repeats this until {@link cbCondition} returns `true` or the {@link timeout} is reached.
 *
 * For an asynchronous variant, see [poll](./poll.d.ts).
 * @param cb The function that should be executed.
 * @param cbCondition A function that when given the result of `fn` should return `true` if the polling should stop and should return `false` if the polling should continue.
 * @param options Options to provide further modifying behaviour.
 * @returns The result of {@link cb} as soon as {@link cbCondition} returns `true`, or an error if {@link timeout} is reached.
 * @throws If {@link timeout} is reached.
 */
export function pollSync<T>(cb: () => T, cbCondition: (value: T) => boolean, options: SyncPollOptions = {}): T {
	const timeout = options.timeout ?? Infinity;
	if (typeof timeout !== 'number') throw new TypeError('Expected timeout to be a number');
	if (!(timeout >= 0)) throw new RangeError('Expected timeout to be a non-negative number');

	const maximumRetries = options.maximumRetries ?? Infinity;
	if (typeof maximumRetries !== 'number') throw new TypeError('Expected maximumRetries to be a number');
	if (!(maximumRetries >= 0)) throw new RangeError('Expected maximumRetries to be a non-negative number');

	const waitBetweenRetries = options.waitBetweenRetries ?? 0;
	if (typeof waitBetweenRetries !== 'number') throw new TypeError('Expected waitBetweenRetries to be a number');
	if (!Number.isSafeInteger(waitBetweenRetries) || waitBetweenRetries < 0) {
		throw new RangeError('Expected waitBetweenRetries to be a positive safe integer');
	}

	const end = Date.now() + timeout;
	let result = cb();
	for (let retries = 0; retries < maximumRetries && !cbCondition(result); retries++) {
		if (Date.now() + waitBetweenRetries > end) throw new DOMException('This operation was aborted', 'AbortError');
		if (waitBetweenRetries > 0) {
			if (options.verbose) console.log(`Waiting ${waitBetweenRetries}ms before polling again...`);
			sleepSync(waitBetweenRetries);
		}

		result = cb();
	}

	return result;
}
