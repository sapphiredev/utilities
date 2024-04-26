export function filter<const ElementType, const FilteredType extends ElementType>(
	iterator: IterableIterator<ElementType>,
	callbackFn: (element: ElementType, index: number) => element is FilteredType
): IterableIterator<FilteredType>;
export function filter<const ElementType>(
	iterator: IterableIterator<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): IterableIterator<ElementType>;

/**
 * Creates an iterator that produces elements from the given iterator that satisfy the specified test.
 *
 * @param iterator The iterator to filter.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return a truthy value to make the element yielded by the iterator helper, and a falsy value otherwise.
 * @returns An iterator that produces elements from the given iterator that satisfy the specified test.
 */
export function* filter<ElementType>(
	iterator: IterableIterator<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): IterableIterator<ElementType> {
	let index = 0;
	for (const value of iterator) {
		if (callbackFn(value, index++)) yield value;
	}
}
