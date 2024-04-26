/**
 * Creates a new empty iterator.
 *
 * @returns An empty iterator.
 */
export function empty<const ElementType = never>(): IterableIterator<ElementType> {
	return {
		next() {
			return { done: true, value: undefined };
		},
		[Symbol.iterator]() {
			return this;
		}
	};
}
