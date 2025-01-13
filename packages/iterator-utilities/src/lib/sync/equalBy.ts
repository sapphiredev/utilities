import { assertFunction } from '../shared/_assertFunction';
import { from, type IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Determines if the elements of both iterators are equal with respect to the specified equality function.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 * @returns Whether the two iterators are equal with respect to the specified equality function.
 *
 * @example
 * ```typescript
 * import { equalBy } from '@sapphire/iterator-utilities';
 *
 * const x = [1, 2, 3, 4];
 * const y = [1, 4, 9, 16];
 *
 * console.log(equalBy(x, y, (a, b) => a * a === b));
 * // Output: true
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function equalBy<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	other: IterableResolvable<ElementType>,
	callbackFn: (x: ElementType, y: ElementType) => boolean
): boolean {
	callbackFn = assertFunction(callbackFn);

	const iterator1 = from(other);

	for (const value0 of toIterableIterator(iterable)) {
		const result1 = iterator1.next();
		if (result1.done || !callbackFn(value0, result1.value)) return false;
	}

	return iterator1.next().done === true;
}

export { equalBy as eqBy };
