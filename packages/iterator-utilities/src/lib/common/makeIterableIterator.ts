export function makeIterableIterator<const ElementType>(next: Iterator<ElementType>['next']): IterableIterator<ElementType> {
	return {
		next,
		[Symbol.iterator]() {
			return this;
		}
	};
}
