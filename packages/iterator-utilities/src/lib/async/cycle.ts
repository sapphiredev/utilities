import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Creates an infinite iterable by cycling through the elements of the input iterable.
 *
 * @param iterable An iterator to cycle over.
 *
 * @example
 * ```typescript
 * import { cycleAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = cycleAsync([1, 2, 3]);
 * for await (const element of iterable) {
 * 	console.log(element);
 * 	// Output: 1, 2, 3, 1, 2, 3, 1, 2, 3, ...
 * }
 * ```
 */
export async function* cycleAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>): AsyncIterableIterator<ElementType> {
	const results = [] as ElementType[];
	for await (const element of toAsyncIterableIterator(iterable)) {
		yield element;
		results.push(element);
	}

	while (results.length > 0) {
		for (const element of results) {
			yield element;
		}
	}
}
