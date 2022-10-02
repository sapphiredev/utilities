import type { NonNullObject } from './types';

export function objectKeys<T extends NonNullObject>(obj: T): T extends ArrayLike<any> ? `${number}`[] : (keyof T)[] {
	return Object.keys(obj) as T extends ArrayLike<infer Values> ? Values[] : (keyof T)[];
}
