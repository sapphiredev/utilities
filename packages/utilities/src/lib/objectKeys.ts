import type { NonNullObject } from './utilityTypes';

export function objectKeys<T extends NonNullObject>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[];
}
