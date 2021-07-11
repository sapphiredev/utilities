import { isNullOrUndefined } from './isNullOrUndefined';
import type { Nullish } from './utilityTypes';

export function filterNullAndUndefined<TValue>(value: TValue | Nullish): value is TValue {
	return !isNullOrUndefined(value);
}
