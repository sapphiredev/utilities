/**
 * Executes a provided function once for each element produced by the iterator.
 *
 * @param iterator An iterator to iterate over.
 * @param callbackFn A function to execute for each element produced by the iterator. Its return value is discarded.
 */
export function forEach<const ElementType>(iterator: IterableIterator<ElementType>, callbackFn: (element: ElementType, index: number) => void): void {
	let index = 0;
	for (const value of iterator) {
		callbackFn(value, index++);
	}
}
