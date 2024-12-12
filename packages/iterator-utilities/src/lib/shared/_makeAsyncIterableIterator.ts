export function makeAsyncIterableIterator<const ElementType>(next: AsyncIterator<ElementType>['next']): AsyncIterableIterator<ElementType> {
	return {
		next,
		[Symbol.asyncIterator]() {
			return this;
		}
	};
}
