import { isObject } from './isObject.js';
import type { AnyObject } from './types.js';

/**
 * Convert an object to a tuple
 * @param obj The object to convert
 * @param prefix The prefix for the key
 */
export function objectToTuples<T>(obj: AnyObject<T>, prefix = ''): [keyof T, T[keyof T]][] {
	const entries: [keyof T, T[keyof T]][] = [];

	for (const [key, value] of Object.entries(obj)) {
		if (isObject(value)) {
			entries.push(...objectToTuples(value, `${prefix}${key}.`));
		} else {
			entries.push([`${prefix}${key}` as keyof T, value as T[keyof T]]);
		}
	}

	return entries;
}
