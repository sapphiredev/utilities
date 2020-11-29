import { performance } from 'perf_hooks';

/**
 * Stopwatch class, uses native node to replicate/extend performance-now dependency.
 */
export class Stopwatch {
	/**
	 * The number of digits to appear after the decimal point when returning the friendly duration.
	 */
	public digits: number;

	/**
	 * The start time of this stopwatch
	 */
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	#start: number;

	/**
	 * The end time of this stopwatch
	 */
	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	#end: number | null;

	/**
	 * Starts a new stopwatch
	 */
	public constructor(digits = 2) {
		this.digits = digits;
		this.#start = performance.now();
		this.#end = null;
	}

	/**
	 * The duration of this stopwatch since start or start to end if this stopwatch has stopped.
	 */
	public get duration(): number {
		return this.#end ? this.#end - this.#start : performance.now() - this.#start;
	}

	/**
	 * If the stopwatch is running or not.
	 */
	public get running(): boolean {
		return Boolean(!this.#end);
	}

	/**
	 * Restarts the stopwatch (Returns a running state)
	 */
	public restart(): this {
		this.#start = performance.now();
		this.#end = null;
		return this;
	}

	/**
	 * Resets the Stopwatch to 0 duration (Returns a stopped state)
	 */
	public reset(): this {
		this.#start = performance.now();
		this.#end = this.#start;
		return this;
	}

	/**
	 * Starts the Stopwatch
	 */
	public start(): this {
		if (!this.running) {
			this.#start = performance.now() - this.duration;
			this.#end = null;
		}

		return this;
	}

	/**
	 * Stops the Stopwatch, freezing the duration
	 */
	public stop(): this {
		if (this.running) this.#end = performance.now();
		return this;
	}

	/**
	 * Defines toString behavior
	 */
	public toString(): string {
		const time = this.duration;
		if (time >= 1000) return `${(time / 1000).toFixed(this.digits)}s`;
		if (time >= 1) return `${time.toFixed(this.digits)}ms`;
		return `${(time * 1000).toFixed(this.digits)}μs`;
	}
}
