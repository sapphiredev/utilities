import { from, type IterableResolvable } from './from';

/**
 * Creates an iterable with the elements of the input iterables zipped together. The opposite of {@linkcode unzip}.
 *
 * @param iterables The iterables to zip together.
 * @returns A new iterable that yields the next value of each iterable in the list.
 *
 * @example
 * ```typescript
 * import { zip } from '@sapphire/iterator-utilities';
 *
 * const iterable1 = [1, 2, 3];
 * const iterable2 = ['a', 'b', 'c'];
 * const iterable3 = [true, false, true];
 *
 * console.log(zip(iterable1, iterable2, iterable3));
 * // Output: [
 * // 	[1, 'a', true],
 * // 	[2, 'b', false],
 * // 	[3, 'c', true]
 * // ]
 * ```
 */
export function* zip<const Iterables extends readonly IterableResolvable<any>[]>(...iterables: Iterables): ZipIterators<Iterables> {
	const resolvedIterables = iterables.map((iterable) => from(iterable));
	while (true) {
		const results = [] as any[];
		for (const resolvedIterable of resolvedIterables) {
			const result = resolvedIterable.next();
			if (result.done) return;

			results.push(result.value);
		}

		yield results as any;
	}
}

export type ZipIterators<Iterators extends readonly IterableResolvable<any>[]> = IterableIterator<{
	-readonly [P in keyof Iterators]: Iterators[P] extends IterableResolvable<infer T> ? T : never;
}>;
