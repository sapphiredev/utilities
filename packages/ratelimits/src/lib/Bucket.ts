// TypeScript port of Serenity's standard framework buckets.
// Licensed to the Serenity Contributors under one or more agreements.
// The Serenity Contributors licenses this file to you under the ISC license.
// https://github.com/serenity-rs/serenity/blob/current/src/framework/standard/structures/buckets.rs

/**
 * An entry in the bucket.
 */
export interface BucketEntry {
	lastTime: number;
	setTime: number;
	tickets: number;
}

/**
 * The bucket limits.
 */
export interface BucketLimit {
	/**
	 * The time between tickets.
	 *
	 * If timespan is zero, there will be no spacing between usages, this means
	 * that a 5/5s bucket ({@link BucketLimit#limit limit} of 5 in 5 seconds
	 * {@link Bucket#delay delay}) will accept 5 requests, then will wait for
	 * the remaining time.
	 *
	 * However, if in the previous example, this is set to 1 second, this will
	 * then space the requests evenly to 1 request per second until the bucket
	 * is consumed.
	 */
	timespan: number;

	/**
	 * The maximum amount of tickets.
	 *
	 * This limits the amount of requests that can be made within the
	 * {@link Bucket}'s {@link Bucket#delay delay}.
	 */
	maximum: number;
}

/**
 * The Bucket that handles ratelimits.
 */
export class Bucket<T> {
	/**
	 * The amount of milliseconds entries last.
	 */
	public delay = 0;

	/**
	 * The bucket limits. If set to null, the requests will be limited to one
	 * request per {@link delay} milliseconds.
	 */
	public limit: Required<BucketLimit> = { timespan: 0, maximum: 1 };

	/**
	 * The bucket entries for the instance.
	 */
	private entries = new Map<T, BucketEntry>();

	/**
	 * Sets the delay for the bucket.
	 * @param delay The delay to be set.
	 */
	public setDelay(delay: number): this {
		this.delay = delay;
		return this;
	}

	/**
	 * Sets the limit for the bucket.
	 * @param limit The limit to be set.
	 */
	public setLimit(limit: BucketLimit): this {
		this.limit = limit;
		return this;
	}

	/**
	 * Retrieves the amount of time needed for the bucket to unlock.
	 * @param id The ID of the entry to check.
	 * @returns Always a positive number, 0 if there is no delay.
	 */
	public take(id: T): number {
		const now = Date.now();
		const entry = this.getEntry(id);

		// If there is a limit:
		if (this.limit.maximum > 1) {
			// Then check whether tickets reach said limit:
			if (entry.tickets + 1 > this.limit.maximum) {
				// If the entry is new, setTime is initialized as 0, but also,
				// if the duration yields a negative number (expired limit),
				// then it must fall-back to setting tickets as 0, setTime as
				// now, and fall-back to the delay checking.
				if (entry.setTime !== 0) {
					const duration = entry.setTime + this.limit.timespan - now;
					if (duration > 0) return duration;
				}

				entry.tickets = 0;
			}

			entry.setTime = now;
		}

		// If the entry is new, lastTime is initialized as 0, but also, if the
		// duration yields a negative number (expired delay), then it must
		// fall-back into increasing tickets by one and lastTime as now.
		if (this.delay !== 0 && entry.lastTime !== 0) {
			const duration = entry.lastTime + this.delay - now;
			if (duration > 0) return duration;
		}

		++entry.tickets;
		entry.lastTime = now;

		// The entry wasn't either limited nor has an applicable delay, return 0.
		return 0;
	}

	private getEntry(id: T): BucketEntry {
		const entry = this.entries.get(id);
		if (entry) return entry;

		const data: BucketEntry = { lastTime: 0, setTime: 0, tickets: 0 };
		this.entries.set(id, data);
		return data;
	}
}
