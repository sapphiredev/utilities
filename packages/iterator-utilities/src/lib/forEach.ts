import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Executes a provided function once for each element produced by the iterator.
 *
 * @param iterable An iterator to iterate over.
 * @param callbackFn A function to execute for each element produced by the iterator. Its return value is discarded.
 */
export function forEach<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => void
): void {
	let index = 0;
	for (const element of toIterableIterator(iterable)) {
		callbackFn(element, index++);
	}
}
