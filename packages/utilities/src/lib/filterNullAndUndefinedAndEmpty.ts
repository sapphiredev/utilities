import { isNullOrUndefinedOrEmpty } from './isNullOrUndefinedOrEmpty';
import type { Nullish } from './types';

/**
 * Checks whether a value is not `null` nor `undefined` nor `''` (empty string).
 * This can be used in {@link Array.filter} to remove `null`, `undefined` from the array type
 * @param value The value to verify that is neither `null`, `undefined` nor `''` (empty string)
 * @returns A boolean that is `true` if the value is neither `null`, `undefined` nor `''` (empty string), false otherwise.
 * @example
 * ```typescript
 * // TypeScript Type: (string | undefined | null)[]
 * const someArray = ['one', 'two', undefined, null, ''];
 *
 * // TypeScript Type: string[]
 * const filteredArray = someArray.filter(filterNullAndUndefinedAndEmpty);
 * // Result: ['one', 'two']
 * ```
 */
export function filterNullAndUndefinedAndEmpty<TValue>(value: TValue | Nullish | ''): value is TValue {
	return !isNullOrUndefinedOrEmpty(value);
}

export { filterNullAndUndefinedAndEmpty as filterNullishAndEmpty };

export {
	/**
	 * @deprecated Will be removed in the next major version, switch to either `filterNullishAndEmpty` or {@link filterNullAndUndefinedAndEmpty}.
	 */
	filterNullAndUndefinedAndEmpty as filterNullishOrEmpty
};
