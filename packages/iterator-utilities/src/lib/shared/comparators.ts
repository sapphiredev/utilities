import type { CompareByComparator, LexicographicComparison } from './_compare';

function swap<const ElementType>(cb: CompareByComparator<ElementType>): CompareByComparator<ElementType> {
	return (x, y) => (0 - cb(x, y)) as LexicographicComparison;
}

/**
 * Compares two elements lexicographically using the default comparison algorithm.
 * @seealso 23.1.3.30.2 CompareArrayElements ({@link https://tc39.es/ecma262/#sec-comparearrayelements})
 *
 * @param x The first element to compare.
 * @param y The second element to compare.
 * @returns The lexicographic comparison of the two elements.
 *
 * @remarks
 *
 * This function is used as the comparison algorithm for {@link compareBy}.
 */
export function defaultCompare<const ElementType>(x: ElementType, y: ElementType): LexicographicComparison {
	// 5. Let xString be ? ToString(x).
	// 6. Let yString be ? ToString(y).
	// Steps 7-11 are optimized away by the usage of `ascNumber`.
	return ascNumber(String(x), String(y));
}

export { defaultCompare as ascString };
export const descString = swap(defaultCompare);

/**
 * Compares two elements using the default comparison algorithm.
 *
 * @param x The first element to compare.
 * @param y The second element to compare.
 * @returns The numeric comparison of the two elements.
 *
 * @privateRemarks
 *
 * The implementation of this function is based on the optimized version of the
 * starship operator in Rust. The subtraction is intentional and is used to
 * determine the ordering of the two elements.
 */
export function ascNumber(x: number | bigint | string, y: number | bigint | string): LexicographicComparison {
	// @ts-expect-error: The subtraction is intentional
	return ((x > y) - (x < y)) as LexicographicComparison;
}
export const descNumber = swap(ascNumber);
