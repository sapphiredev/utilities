/**
 * Represents the result of a lexicographic comparison.
 *
 * The operations are as follows:
 *
 * - Two iterators are compared element by element.
 * - The first pair of unequal elements determines the result.
 * - If one sequence is a prefix of the other, the shorter sequence is lexicographically less than the other.
 * - If two sequences have the same elements in the same order, they are lexicographically equal.
 * - An empty sequence is lexicographically less than any non-empty sequence.
 * - Two empty sequences are lexicographically equal.
 */
export type LexicographicComparison = -1 | 0 | 1;

export type CompareByComparator<ElementType> = (x: Exclude<ElementType, undefined>, y: Exclude<ElementType, undefined>) => number;

export function compareIteratorElements<const ElementType>(
	x: ElementType | undefined,
	y: ElementType | undefined,
	comparator: CompareByComparator<ElementType>
): number {
	// 23.1.3.30.2 CompareArrayElements (https://tc39.es/ecma262/#sec-comparearrayelements)
	if (typeof x === 'undefined') {
		// 1. If x and y are both `undefined`, return +0.
		if (typeof y === 'undefined') return 0;
		// 2. If x is `undefined`, return +1.
		return 1;
	}

	if (typeof y === 'undefined') {
		// 3. If y is `undefined`, return -1.
		return -1;
	}

	return comparator(x as Exclude<ElementType, undefined>, y as Exclude<ElementType, undefined>);
}

export function orderingIsLess(ordering: number) {
	return ordering < 0;
}

export function orderingIsEqual(ordering: number) {
	return ordering === 0;
}

export function orderingIsGreater(ordering: number) {
	return ordering > 0;
}
