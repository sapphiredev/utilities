export function partition<const ElementType, const FilteredType extends ElementType>(
	iterator: IterableIterator<ElementType>,
	predicate: (value: ElementType) => value is FilteredType
): [IterableIterator<FilteredType>, IterableIterator<Exclude<ElementType, FilteredType>>];
export function partition<const ElementType>(
	iterator: IterableIterator<ElementType>,
	predicate: (value: ElementType) => boolean
): [IterableIterator<ElementType>, IterableIterator<ElementType>];

/**
 * Partitions an iterator into two iterators based on a predicate.
 *
 * @param iterator An iterator to partition.
 * @param predicate A function that determines which partition an element belongs to.
 * @returns An array containing two iterators. The first iterator contains elements that satisfy the predicate, and the
 * second iterator contains elements that do not.
 */
export function partition<const ElementType>(
	iterator: IterableIterator<ElementType>,
	predicate: (value: ElementType) => boolean
): [IterableIterator<ElementType>, IterableIterator<ElementType>] {
	const bufferLeft: ElementType[] = [];
	const bufferRight: ElementType[] = [];
	return [
		{
			next() {
				if (bufferLeft.length > 0) {
					return { done: false, value: bufferLeft.shift()! };
				}

				for (const value of iterator) {
					if (predicate(value)) {
						return { done: false, value };
					}

					bufferRight.push(value);
				}

				return { done: true, value: undefined };
			},
			[Symbol.iterator]() {
				return this;
			}
		},
		{
			next() {
				if (bufferRight.length > 0) {
					return { done: false, value: bufferRight.shift()! };
				}

				for (const value of iterator) {
					if (!predicate(value)) {
						return { done: false, value };
					}

					bufferLeft.push(value);
				}

				return { done: true, value: undefined };
			},
			[Symbol.iterator]() {
				return this;
			}
		}
	];
}
