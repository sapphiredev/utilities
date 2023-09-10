import { RateLimit } from './RateLimit';

export class RateLimitManager<K = string> extends Map<K, RateLimit<K>> {
	/**
	 * The amount of milliseconds for the {@link RateLimit ratelimits} from this manager to expire.
	 */
	public readonly time: number;

	/**
	 * The amount of times a {@link RateLimit} can drip before it's limited.
	 */
	public readonly limit: number;

	/**
	 * The interval to sweep expired {@link RateLimit ratelimits}.
	 */
	private sweepInterval!: NodeJS.Timeout | undefined | null;

	/**
	 * @param time The amount of milliseconds for the ratelimits from this manager to expire.
	 * @param limit The amount of times a {@link RateLimit} can drip before it's limited.
	 */
	public constructor(time: number, limit = 1) {
		super();

		this.time = time;
		this.limit = limit;
	}

	/**
	 * Gets a {@link RateLimit} from this manager or creates it if it does not exist.
	 * @param id The id for the {@link RateLimit}
	 */
	public acquire(id: K): RateLimit<K> {
		return this.get(id) ?? this.create(id);
	}

	/**
	 * Creates a {@link RateLimit} for this manager.
	 * @param id The id the {@link RateLimit} belongs to
	 */
	public create(id: K): RateLimit<K> {
		const value = new RateLimit(this);
		this.set(id, value);
		return value;
	}

	/**
	 * Wraps Collection's set method to set interval to sweep inactive {@link RateLimit}s.
	 * @param id The id the {@link RateLimit} belongs to
	 * @param value The {@link RateLimit} to set
	 */
	public override set(id: K, value: RateLimit<K>): this {
		this.sweepInterval ??= setInterval(this.sweep.bind(this), RateLimitManager.sweepIntervalDuration);
		return super.set(id, value);
	}

	/**
	 * Wraps Collection's sweep method to clear the interval when this manager is empty.
	 */
	public sweep(): void {
		for (const [id, value] of this.entries()) {
			if (value.expired) this.delete(id);
		}

		if (this.size === 0 && this.sweepInterval !== undefined && this.sweepInterval !== null) {
			clearInterval(this.sweepInterval);
			this.sweepInterval = null;
		}
	}

	/**
	 * The delay in milliseconds for {@link RateLimitManager.sweepInterval}.
	 */
	public static sweepIntervalDuration = 30_000;
}
