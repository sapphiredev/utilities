/**
 * Projects each element of an iterator into a new form.
 *
 * @param iterator An iterator to map over.
 * @param callbackFn A function to execute for each element produced by the iterator. Its return value is yielded by the iterator helper.
 */
export function* map<const ElementType, const MappedType>(
	iterator: IterableIterator<ElementType>,
	callbackFn: (element: ElementType, index: number) => MappedType
): IterableIterator<MappedType> {
	let index = 0;
	for (const value of iterator) {
		yield callbackFn(value, index++);
	}
}
