import { isNullOrUndefinedOrZero } from './isNullOrUndefinedOrZero';
import type { Nullish } from './types';

/**
 * Checks whether a value is not `null` nor `undefined` nor `0`.
 * This can be used in {@link Array.filter} to remove `null`, `undefined` from the array type
 * @param value The value to verify that is neither `null`, `undefined` nor `0`
 * @returns A boolean that is `true` if the value is neither `null`, `undefined` nor `0`, false otherwise.
 * @example
 * ```typescript
 * // TypeScript Type: (string | number | undefined | null)[]
 * const someArray = ['one', 'two', undefined, null, 0, 1];
 *
 * // TypeScript Type: (string | number)[]
 * const filteredArray = someArray.filter(filterNullAndUndefinedAndZero);
 * // Result: ['one', 'two', 1]
 * ```
 */
export function filterNullAndUndefinedAndZero<TValue>(value: TValue | Nullish | 0): value is TValue {
	return !isNullOrUndefinedOrZero(value);
}

export { filterNullAndUndefinedAndZero as filterNullishAndZero };

export {
	/**
	 * @deprecated Will be removed in the next major version, switch to either `filterNullishAndZero` or {@link filterNullAndUndefinedAndZero}.
	 */
	filterNullAndUndefinedAndZero as filterNullishOrZero
};
