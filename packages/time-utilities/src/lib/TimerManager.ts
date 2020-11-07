/**
 * Manages timers so that this application can be cleanly exited
 */
export class TimerManager extends null {
	/**
	 * A collection of timeouts to clear on destroy
	 */
	private static storedTimeouts: Set<NodeJS.Timeout> = new Set();

	/**
	 * A collection of intervals to clear on destroy
	 */
	private static storedIntervals: Set<NodeJS.Timeout> = new Set();

	/**
	 * Set a timeout that Project Blue can clear when destroyed
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
	 * Clears a timeout set via Project Blue
	 * @param timeout The timeout to clear
	 */
	public static clearTimeout(timeout: NodeJS.Timeout): void {
		clearTimeout(timeout);
		this.storedTimeouts.delete(timeout);
	}

	/**
	 * Set an interval that Project Blue can clear when destroyed
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
	 * Clears an interval set via Project Blue
	 * @param interval The interval to clear
	 */
	public static clearInterval(interval: NodeJS.Timeout): void {
		clearInterval(interval);
		this.storedIntervals.delete(interval);
	}

	/**
	 * Clears running timeouts and intervals created in Project Blue so node can gracefully exit
	 */
	public static destroy(): void {
		for (const i of this.storedTimeouts) clearTimeout(i);
		for (const i of this.storedIntervals) clearInterval(i);
		this.storedTimeouts.clear();
		this.storedIntervals.clear();
	}
}
