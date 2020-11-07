/**
 * Manages timers so that this application can be cleanly exited
 */
export class TimerManager extends null {
	/**
	 * A set of timeouts to clear on destroy
	 */
	private static storedTimeouts = new Set<NodeJS.Timeout>();

	/**
	 * A set of intervals to clear on destroy
	 */
	private static storedIntervals = new Set<NodeJS.Timeout>();

	/**
	 * Creates a timeout gets cleared when destroyed
	 * @param fn callback function
	 * @param delay amount of time before running the callback
	 * @param args additional arguments to pass back to the callback
	 */
	public static setTimeout<A = unknown>(fn: (...args: A[]) => void, delay: number, ...args: A[]): NodeJS.Timeout {
		const timeout = setTimeout(() => {
			this.storedTimeouts.delete(timeout);
			fn(...args);
		}, delay);
		this.storedTimeouts.add(timeout);
		return timeout;
	}

	/**
	 * Clears a timeout created through this class
	 * @param timeout The timeout to clear
	 */
	public static clearTimeout(timeout: NodeJS.Timeout): void {
		clearTimeout(timeout);
		this.storedTimeouts.delete(timeout);
	}

	/**
	 * Creates an interval gets cleared when destroyed
	 * @param fn callback function
	 * @param delay amount of time before running the callback
	 * @param args additional arguments to pass back to the callback
	 */
	public static setInterval<A = unknown>(fn: (...args: A[]) => void, delay: number, ...args: A[]): NodeJS.Timeout {
		const interval = setInterval(fn, delay, ...args);
		this.storedIntervals.add(interval);
		return interval;
	}

	/**
	 * Clears an internal created through this class
	 * @param interval The interval to clear
	 */
	public static clearInterval(interval: NodeJS.Timeout): void {
		clearInterval(interval);
		this.storedIntervals.delete(interval);
	}

	/**
	 * Clears running timeouts and intervals created through this class so NodeJS can gracefully exit
	 */
	public static destroy(): void {
		for (const i of this.storedTimeouts) clearTimeout(i);
		for (const i of this.storedIntervals) clearInterval(i);
		this.storedTimeouts.clear();
		this.storedIntervals.clear();
	}
}
