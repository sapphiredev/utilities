import { isNullish } from './isNullOrUndefined';

/**
 * Checks whether any of the {@link keys} are in the {@link obj}
 * @param obj - The object to check
 * @param keys The keys to find in the object
 * @returns `true` if at least one of the {@link keys} is in the {@link obj}, `false` otherwise.
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: 2, c: 3 };
 * console.log(hasAtLeastOneKeyInObject(obj, ['a'])); // true
 * console.log(hasAtLeastOneKeyInObject(obj, ['d'])); // false
 * ```
 */
export function hasAtLeastOneKeyInObject<T extends object, K extends PropertyKey>(obj: T, keys: readonly K[]): obj is T & { [key in K]-?: unknown } {
	return !isNullish(obj) && keys.some((key) => Object.hasOwn(obj, key));
}
