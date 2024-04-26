/**
 * Creates a new iterable that yields the next value of each iterable in the list.
 *
 * @param iterables The iterables to zip together.
 * @returns A new iterable that yields the next value of each iterable in the list.
 */
export function* zip<const Iterators extends readonly IterableIterator<any>[]>(...iterables: Iterators): ZipIterators<Iterators> {
	while (true) {
		const results = iterables.map((iterable) => iterable.next());
		if (results.some((result) => result.done)) {
			return;
		}

		yield results.map((result) => result.value) as any;
	}
}

export type ZipIterators<Iterators extends readonly IterableIterator<any>[]> = IterableIterator<{
	-readonly [P in keyof Iterators]: Iterators[P] extends IterableIterator<infer T> ? T : never;
}>;
