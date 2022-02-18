import type { RateLimitManager } from './RateLimitManager';

export class RateLimit<K = string> {
	/**
	 * The remaining amount of times this entry can be dripped before the bucket is empty.
	 */
	public remaining!: number;

	/**
	 * The timestamp that represents when this entry will reset back to a available state.
	 */
	public expires!: number;

	/**
	 * The {@link RateLimitManager} this entry is for.
	 */
	private manager: RateLimitManager<K>;

	/**
	 * @param manager The manager for this entry.
	 */
	public constructor(manager: RateLimitManager<K>) {
		this.manager = manager;
		this.reset();
	}

	/**
	 * Whether this entry is expired or not, allowing the bucket to be reset.
	 */
	public get expired(): boolean {
		return this.remainingTime === 0;
	}

	/**
	 * Whether this entry is limited or not.
	 */
	public get limited(): boolean {
		return this.remaining === 0 && !this.expired;
	}

	/**
	 * The remaining time in milliseconds before resetting.
	 */
	public get remainingTime(): number {
		return Math.max(this.expires - Date.now(), 0);
	}

	/**
	 * Consumes {@link RateLimit.remaining} by one if it's not limited, calling {@link RateLimit.reset} first if {@link RateLimit.expired} is true.
	 */
	public consume(): this {
		if (this.limited) throw new Error('Cannot consume a limited bucket');
		if (this.expired) this.reset();

		this.remaining--;
		return this;
	}

	/**
	 * Resets the entry back to it's full state.
	 */
	public reset(): this {
		return this.resetRemaining().resetTime();
	}

	/**
	 * Resets the entry's {@link RateLimit.remaining} uses back to full state.
	 */
	public resetRemaining(): this {
		this.remaining = this.manager.limit;
		return this;
	}

	/**
	 * Resets the entry's {@link RateLimit.expires} to the current time plus {@link RateLimitManager.time}.
	 */
	public resetTime(): this {
		this.expires = Date.now() + this.manager.time;
		return this;
	}
}
