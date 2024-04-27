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
		throw new Error('Cannot unzip an empty iterable');
	}

	if (!Array.isArray(firstResult.value)) {
		throw new Error('Cannot unzip an iterable that does not yield an array');
	}

	const size = firstResult.value.length;
	const results = [] as ElementType[][];
	for (let i = 0; i < size; i++) results.push([firstResult.value[i]]);
	for (const entries of resolvedIterable) {
		if (!Array.isArray(entries)) {
			throw new Error('Cannot unzip an iterable that does not yield an array');
		}

		if (entries.length !== size) {
			throw new Error('Cannot unzip an iterable that yields arrays of different sizes');
		}

		for (let i = 0; i < size; i++) {
			results[i].push(entries[i]);
		}
	}

	return results as UnzipIterable<ElementType>;
}

export type UnzipIterable<ElementType extends readonly any[]> = {
	-readonly [P in keyof ElementType]: ElementType[P][];
};
