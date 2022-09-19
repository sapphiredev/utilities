import { isNullish } from './isNullOrUndefined';
import type { Nullish } from './types';

/**
 * Checks whether a value is not `null` nor `undefined`.
 * This can be used in {@link Array.filter} to remove `null` and `undefined` from the array type
 * @param value The value to verify that is neither `null` nor `undefined`
 * @returns A boolean that is `true` if the value is neither `null` nor `undefined`, false otherwise.
 * @example
 * ```typescript
 * // TypeScript Type: (string | undefined | null)[]
 * const someArray = ['one', 'two', undefined, null, 'five'];
 *
 * // TypeScript Type: string[]
 * const filteredArray = someArray.filter(filterNullAndUndefined);
 * // Result: ['one', 'two', 'five']
 * ```
 */
export function filterNullAndUndefined<TValue>(value: TValue | Nullish): value is TValue {
	return !isNullish(value);
}

export { filterNullAndUndefined as filterNullish };
