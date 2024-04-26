import { assertNotNegative } from './common/assertNotNegative';
import { toIntegerOrThrow } from './common/toIntegerOrThrow';
import { repeat } from './repeat';
import { toArray } from './toArray';

/**
 * Creates a number of iterators that each yield the same values as the input iterator.
 *
 * @param iterator An iterator to tee.
 * @param count The number of iterators to create.
 * @returns An array of `count` iterators that each yield the same values as the input iterator.
 */
export function tee<const ElementType>(iterator: IterableIterator<ElementType>, count: number): IterableIterator<ElementType>[] {
	const integerCount = assertNotNegative(toIntegerOrThrow(count), count);
	if (integerCount === 0) return [];

	const entries = [] as ElementType[];
	const indexes = toArray(repeat(0, integerCount));
	const iterators = [] as IterableIterator<ElementType>[];
	for (let i = 0; i < integerCount; i++) {
		iterators.push({
			next() {
				if (indexes[i] >= entries.length) {
					const result = iterator.next();
					if (result.done) {
						return { done: true, value: undefined };
					}

					entries.push(result.value);
				}

				return { done: false, value: entries[indexes[i]++] };
			},
			[Symbol.iterator]() {
				return this;
			}
		});
	}

	return iterators;
}
