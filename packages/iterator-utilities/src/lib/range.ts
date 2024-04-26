/**
 * Generates a range between two numbers.
 *
 * @param start The value of the first number in the range.
 * @param end The end value of the range.
 * @param step The amount to increment the range by.
 */
export function* range(start: number, end: number, step = 1): IterableIterator<number> {
	if (step === 0) {
		throw new Error('Step cannot be zero.');
	}

	if (start > end) [start, end] = [end, start];
	if (step < 0) [start, end] = [end, start];

	for (let i = start; i < end; i += step) {
		yield i;
	}
}
