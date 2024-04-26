import { filter } from './filter';
import { first } from './first';
import type { IterableResolvable } from './from';

export function find<const ElementType, const FilteredType extends ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => element is FilteredType
): FilteredType | undefined;
export function find<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): ElementType | undefined;

/**
 * Finds the first value in an iterator that satisfies a provided condition.
 *
 * @param iterable An iterator to search for a value in.
 * @param callbackFn A function that determines if a value is the one being searched for.
 * @returns
 */
export function find<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): ElementType | undefined {
	return first(filter(iterable, callbackFn));
}
