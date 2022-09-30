import type { NonNullObject } from './utilityTypes';

export function objectValues<T extends NonNullObject>(obj: T): T[keyof T][] {
	return Object.values(obj) as T[keyof T][];
}
