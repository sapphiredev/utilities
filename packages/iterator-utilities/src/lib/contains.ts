import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Determines whether an iterator contains a specific value.
 *
 * @param iterable The iterator in which to locate a value.
 * @param value The value to locate in the iterator.
 * @returns `true` if the value is found in the iterator; otherwise, `false`.
 */
export function contains<const ElementType>(iterable: IterableResolvable<ElementType>, value: ElementType): boolean {
	for (const element of toIterableIterator(iterable)) {
		if (element === value) return true;
	}

	return false;
}
