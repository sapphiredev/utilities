/**
 * Unzips an iterable that yields arrays into an array of iterables that yield the values of the original iterable.
 *
 * @param iterable An iterable to unzip.
 * @returns An array of iterables that yield the values of the original iterable.
 */
export function unzip<const ElementType extends readonly any[]>(iterable: IterableIterator<ElementType>): UnzipIterable<ElementType> {
	const firstResult = iterable.next();
	if (firstResult.done) {
		throw new Error('Cannot unzip an empty iterable.');
	}

	if (!Array.isArray(firstResult.value)) {
		throw new Error('Cannot unzip an iterable that does not yield an array.');
	}

	const size = firstResult.value.length;
	const buffers = [] as any[][];
	for (let i = 0; i < size; i++) buffers.push([]);

	const iterators = [];
	for (let i = 0; i < size; i++) {
		iterators.push({
			next() {
				const buffer = buffers[i];
				if (buffer.length > 0) {
					return { done: false, value: buffer.shift() };
				}

				const result = iterable.next();
				if (result.done) {
					return result;
				}

				if (!Array.isArray(result.value)) {
					throw new Error('Cannot unzip an iterable that does not yield an array.');
				}

				if (result.value.length !== size) {
					throw new Error('Cannot unzip an iterable that yields arrays of different sizes.');
				}

				for (let iteratorIndex = 0; iteratorIndex < size; iteratorIndex++) {
					if (iteratorIndex === i) continue;
					buffers[iteratorIndex].push(result.value[iteratorIndex]);
				}

				return result.value[i];
			},
			[Symbol.iterator]() {
				return this;
			}
		});
	}

	return iterators as any;
}

export type UnzipIterable<ElementType extends readonly any[]> = {
	-readonly [P in keyof ElementType]: IterableIterator<ElementType[P]>;
};
