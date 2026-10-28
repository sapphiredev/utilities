import { toNumberOrThrow } from './shared/_toNumberOrThrow';

/**
 * Creates an iterable with the numbers from `start` to `stop` (exclusive) with an optional step.
 *
 * @param start The value of the first number in the range.
 * @param end The end value of the range.
 * @param step The amount to increment the range by.
 * @example
 * ```typescript
 * import { range } from '@sapphire/iterator-utilities';
 *
 * const iterable = range(0, 5);
 * console.log([...iterable]);
 * // Output: [0, 1, 2, 3, 4]
 * ```
 * @example
 * ```typescript
 * const iterable = range(5, 0);
 * console.log([...iterable]);
 * // Output: [5, 4, 3, 2, 1]
 * ```
 * @example
 * ```typescript
 * const iterable = range(0, 5, 2);
 * console.log([...iterable]);
 * // Output: [0, 2, 4]
 * ```
 */
export function* range(start: number, end: number, step?: number): IterableIterator<number> {
	// eslint-disable-next-line no-param-reassign
	start = toNumberOrThrow(start);
	// eslint-disable-next-line no-param-reassign
	end = toNumberOrThrow(end);

	if (step === undefined) {
		// eslint-disable-next-line no-param-reassign
		step = start < end ? 1 : -1;
	} else {
		// eslint-disable-next-line no-param-reassign
		step = toNumberOrThrow(step);

		// Prevent infinite loops.
		if (step === 0) {
			throw new RangeError('Step cannot be zero');
		}

		// If the step is positive, the start must be less than the end.
		if (step > 0 && start > end) {
			throw new RangeError('Start must be less than end when step is positive');
		} else if (step < 0 && start < end) {
			throw new RangeError('Start must be greater than end when step is negative');
		}
	}

	if (start < end) {
		for (let idx = start; idx < end; idx += step) {
			yield idx;
		}
	} else {
		for (let idx = start; idx > end; idx += step) {
			yield idx;
		}
	}
}
