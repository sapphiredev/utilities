import { isNullish } from './isNullOrUndefined';
import type { Nullish } from './types';

/**
 * Checks whether or not a value is `null`, `undefined` or `''`, `[]`
 * @param value The value to check
 */
export function isNullOrUndefinedOrEmpty(value: unknown): value is Nullish | '' {
	return isNullish(value) || (value as string | unknown[]).length === 0;
}

export { isNullOrUndefinedOrEmpty as isNullishOrEmpty };
