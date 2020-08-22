/* eslint-disable @typescript-eslint/ban-types */
import { isObject } from './isObject';

/**
 * Merges two objects
 * @param objTarget The object to be merged
 * @param objSource The object to merge
 */
export function mergeObjects<A extends object, B extends object>(objTarget: A, objSource: Readonly<B>): A & B {
	for (const [key, value] of Object.entries(objSource)) {
		const targetValue = Reflect.get(objTarget, key);
		if (isObject(value)) {
			Reflect.set(objTarget, key, isObject(targetValue) ? mergeObjects(targetValue, value as object) : value);
		} else if (!isObject(targetValue)) {
			Reflect.set(objTarget, key, value);
		}
	}

	return objTarget as A & B;
}
