import { makeIterableIterator } from './common/makeIterableIterator';
import { from, type IterableResolvable } from './from';

export function toIterableIterator<const ElementType>(iterable: IterableResolvable<ElementType>): IterableIterator<ElementType> {
	const resolvedIterable = from(iterable);
	if (Symbol.iterator in resolvedIterable) {
		return resolvedIterable;
	}

	return makeIterableIterator(() => resolvedIterable.next());
}
