import type { IterableResolvable } from './from';
import { assertFunction } from './shared/_assertFunction';
import { toIterableIterator } from './toIterableIterator';

/**
 * Creates an iterable with the results of calling a provided function on each element.
 *
 * @param iterable An iterator to map over.
 * @param callbackFn A function to execute for each element produced by the iterator. Its return value is yielded by the iterator helper.
 *
 * @example
 * ```typescript
 * import { map } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log([...map(iterable, (value) => value * 2)]);
 * // Output: [2, 4, 6, 8, 10]
 * ```
 */
export function* map<const ElementType, const MappedType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => MappedType
): IterableIterator<MappedType> {
	callbackFn = assertFunction(callbackFn);

	let index = 0;
	for (const element of toIterableIterator(iterable)) {
		yield callbackFn(element, index++);
	}
}
