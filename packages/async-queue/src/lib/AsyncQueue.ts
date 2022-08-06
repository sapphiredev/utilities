import { AsyncQueueEntry } from './AsyncQueueEntry';

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
	private promises: AsyncQueueEntry[] = [];

	/**
	 * Waits for last promise and queues a new one
	 * @example
	 * ```typescript
	 * const queue = new AsyncQueue();
	 * async function request(url, options) {
	 *     await queue.wait();
	 *     try {
	 *         const result = await fetch(url, options);
	 *         // Do some operations with 'result'
	 *     } finally {
	 *         // Remove first entry from the queue and resolve for the next entry
	 *         queue.unlock();
	 *     }
	 * }
	 *
	 * request(someUrl1, someOptions1); // Will call fetch() immediately
	 * request(someUrl2, someOptions2); // Will call fetch() after the first finished
	 * request(someUrl3, someOptions3); // Will call fetch() after the second finished
	 * ```
	 */
	public wait(options?: Readonly<AsyncQueueWaitOptions>): Promise<void> {
		const entry = new AsyncQueueEntry(this);

		if (this.promises.length === 0) {
			this.promises.push(entry);
			return Promise.resolve();
		}

		this.promises.push(entry);
		if (options?.signal) entry.setSignal(options.signal);
		return entry.promise;
	}

	/**
	 * Unlocks the head lock and transfers the next lock (if any) to the head.
	 * @returns Whether or not there was an element pending to process.
	 */
	public shift(): void {
		if (this.promises.length === 0) return;
		if (this.promises.length === 1) {
			// Remove the head entry.
			this.promises.shift();
			return;
		}

		// Remove the head entry, making the 2nd entry the new one.
		// Then use the head entry, which will unlock the promise.
		this.promises.shift();
		this.promises[0].use();
	}
}

export interface AsyncQueueWaitOptions {
	signal?: AbortSignal;
}
