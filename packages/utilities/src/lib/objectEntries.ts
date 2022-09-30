import type { NonNullObject } from './utilityTypes';

export function objectEntries<T extends NonNullObject>(obj: T): [keyof T, T[keyof T]][] {
	return Object.entries(obj) as [keyof T, T[keyof T]][];
}
