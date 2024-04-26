export function dropWhile<const ElementType, const FilteredType extends ElementType>(
	iterator: IterableIterator<ElementType>,
	callbackFn: (element: ElementType, index: number) => element is FilteredType
): IterableIterator<Exclude<ElementType, FilteredType>>;
export function dropWhile<const ElementType>(
	iterator: IterableIterator<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): IterableIterator<ElementType>;
/**
 * Returns an iterator that produces elements from the given iterator that don't satisfy the specified test.
 *
 * @param iterator An iterator to drop values from.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return a falsy value to make the element yielded by the iterator helper, and a truthy value otherwise.
 * @returns An iterator that produces elements from the given iterator that don't satisfy the specified test.
 */
export function* dropWhile<const ElementType>(
	iterator: IterableIterator<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): IterableIterator<ElementType> {
	let index = 0;
	for (const value of iterator) {
		if (!callbackFn(value, index++)) {
			yield value;
			break;
		}
	}
}

export { dropWhile as skipWhile };
