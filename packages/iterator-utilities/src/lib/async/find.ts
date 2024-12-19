import { filterAsync } from './filter';
import { firstAsync } from './first';
import type { AsyncIterableResolvable } from './from';

/**
 * Advances the iterable until it finds the element, returning it if it's found and `undefined` otherwise.
 *
 * @param iterable An iterator to search for a value in.
 * @param callbackFn A function that determines if a value is the one being searched for.
 * @returns
 *
 * @example
 * ```typescript
 * import { findAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(await findAsync(iterable, (value) => value % 2 === 0));
 * // Output: 2
 * ```
 *
 * @remarks
 *
 * This function consumes the iterator until the value is found or the iterator is exhausted.
 */
export function findAsync<const ElementType, const FilteredType extends ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => element is FilteredType
): Promise<FilteredType | undefined>;
export function findAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): Promise<ElementType | undefined>;
export function findAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): Promise<ElementType | undefined> {
	return firstAsync(filterAsync(iterable, callbackFn));
}
