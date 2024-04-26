import { from, type IterableResolvable } from './from';

export function peekable<const ElementType>(iterable: IterableResolvable<ElementType>): Peekable<ElementType> {
	const resolvedIterable = from(iterable);
	let peeked: IteratorResult<ElementType> | undefined;
	return {
		next() {
			if (peeked) {
				const value = peeked;
				peeked = undefined;
				return value;
			}

			return resolvedIterable.next();
		},
		peek() {
			peeked = peeked ?? resolvedIterable.next();
			return peeked;
		},
		[Symbol.iterator]() {
			return this as IterableIterator<ElementType>;
		}
	};
}

export interface Peekable<T> extends IterableIterator<T> {
	peek(): IteratorResult<T> | undefined;
}
