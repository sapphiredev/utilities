import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

export function* starMap<const ElementType extends readonly any[], const MappedType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (...args: ElementType) => MappedType
): IterableIterator<MappedType> {
	for (const value of toIterableIterator(iterable)) {
		if (!Array.isArray(value)) {
			throw new TypeError('Value produced by iterator is not an array.');
		}

		yield callbackFn(...(value as ElementType));
	}
}
