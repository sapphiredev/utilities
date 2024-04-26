/**
 * Returns an iterator that applies a function to each element of the input iterator and yields the results.
 *
 * @param iterator An iterator to map.
 * @param callback A function to execute for each element produced by the iterator. It should return an iterator or iterable that yields elements to be yielded by `flatMap()`, or a single non-iterator/iterable value to be yielded.
 * @returns An iterator that applies a function to each element of the input iterator and yields the results.
 */
export function* flatMap<const ElementType, const MappedType>(
	iterator: IterableIterator<ElementType>,
	callback: (element: ElementType, index: number) => IterableIterator<MappedType>
): IterableIterator<MappedType> {
	let index = 0;
	for (const value of iterator) {
		yield* callback(value, index++);
	}
}
