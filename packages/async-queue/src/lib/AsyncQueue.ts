/**
 * The AsyncQueue class used to sequentialize burst requests
 */
export class AsyncQueue {
	/**
	 * The remaining amount of queued promises
	 */
	public get remaining(): number {
		return this.promises.length;
	}

	/**
	 * The promises array
	 */
	private promises: InternalAsyncQueueDeferredPromise[] = [];

	/**
	 * Waits for last promise and queues a new one
	 * @example
	 * ```
	 * const queue = new AsyncQueue();
	 * async function request(url, options) {
	 *     await queue.wait();
	 *     try {
	 *         const result = await fetch(url, options);
	 *         // Do some operations with 'result'
	 *     } finally {
	 *         // Remove first entry from the queue and resolve for the next entry
	 *         queue.shift();
	 *     }
	 * }
	 *
	 * request(someUrl1, someOptions1); // Will call fetch() immediately
	 * request(someUrl2, someOptions2); // Will call fetch() after the first finished
	 * request(someUrl3, someOptions3); // Will call fetch() after the second finished
	 * ```
	 */
	public wait(): Promise<void> {
		const next = this.promises.length ? this.promises[this.promises.length - 1].promise : Promise.resolve();
		let resolve: () => void;
		const promise = new Promise<void>((res) => {
			resolve = res;
		});

		this.promises.push({
			resolve: resolve!,
			promise
		});

		return next;
	}

	/**
	 * Frees the queue's lock for the next item to process
	 */
	public shift(): void {
		const deferred = this.promises.shift();
		if (typeof deferred !== 'undefined') deferred.resolve();
	}
}

/**
 * @internal
 */
interface InternalAsyncQueueDeferredPromise {
	resolve(): void;
	promise: Promise<void>;
}
