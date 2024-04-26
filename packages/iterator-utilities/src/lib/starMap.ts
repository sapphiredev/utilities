export function* starMap<const ElementType extends readonly any[], const MappedType>(
	iterator: IterableIterator<ElementType>,
	callbackFn: (...args: ElementType) => MappedType
): IterableIterator<MappedType> {
	for (const value of iterator) {
		if (!Array.isArray(value)) {
			throw new TypeError('Value produced by iterator is not an array.');
		}

		yield callbackFn(...(value as ElementType));
	}
}
