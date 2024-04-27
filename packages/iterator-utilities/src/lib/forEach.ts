import type { IterableResolvable } from './from';
import { assertFunction } from './shared/assertFunction';
import { toIterableIterator } from './toIterableIterator';

/**
 * Executes a provided function once for each iterable element.
 *
 * @param iterable An iterator to iterate over.
 * @param callbackFn A function to execute for each element produced by the iterator. Its return value is discarded.
 *
 * @example
 * ```typescript
 * import { forEach } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * forEach(iterable, (value) => console.log(value));
 * // Output: 1, 2, 3, 4, 5
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function forEach<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => void
): void {
	callbackFn = assertFunction(callbackFn);

	let index = 0;
	for (const element of toIterableIterator(iterable)) {
		callbackFn(element, index++);
	}
}
