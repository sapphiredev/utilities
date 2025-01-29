export function objectKeys<T extends object>(obj: T): T extends ArrayLike<any> ? `${number}`[] : (keyof T)[] {
	return Object.keys(obj) as T extends ArrayLike<any> ? `${number}`[] : (keyof T)[];
}
