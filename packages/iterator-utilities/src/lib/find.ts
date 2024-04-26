export function find<const ElementType, const FilteredType extends ElementType>(
	iterator: IterableIterator<ElementType>,
	callbackFn: (element: ElementType, index: number) => element is FilteredType
): FilteredType | undefined;
export function find<const ElementType>(
	iterator: IterableIterator<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): ElementType | undefined;

/**
 * Finds the first value in an iterator that satisfies a provided condition.
 *
 * @param iterator An iterator to search for a value in.
 * @param callbackFn A function that determines if a value is the one being searched for.
 * @returns
 */
export function find<const ElementType>(
	iterator: IterableIterator<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): ElementType | undefined {
	let index = 0;
	for (const value of iterator) {
		if (callbackFn(value, index++)) return value;
	}

	return undefined;
}
