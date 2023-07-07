export interface SleepOptions {
	/**
	 * When provided the corresponding `AbortController` can be used to cancel an asynchronous action.
	 */
	signal?: AbortSignal | undefined;

	/**
	 * Set to `false` to indicate that the scheduled `Timeout`
	 * should not require the Node.js event loop to remain active.
	 * @default true
	 */
	ref?: boolean | undefined;
}

export class AbortError extends Error {
	public readonly code: string;
	public constructor(
		message?: string,
		options?: {
			cause?: unknown;
		}
	) {
		super(message, options);
		this.name = 'AbortError';
		this.code = 'ERR_ABORT';
	}
}

/**
 * Sleeps for the specified number of milliseconds.
 * For a synchronous variant, see [sleepSync](./sleepSync.d.ts).
 * @param ms The number of milliseconds to sleep.
 * @param value A value with which the promise is fulfilled.
 * @see {@link sleepSync} for a synchronous version.
 */
export function sleep<T = undefined>(ms: number, value?: T, options?: SleepOptions): Promise<T> {
	return new Promise((resolve, reject) => {
		const timer: NodeJS.Timeout | number = setTimeout(() => resolve(value!), ms);
		const signal = options?.signal;
		if (signal) {
			signal.addEventListener('abort', () => {
				clearTimeout(timer);
				reject(
					new AbortError('The operation was aborted', {
						cause: signal.reason
					})
				);
			});
		}
		if (options?.ref === false && typeof timer === 'object') {
			timer.unref();
		}
	});
}
