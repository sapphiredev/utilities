import { isNullOrUndefinedOrZero } from './isNullOrUndefinedOrZero';
import type { Nullish } from './utilityTypes';

export function filterNullAndUndefinedAndZero<TValue>(value: TValue | Nullish | 0): value is TValue {
	return !isNullOrUndefinedOrZero(value);
}
