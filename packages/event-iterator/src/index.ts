/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { EventEmitter } from 'events';

/**
 * A filter for an EventIterator.
 */
export type EventIteratorFilter<V> = (value: V) => boolean;

/**
 * Options to be passed to an EventIterator.
 */
export interface EventIteratorOptions<V> {
	/**
	 * The filter.
	 */
	filter?: EventIteratorFilter<V>;

	/**
	 * The timeout in ms before ending the EventIterator.
	 */
	idle?: number;

	/**
	 * The limit of events that pass the filter to iterate.
	 */
	limit?: number;
}

/**
 * An EventIterator, used for asynchronously iterating over received values.
 */
export class EventIterator<V extends unknown[]> implements AsyncIterableIterator<V> {
	/**
	 * The emitter to listen to.
	 */
	public readonly emitter: EventEmitter;

	/**
	 * The event the event iterator is listening for to receive values from.
	 */
	public readonly event: string;

	/**
	 * The filter used to filter out values.
	 */
	public filter: EventIteratorFilter<V>;

	/**
	 * Whether or not the EventIterator has ended.
	 */
	#ended = false;

	/**
	 * The amount of idle time in ms before moving on.
	 */
	#idle?: number;

	/**
	 * The queue of received values.
	 */
	#queue: V[] = [];

	/**
	 * The amount of events that have passed the filter.
	 */
	#passed = 0;

	/**
	 * The limit before ending the EventIterator.
	 */
	#limit: number;

	/**
	 * The timer to track when this will idle out.
	 */
	#idleTimer: NodeJS.Timer | null = null;

	/**
	 * The push handler with context bound to the instance.
	 */
	#push: (this: EventIterator<V>, ...value: V) => void;

	/**
	 * @param emitter The event emitter to listen to.
	 * @param event The event we're listening for to receives values from.
	 * @param limit The amount of values to receive before ending the iterator.
	 * @param options Any extra options.
	 */
	public constructor(emitter: EventEmitter, event: string, options: EventIteratorOptions<V> = {}) {
		this.emitter = emitter;
		this.event = event;
		this.#limit = options.limit ?? Infinity;
		this.#idle = options.idle;
		this.filter = options.filter ?? ((): boolean => true);

		// This timer is to idle out on lack of valid responses
		if (this.#idle) this.#idleTimer = setTimeout(this.end.bind(this), this.#idle);

		// @ts-expect-error Silence weird compiler issue regarding `this.push`'s arguments not being `any`.
		this.#push = this.push.bind(this);
		const maxListeners = this.emitter.getMaxListeners();
		if (maxListeners !== 0) this.emitter.setMaxListeners(maxListeners + 1);

		// @ts-expect-error Silence weird compiler issue regarding `this.push`'s arguments not being `any`.
		this.emitter.on(this.event, this.#push);
	}

	/**
	 * Whether or not the EventIterator has ended.
	 */
	public get ended(): boolean {
		return this.#ended;
	}

	/**
	 * Ends the EventIterator.
	 */
	public end(): void {
		if (this.#ended) return;
		this.#ended = true;
		this.#queue = [];

		// @ts-expect-error Silence weird compiler issue regarding `this.push`'s arguments not being `any`.
		this.emitter.off(this.event, this.#push);
		const maxListeners = this.emitter.getMaxListeners();
		if (maxListeners !== 0) this.emitter.setMaxListeners(maxListeners - 1);
	}

	/**
	 * The next value that's received from the EventEmitter.
	 */
	public async next(): Promise<IteratorResult<V>> {
		// If there are elements in the queue, return an undone response:
		if (this.#queue.length) {
			const value = this.#queue.shift()!;
			if (!this.filter(value)) return this.next();
			if (++this.#passed >= this.#limit) this.end();
			if (this.#idleTimer) this.#idleTimer.refresh();
			return { done: false, value };
		}

		// If the iterator ended, clean-up timer and return a done response:
		if (this.#ended) {
			if (this.#idleTimer) clearTimeout(this.#idleTimer);
			return { done: true, value: undefined as never };
		}

		// Listen for a new element from the emitter:
		return new Promise<IteratorResult<V>>((resolve) => {
			let idleTimer: NodeJS.Timer | null = null;

			// If there is an idle time set, we will create a temporary timer,
			// which will cause the iterator to end if no new elements are received:
			if (this.#idle) {
				idleTimer = setTimeout(() => {
					this.end();
					resolve(this.next());
				}, this.#idle);
			}

			// Once it has received at least one value, we will clear the timer (if defined),
			// and resolve with the new value:
			this.emitter.once(this.event, () => {
				if (idleTimer) clearTimeout(idleTimer);
				resolve(this.next());
			});
		});
	}

	/**
	 * Handles what happens when you break or return from a loop.
	 */
	public return(): Promise<IteratorResult<V>> {
		this.end();
		return Promise.resolve({ done: true, value: undefined as never });
	}

	/**
	 * Handles what happens when you encounter an error in a loop.
	 */
	public throw(): Promise<IteratorResult<V>> {
		this.end();
		return Promise.resolve({ done: true, value: undefined as never });
	}

	/**
	 * The symbol allowing EventIterators to be used in for-await-of loops.
	 */
	public [Symbol.asyncIterator](): AsyncIterableIterator<V> {
		return this;
	}

	/**
	 * Pushes a value into the queue.
	 */
	protected push(...value: V): void {
		this.#queue.push(value);
	}
}
