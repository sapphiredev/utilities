import type { NonNullObject } from './utilityTypes';

export function objectValues<T extends NonNullObject>(obj: T): T extends ArrayLike<any> ? T[number][] : T[keyof T][] {
	return Object.values(obj) as T extends ArrayLike<any> ? T[number][] : T[keyof T][];
}
