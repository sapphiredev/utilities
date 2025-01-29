export function objectValues<T extends object>(obj: T): T extends ArrayLike<infer Values> ? Values[] : T[keyof T][] {
	return Object.values(obj) as T extends ArrayLike<infer Values> ? Values[] : T[keyof T][];
}
