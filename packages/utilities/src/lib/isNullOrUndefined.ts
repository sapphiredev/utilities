import type { Nullish } from './utilityTypes';

/**
 * Checks whether or not a value is `null` or `undefined`
 * @param value The value to check
 */
export function isNullOrUndefined(value: unknown): value is Nullish {
	return value === undefined || value === null;
}
