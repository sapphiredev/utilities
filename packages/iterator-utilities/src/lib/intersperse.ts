import { from, type IterableResolvable } from './from';
import { makeIterableIterator } from './shared/_makeIterableIterator';

/**
 * Creates a new iterator which places `separator` between adjacent items of the original iterator.
 *
 * @param iterable An iterator to map over.
 * @param separator The separator to place between adjacent items.
 *
 * @example
 * ```typescript
 * import { intersperse } from '@sapphire/iterator-utilities';
 *
 * const iterable = [0, 1, 2];
 * console.log([...intersperse(iterable, 100)]);
 * // Output: [0, 100, 1, 100, 2]
 * ```
 *
 * @example
 * `intersperse` can be very useful to join an iterator's items using a common element:
 * ```typescript
 * import { intersperse } from '@sapphire/iterator-utilities';
 *
 * const iterable = ['Hello', 'World', '!'];
 * console.log([...intersperse(iterable, ', ')].join(''));
 * // Output: 'Hello, World, !'
 * ```
 */
export function intersperse<const ElementType>(iterable: IterableResolvable<ElementType>, separator: ElementType): IterableIterator<ElementType> {
	let started = false;
	let nextItem: ElementType;
	let nextItemTaken = false;

	const iterator = from(iterable);
	return makeIterableIterator<ElementType>(() => {
		if (started) {
			if (nextItemTaken) {
				nextItemTaken = false;
				return { done: false, value: nextItem };
			}

			const result = iterator.next();
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
