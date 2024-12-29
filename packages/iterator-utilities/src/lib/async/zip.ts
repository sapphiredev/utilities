import { fromAsync, type AsyncIterableResolvable } from './from';

/**
 * Creates an iterable with the elements of the input iterables zipped together. The opposite of {@linkcode unzip}.
 *
 * @param iterables The iterables to zip together.
 * @returns A new iterable that yields the next value of each iterable in the list.
 *
 * @example
 * ```typescript
 * import { zipAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable1 = [1, 2, 3];
 * const iterable2 = ['a', 'b', 'c'];
 * const iterable3 = [true, false, true];
 *
 * const iterator = zipAsync(iterable1, iterable2, iterable3);
 * console.log(await collectAsync(iterator));
 * // Output: [
 * // 	[1, 'a', true],
 * // 	[2, 'b', false],
 * // 	[3, 'c', true]
 * // ]
 * ```
 */
export async function* zipAsync<const Iterables extends readonly AsyncIterableResolvable<any>[]>(
	...iterables: Iterables
): ZipAsyncIterators<Iterables> {
	const resolvedIterables = iterables.map((iterable) => fromAsync(iterable));
	while (true) {
		const results = [] as any[];
		for (const resolvedIterable of resolvedIterables) {
			const result = await resolvedIterable.next();
			if (result.done) return;

			results.push(result.value);
		}

		yield results as any;
	}
}

export type ZipAsyncIterators<Iterators extends readonly AsyncIterableResolvable<any>[]> = AsyncIterableIterator<{
	-readonly [P in keyof Iterators]: Iterators[P] extends AsyncIterableResolvable<infer T> ? T : never;
}>;
