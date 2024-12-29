import { makeAsyncIterableIterator } from '../shared/_makeAsyncIterableIterator';
import { fromAsync, type AsyncIterableResolvable } from './from';

/**
 * Creates a new iterator which places `separator` between adjacent items of the original iterator.
 *
 * @param iterable An iterator to map over.
 * @param separator The separator to place between adjacent items.
 *
 * @example
 * ```typescript
 * import { intersperseAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = intersperseAsync([0, 1, 2], 100);
 * console.log(collectAsync(iterable));
 * // Output: [0, 100, 1, 100, 2]
 * ```
 *
 * @example
 * `intersperseAsync` can be very useful to join an iterator's items using a common element:
 * ```typescript
 * import { intersperseAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = intersperseAsync(['Hello', 'World', '!'], ', ');
 * console.log((await collectAsync(iterable)).join(''));
 * // Output: 'Hello, World, !'
 * ```
 */
export function intersperseAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	separator: ElementType
): AsyncIterableIterator<ElementType> {
	let started = false;
	let nextItem: ElementType;
	let nextItemTaken = false;

	const iterator = fromAsync(iterable);
	return makeAsyncIterableIterator<ElementType>(async () => {
		if (started) {
			if (nextItemTaken) {
				nextItemTaken = false;
				return { done: false, value: nextItem };
			}

			const result = await iterator.next();
			if (result.done) {
				return { done: true, value: undefined };
			}

			nextItem = result.value;
			nextItemTaken = true;
			return { done: false, value: separator };
		}

		started = true;
		return iterator.next();
	});
}
