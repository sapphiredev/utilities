export interface Abortable {
	/**
	 * When provided the corresponding `AbortController` can be used to cancel an asynchronous action.
	 */
	signal?: AbortSignal | undefined;
}

export interface TimerOptions extends Abortable {
	/**
	 * Set to `false` to indicate that the scheduled `Timeout`
	 * should not require the Node.js event loop to remain active.
	 * @default true
	 */
	ref?: boolean | undefined;
}

export class AbortError extends Error {
	public code: string;
	public constructor(
		message?: string,
		options?: {
			cause?: unknown;
			code?: string;
		}
	) {
		super(message, options);
		this.name = 'AbortError';
		this.code = options?.code ?? 'ERR_ABORT';
	}
}

/**
 * Sleeps for the specified number of milliseconds.
 * @param ms The number of milliseconds to sleep.
 * @param value A value with which the promise is fulfilled.
 * @see {@link sleepSync} for a synchronous version.
 */
export function sleep<T = undefined>(ms: number, value?: T, options?: TimerOptions): Promise<T> {
	return new Promise((resolve, reject) => {
		const timer: NodeJS.Timeout | number = setTimeout(() => resolve(value!), ms);
		if (options?.signal) {
			options.signal.addEventListener('abort', () => {
				clearTimeout(timer);
				reject(
					new AbortError('The operation was aborted', {
						cause: new DOMException('The operation was aborted', 'AbortError')
					})
				);
			});
		}
		if (options?.ref === false && typeof timer === 'object') {
			timer.unref();
		}
	});
}

/**
 * Sleeps for the specified number of milliseconds synchronously.
 * @param ms The number of milliseconds to sleep.
 * @param value A value to return.
 * @see {@link sleep} for an asynchronous version.
 */
export function sleepSync<T = undefined>(ms: number, value?: T): T {
	const start = Date.now();
	while (Date.now() - start <= ms) continue;
	return value!;
}
