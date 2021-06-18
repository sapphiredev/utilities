import { isNullOrUndefined } from './isNullOrUndefined';
import type { Nullish } from './utilityTypes';

/**
 * Checks whether or not a value is `null`, `undefined` or `0`
 * @param value The value to check
 */
export function isNullOrUndefinedOrZero(value: unknown): value is Nullish | 0 {
	return value === 0 || isNullOrUndefined(value);
}
