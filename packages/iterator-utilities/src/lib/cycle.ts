import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Repeats an iterator endlessly.
 *
 * @param iterable An iterator to cycle over.
 */
export function* cycle<const ElementType>(iterable: IterableResolvable<ElementType>): IterableIterator<ElementType> {
	const results = [] as ElementType[];
	for (const element of toIterableIterator(iterable)) {
		yield element;
		results.push(element);
	}

	while (results.length > 0) {
		for (const element of results) {
			yield element;
		}
	}
}
