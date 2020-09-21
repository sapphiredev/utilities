// TypeScript port of Serenity's standard framework buckets.
// Licensed to the Serenity Contributors under one or more agreements.
// The Serenity Contributors licenses this file to you under the ISC license.
// https://github.com/serenity-rs/serenity/blob/current/src/framework/standard/structures/buckets.rs

export interface BucketEntry {
	lastTime: number;
	setTime: number;
	tickets: number;
}

export class Bucket<T> {
	public delay = 0;
	public limit: [timespan: number, limit: number] | null = null;
	public entries = new Map<T, BucketEntry>();

	public setDelay(delay: number): this {
		this.delay = delay;
		return this;
	}

	public setLimit(limit: [timespan: number, limit: number] | null): this {
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
		if (this.limit) {
			const [timespan, limit] = this.limit;
			// Then check whether tickets reach said limit:
			if (entry.tickets + 1 > limit) {
				// If the entry is new, setTime is initialized as 0, but also,
				// if the duration yields a negative number (expired limit),
				// then it must fall-back to setting tickets as 0, setTime as
				// now, and fall-back to the delay checking.
				if (entry.setTime !== 0) {
					const duration = now - entry.setTime + timespan;
					if (duration > 0) return duration;
				}

				entry.tickets = 0;
				entry.setTime = now;
			}
		}

		// If the entry is new, lastTime is initialized as 0, but also, if the
		// duration yields a negative number (expired delay), then it must
		// fall-back into increasing tickets by one and lastTime as now.
		if (entry.lastTime !== 0) {
			const duration = now - entry.lastTime + this.delay;
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
