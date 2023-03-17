const ProcessId = 1n;
const WorkerId = 0n;

/**
 * A class for generating and deconstructing Twitter snowflakes.
 *
 * A {@link https://developer.twitter.com/en/docs/twitter-ids Twitter snowflake}
 * is a 64-bit unsigned integer with 4 fields that have a fixed epoch value.
 *
 * If we have a snowflake `266241948824764416` we can represent it as binary:
 * ```
 * 64                                          22     17     12          0
 *  000000111011000111100001101001000101000000  00001  00000  000000000000
 *           number of ms since epoch           worker  pid    increment
 * ```
 */
export class Snowflake {
	/**
	 * Alias for {@link deconstruct}
	 */
	// eslint-disable-next-line @typescript-eslint/unbound-method
	public decode = this.deconstruct;

	/**
	 * Internal incrementor for generating snowflakes
	 * @internal
	 */
	#increment = 0n;

	/**
	 * Internal reference of the epoch passed in the constructor
	 * @internal
	 */
	#epoch: bigint;

	/**
	 * @param epoch the epoch to use
	 */
	public constructor(epoch: number | bigint | Date) {
		this.#epoch = BigInt(epoch instanceof Date ? epoch.getTime() : epoch);
	}

	/**
	 * The epoch for this snowflake.
	 */
	public get epoch(): bigint {
		return this.#epoch;
	}

	/**
	 * Generates a snowflake given an epoch and optionally a timestamp
	 * @param options options to pass into the generator, see {@link SnowflakeGenerateOptions}
	 *
	 * **note** when `increment` is not provided it defaults to the private `increment` of the instance
	 * @example
	 * ```typescript
	 * const epoch = new Date('2000-01-01T00:00:00.000Z');
	 * const snowflake = new Snowflake(epoch).generate();
	 * ```
	 * @returns A unique snowflake
	 */
	public generate({ increment, timestamp = Date.now(), workerId = WorkerId, processId = ProcessId }: SnowflakeGenerateOptions = {}) {
		if (timestamp instanceof Date) timestamp = BigInt(timestamp.getTime());
		else if (typeof timestamp === 'number') timestamp = BigInt(timestamp);
		else if (typeof timestamp !== 'bigint') {
			throw new TypeError(`"timestamp" argument must be a number, bigint, or Date (received ${typeof timestamp})`);
		}

		if (typeof increment === 'bigint' && increment >= 4095n) increment = 0n;
		else {
			increment = this.#increment++;
			if (this.#increment >= 4095n) this.#increment = 0n;
		}

		// timestamp, workerId, processId, increment
		return ((timestamp - this.#epoch) << 22n) | ((workerId & 0b11111n) << 17n) | ((processId & 0b11111n) << 12n) | increment;
	}

	/**
	 * Deconstructs a snowflake given a snowflake ID
	 * @param id the snowflake to deconstruct
	 * @returns a deconstructed snowflake
	 * @example
	 * ```typescript
	 * const epoch = new Date('2000-01-01T00:00:00.000Z');
	 * const snowflake = new Snowflake(epoch).deconstruct('3971046231244935168');
	 * ```
	 */
	public deconstruct(id: string | bigint): DeconstructedSnowflake {
		const bigIntId = BigInt(id);
		return {
			id: bigIntId,
			timestamp: (bigIntId >> 22n) + this.#epoch,
			workerId: (bigIntId >> 17n) & 0b11111n,
			processId: (bigIntId >> 12n) & 0b11111n,
			increment: bigIntId & 0b111111111111n,
			epoch: this.#epoch
		};
	}

	/**
	 * Retrieves the timestamp field's value from a snowflake.
	 * @param id The snowflake to get the timestamp value from.
	 * @returns The UNIX timestamp that is stored in `id`.
	 */
	public timestampFrom(id: string | bigint): number {
		return Number((BigInt(id) >> 22n) + this.#epoch);
	}

	/**
	 * Returns a number indicating whether a reference snowflake comes before, or after, or is same as the given
	 * snowflake in sort order.
	 * @param a The first snowflake to compare.
	 * @param b The second snowflake to compare.
	 * @returns `-1` if `a` is older than `b`, `0` if `a` and `b` are equals, `1` if `a` is newer than `b`.
	 * @example Sort snowflakes in ascending order
	 * ```typescript
	 * const ids = ['737141877803057244', '1056191128120082432', '254360814063058944'];
	 * console.log(ids.sort((a, b) => Snowflake.compare(a, b)));
	 * // → ['254360814063058944', '737141877803057244', '1056191128120082432'];
	 * ```
	 * @example Sort snowflakes in descending order
	 * ```typescript
	 * const ids = ['737141877803057244', '1056191128120082432', '254360814063058944'];
	 * console.log(ids.sort((a, b) => -Snowflake.compare(a, b)));
	 * // → ['1056191128120082432', '737141877803057244', '254360814063058944'];
	 * ```
	 */
	public static compare(a: string | bigint, b: string | bigint): -1 | 0 | 1 {
		if (typeof a === 'bigint' || typeof b === 'bigint') {
			if (typeof a === 'string') a = BigInt(a);
			if (typeof b === 'string') b = BigInt(b);

			return a === b ? 0 : a < b ? -1 : 1;
		}

		return a === b ? 0 : a.length < b.length ? -1 : a.length > b.length ? 1 : a < b ? -1 : 1;
	}
}

/**
 * Options for Snowflake#generate
 */
export interface SnowflakeGenerateOptions {
	/**
	 * Timestamp or date of the snowflake to generate
	 * @default Date.now()
	 */
	timestamp?: number | bigint | Date;

	/**
	 * The increment to use
	 * @default 0n
	 * @remark keep in mind that this bigint is auto-incremented between generate calls
	 */
	increment?: bigint;

	/**
	 * The worker ID to use, will be truncated to 5 bits (0-31)
	 * @default 0n
	 */
	workerId?: bigint;

	/**
	 * The process ID to use, will be truncated to 5 bits (0-31)
	 * @default 1n
	 */
	processId?: bigint;
}

/**
 * Object returned by Snowflake#deconstruct
 */
export interface DeconstructedSnowflake {
	/**
	 * The id in BigInt form
	 */
	id: bigint;

	/**
	 * The timestamp stored in the snowflake
	 */
	timestamp: bigint;

	/**
	 * The worker id stored in the snowflake
	 */
	workerId: bigint;

	/**
	 * The process id stored in the snowflake
	 */
	processId: bigint;

	/**
	 * The increment stored in the snowflake
	 */
	increment: bigint;

	/**
	 * The epoch to use in the snowflake
	 */
	epoch: bigint;
}
