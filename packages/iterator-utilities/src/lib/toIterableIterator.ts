import { from, type IterableResolvable } from './from';
import { makeIterableIterator } from './shared/makeIterableIterator';

export function toIterableIterator<const ElementType>(iterable: IterableResolvable<ElementType>): IterableIterator<ElementType> {
	const resolvedIterable = from(iterable);
	if (Symbol.iterator in resolvedIterable) {
		return resolvedIterable;
	}

	return makeIterableIterator(() => resolvedIterable.next());
}
