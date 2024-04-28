import { type IterableResolvable } from './from';
import { assertFunction } from './shared/_assertFunction';
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
 *
 * @remarks
 *
 * If the input iterable produces a value that is not an array, this function throws a `TypeError`.
 */
export function* starMap<const ElementType extends IterableResolvable<any>, const MappedType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (...args: StarMapParameters<ElementType>) => MappedType
): IterableIterator<MappedType> {
	callbackFn = assertFunction(callbackFn);

	for (const value of toIterableIterator(iterable)) {
		yield callbackFn(...(toIterableIterator(value) as any));
	}
}

export type StarMapParameters<ElementType> = ElementType extends readonly [...infer ElementTypeEntry]
	? ElementTypeEntry
	: ElementType extends IterableResolvable<infer ElementType>
		? ElementType[]
		: never;
