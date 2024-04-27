import type { IterableResolvable } from './from';
import { assertFunction } from './shared/assertFunction';
import { toIterableIterator } from './toIterableIterator';

/**
 * Creates an iterable with the results of calling a provided function on each element of the input iterables as the function's parameters.
 *
 * @param iterable - The iterable to map over.
 * @param callbackFn - The callback function to apply to each element.
 * @returns An iterable iterator that yields the mapped elements.
 *
 * @example
 * ```typescript
 * import { starMap } from '@sapphire/iterator-utilities';
 *
 * const iterable = [[1, 2], [3, 4], [5, 6]];
 * console.log([...starMap(iterable, (a, b) => a + b)]);
 * // Output: [3, 7, 11]
 * ```
 */
export function* starMap<const ElementType extends readonly any[], const MappedType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (...args: ElementType) => MappedType
): IterableIterator<MappedType> {
	callbackFn = assertFunction(callbackFn);

	for (const value of toIterableIterator(iterable)) {
		if (!Array.isArray(value)) {
			throw new TypeError('Value produced by iterator is not an array.');
		}

		yield callbackFn(...(value as ElementType));
	}
}
