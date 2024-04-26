import { from, type IterableResolvable } from './from';

/**
 * Creates a new iterable that yields the next value of each iterable in the list.
 *
 * @param iterables The iterables to zip together.
 * @returns A new iterable that yields the next value of each iterable in the list.
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

		yield results.map((result) => result.value) as any;
	}
}

export type ZipIterators<Iterators extends readonly IterableResolvable<any>[]> = IterableIterator<{
	-readonly [P in keyof Iterators]: Iterators[P] extends IterableResolvable<infer T> ? T : never;
}>;
