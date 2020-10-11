import { deepClone } from './deepClone';
import { isObject } from './isObject';
import type { DeepRequired } from './utilityTypes';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/ban-types
type NonNullObject = {};

/**
 * Deep merges 2 objects. Properties from the second parameter are applied to the first.
 * @remark `overwrites` is also mutated!
 * @remark If the value of a key in `overwrites` is `undefined` then the value of that same key in `base` is used instead!
 * @remark This is essentially `{ ...base, ...overwrites }` but recursively
 * @param base Base object
 * @param overwrites Overwrites to apply
 * @example
 * ```ts
 * const base = { a: 0, b: 1 };
 * const overwrites = {}; // will be { a: 0, b: 1 } after merge
 * mergeDefault(base, overwrites) // { a: 0, b: 1 }
 * ```
 * @example
 * ```ts
 * const base = { a: 0, b: 1 };
 * const overwrites = { a: 2, i: 3 };
 * mergeDefault(base, overwrites) // { a: 2, i: 3, b: 1 };
 * ```
 * @example
 * ```ts
 * const base = { a: 0, b: 1 };
 * const overwrites = { a: null };
 * mergeDefault(base, overwrites) // { a: null, b: 1 };
 * ```
 * @example
 * ```ts
 * const base = { a: 0, b: 1 };
 * const overwrites = { a: undefined };
 * mergeDefault(base, overwrites) // { a: 0, b: 1 };
 * ```
 * @example
 * ```ts
 * const base = { a: null };
 * const overwrites = { a: { b: 5 } };
 * mergeDefault(base, overwrites) // { a: { b: 5 } };
 * ```
 */
export function mergeDefault<A extends NonNullObject, B extends Partial<A>>(base: A, overwrites?: B): DeepRequired<A & B> {
	// If no overwrites are specified then deep clone the base
	if (!overwrites) return deepClone(base) as DeepRequired<A & B>;

	for (const [baseKey, baseValue] of Object.entries(base)) {
		const overwritesValueAtBaseKey = Reflect.get(overwrites, baseKey);

		if (typeof overwritesValueAtBaseKey === 'undefined') {
			Reflect.set(overwrites, baseKey, deepClone(baseValue));
		} else if (isObject(overwritesValueAtBaseKey)) {
			Reflect.set(overwrites, baseKey, mergeDefault((baseValue ?? {}) as NonNullObject, overwritesValueAtBaseKey));
		}
	}

	return overwrites as DeepRequired<A & B>;
}
