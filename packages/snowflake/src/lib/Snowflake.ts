/* eslint-disable @typescript-eslint/explicit-member-accessibility */

/**
 * A class for parsing snowflake ids
 */
export class Snowflake {
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
	 * Alias for {@link deconstruct}
	 */
	// eslint-disable-next-line @typescript-eslint/unbound-method, @typescript-eslint/no-invalid-this
	public decode = this.deconstruct;

	/**
	 * @param epoch the epoch to use
	 */
	public constructor(epoch: number | bigint | Date) {
		this.#epoch = BigInt(epoch);
	}

	/**
	 * Generates a snowflake given an epoch and optionally a timestamp
	 * @param options options to pass into the generator, see {@link SnowflakeGenerateOptions}
	 *
	 * **note** when increment is not provided it defaults to the private increment of the instance
	 * @example
	 * ```ts
	 * const epoch = new Date('2000-01-01T00:00:00.000Z');
	 * const snowflake = new Snowflake(epoch).generate();
	 * ```
	 * @returns A unique snowflake
	 */
	public generate(
		{ increment = this.#increment, timestamp = Date.now(), workerID = 1n, processID = 1n }: SnowflakeGenerateOptions = {
			increment: this.#increment,
			timestamp: Date.now(),
			workerID: 1n,
			processID: 1n
		}
	) {
		if (timestamp instanceof Date) timestamp = BigInt(timestamp);
		if (typeof timestamp === 'number' && !Number.isNaN(timestamp)) timestamp = BigInt(timestamp);

		if (typeof timestamp !== 'bigint') {
			throw new TypeError(
				`"timestamp" argument must be a number, BigInt or Date (received ${Number.isNaN(timestamp) ? 'NaN' : typeof timestamp})`
			);
		}

		if (increment >= 4095n) increment = 0n;

		// timestamp, workerID, processID, increment
		return ((timestamp - this.#epoch) << 22n) | (workerID << 17n) | (processID << 12n) | increment++;
	}

	/**
	 * Deconstructs a snowflake given a snowflake ID
	 * @param id the snowflake to deconstruct
	 * @returns a deconstructed snowflake
	 * @example
	 * ```ts
	 * const epoch = new Date('2000-01-01T00:00:00.000Z');
	 * const snowflake = new Snowflake(epoch).deconstruct('3971046231244935168');
	 * ```
	 */
	public deconstruct(id: string | bigint): DeconstructedSnowflake {
		const bigIntId = BigInt(id);
		return {
			id: bigIntId,
			timestamp: (bigIntId >> 22n) + this.#epoch,
			workerID: (bigIntId >> 17n) & 0b11111n,
			processID: (bigIntId >> 12n) & 0b11111n,
			increment: bigIntId & 0b111111111111n,
			epoch: this.#epoch
		};
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
	 * The worker ID to use
	 * @default 1n
	 */
	workerID?: bigint;

	/**
	 * The process ID to use
	 * @default 1n
	 */
	processID?: bigint;
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
	workerID: bigint;

	/**
	 * The process id stored in the snowflake
	 */
	processID: bigint;

	/**
	 * The increment stored in the snowflake
	 */
	increment: bigint;

	/**
	 * The epoch to use in the snowflake
	 */
	epoch: bigint;
}
