export function objectEntries<T extends object>(obj: T): T extends ArrayLike<infer Values> ? [`${number}`, Values][] : [keyof T, T[keyof T]][] {
	return Object.entries(obj) as T extends ArrayLike<infer Values> ? [`${number}`, Values][] : [keyof T, T[keyof T]][];
}
