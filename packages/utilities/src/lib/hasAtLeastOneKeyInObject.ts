import { isNullish } from './isNullOrUndefined';
import type { NonNullObject } from './types';

/**
 * Checks whether any of the {@link keys} are in the {@link obj}
 * @param obj - The object to check
 * @param keys The keys to find in the object
 * @returns `true` if at least one of the {@link keys} is in the {@link object}, `false` otherwise.
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 };
 * console.log(hasAtLeastOneKeyInObject(obj, ['a'])); // true
 * console.log(hasAtLeastOneKeyInObject(obj, ['d'])); // false
 * ```
 */
export function hasAtLeastOneKeyInObject<T extends NonNullObject, K extends keyof T>(
	obj: T,
	keys: readonly PropertyKey[]
): obj is T & { [key in K]: NonNullable<T[K]> } {
	return !isNullish(obj) && keys.some((key) => Object.hasOwn(obj, key));
}
