/**
 * Wait for a certain time before continuing with the execution of the next code.
 * @param time Time delay in milliseconds.
 */
export function wait(time: number) {
	return new Promise<void>((r) => setTimeout(() => r(), time));
}
