import { deepClone } from './deepClone';
import { isObject } from './isObject';

import type { DeepRequired } from './utilityTypes';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/ban-types
type NonNullObject = {};

/**
 * Sets default properties on an object that aren't already specified.
 * @since 0.5.0
 * @param def Default properties
 * @param given Object to assign defaults to
 */
export function mergeDefault<A extends NonNullObject, B extends Partial<A>>(defaults: A, given?: B): DeepRequired<A & B> {
	if (!given) return deepClone(defaults) as DeepRequired<A & B>;
	for (const [key, value] of Object.entries(defaults)) {
		const givenValue = Reflect.get(given, key);
		if (typeof givenValue === 'undefined') {
			Reflect.set(given, key, deepClone(value));
		} else if (isObject(givenValue)) {
			Reflect.set(given, key, mergeDefault(value as NonNullObject, givenValue));
		}
	}

	return given as DeepRequired<A & B>;
}
