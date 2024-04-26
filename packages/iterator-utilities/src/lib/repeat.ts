/**
 * Generates an iterator that contains one repeated value.
 *
 * @param value The value to be repeated.
 * @param count The number of times to repeat the value.
 */
export function* repeat<const ElementType>(value: ElementType, count: number): IterableIterator<ElementType> {
	for (let i = 0; i < count; i++) {
		yield value;
	}
}
