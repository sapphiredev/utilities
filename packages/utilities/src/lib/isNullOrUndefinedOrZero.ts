import { isNullish } from './isNullOrUndefined.js';
import type { Nullish } from './types.js';

/**
 * Checks whether or not a value is `null`, `undefined` or `0`
 * @param value The value to check
 */
export function isNullOrUndefinedOrZero(value: unknown): value is Nullish | 0 {
	return value === 0 || isNullish(value);
}

export { isNullOrUndefinedOrZero as isNullishOrZero };
