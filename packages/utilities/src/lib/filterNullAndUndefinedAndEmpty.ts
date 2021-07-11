import { isNullOrUndefinedOrEmpty } from './isNullOrUndefinedOrEmpty';
import type { Nullish } from './utilityTypes';

export function filterNullAndUndefinedAndEmpty<TValue>(value: TValue | Nullish | ''): value is TValue {
	return !isNullOrUndefinedOrEmpty(value);
}
