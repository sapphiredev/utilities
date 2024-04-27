import type { IterableResolvable } from './from';
import { assertFunction } from './shared/assertFunction';
import { toIterableIterator } from './toIterableIterator';

export function* starMap<const ElementType extends readonly any[], const MappedType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (...args: ElementType) => MappedType
): IterableIterator<MappedType> {
	callbackFn = assertFunction(callbackFn);

	for (const value of toIterableIterator(iterable)) {
		if (!Array.isArray(value)) {
			throw new TypeError('Value produced by iterator is not an array.');
		}

		yield callbackFn(...(value as ElementType));
	}
}
