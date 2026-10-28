/**
 * Compare if both arrays are strictly equal
 *
 * @param arr1 - The array to compare to
 * @param arr2 - The array to compare with
 */
export function arrayStrictEquals<T extends readonly unknown[]>(arr1: T, arr2: T): boolean {
	if (arr1 === arr2) return true;
	if (arr1.length !== arr2.length) return false;

	for (const [idx, element] of arr1.entries()) {
		if (element !== arr2[idx] || typeof element !== typeof arr2[idx]) return false;
	}

	return true;
}
