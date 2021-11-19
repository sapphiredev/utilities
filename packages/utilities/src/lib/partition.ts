import { isFunction } from './isFunction';

/**
 * Partitions `array` into a tuple of two arrays,
 * where one array contains all elements that satisfies `predicate`,
 * and the other contains all elements that do not satisfy `predicate`.
 * @param array The array to partition. This array is not mutated.
 * @param predicate The predicate function to determine in which partition the item should be placed.
 * The function should return true for items that should be placed in the first partition, and false for those that should be placed in the second partition.
 * @returns A tuple of two arrays.
 */
export function partition<T>(array: T[], predicate: (value: T, index: number) => boolean) {
	if (!Array.isArray(array)) throw new TypeError('entries must be an array.');
	if (!isFunction(predicate)) throw new TypeError('predicate must be an function that returns a boolean value.');

	const partitionOne: T[] = [];
	const partitionTwo: T[] = [];

	for (let i = 0; i < array.length; i++) {
		if (predicate(array[i], i)) {
			partitionOne.push(array[i]);
		} else {
			partitionTwo.push(array[i]);
		}
	}

	return [partitionOne, partitionTwo];
}
