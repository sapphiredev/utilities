import type { NonNullObject } from './utilityTypes';

export function objectEntries<T extends NonNullObject>(obj: T): T extends ArrayLike<any> ? [number, T[number]][] : [keyof T, T[keyof T]][] {
	return Object.entries(obj) as T extends ArrayLike<any> ? [number, T[number]][] : [keyof T, T[keyof T]][];
}
