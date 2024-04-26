export function peekable<const ElementType, TReturn = any, TNext = undefined>(
	iterator: Iterator<ElementType, TReturn, TNext>
): Peekable<ElementType, TReturn, TNext> {
	let peeked: IteratorResult<ElementType, TReturn> | undefined;
	return {
		next(...args) {
			if (peeked) {
				const value = peeked;
				peeked = undefined;
				return value;
			}

			return iterator.next(...args);
		},
		peek() {
			peeked = peeked ?? iterator.next();
			return peeked;
		},
		[Symbol.iterator]() {
			return this as IterableIterator<ElementType>;
		}
	};
}

export interface Peekable<T, TReturn, TNext> extends Iterator<T, TReturn, TNext> {
	peek(): IteratorResult<T> | undefined;
	[Symbol.iterator](): IterableIterator<T>;
}
