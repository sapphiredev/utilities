import { makeIterableIterator } from './common/makeIterableIterator';
import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Unzips an iterable that yields arrays into an array of iterables that yield the values of the original iterable.
 *
 * @param iterable An iterable to unzip.
 * @returns An array of iterables that yield the values of the original iterable.
 */
export function unzip<const ElementType extends readonly any[]>(iterable: IterableResolvable<ElementType>): UnzipIterable<ElementType> {
	const resolvedIterable = toIterableIterator(iterable);
	const firstResult = resolvedIterable.next();
	if (firstResult.done) {
		throw new Error('Cannot unzip an empty iterable.');
	}

	if (!Array.isArray(firstResult.value)) {
		throw new Error('Cannot unzip an iterable that does not yield an array.');
	}

	const size = firstResult.value.length;
	const buffers = [] as ElementType[][];
	for (let i = 0; i < size; i++) buffers.push([]);

	const iterables = [] as UnzipIterable<ElementType>;
	for (let i = 0; i < size; i++) {
		const iterable = makeIterableIterator<ElementType>(() => {
			const buffer = buffers[i];
			if (buffer.length > 0) {
				return { done: false, value: buffer.shift() };
			}

			const result = resolvedIterable.next();
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
		});

		iterables.push(iterable);
	}

	return iterables as UnzipIterable<ElementType>;
}

export type UnzipIterable<ElementType extends readonly any[]> = {
	-readonly [P in keyof ElementType]: IterableIterator<ElementType[P]>;
};
