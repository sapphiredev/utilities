import type { NonNullObject } from './types';

export function objectEntries<T extends NonNullObject>(obj: T): T extends ArrayLike<any> ? [`${number}`, T[number]][] : [keyof T, T[keyof T]][] {
	return Object.entries(obj) as T extends ArrayLike<infer Values> ? Values[] : [keyof T, T[keyof T]][];
}
