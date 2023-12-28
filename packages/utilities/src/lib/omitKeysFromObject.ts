import { deepClone } from './deepClone';

/**
 * Clones the source object using {@link deepClone} then deletes the specified keys with {@link Reflect.deleteProperty}
 *
 * @template Object - The object type.
 * @template ObjectKeys - The keys of the object type.
 *
 * @param source - The input object.
 * @param keys - The keys to omit from the object.
 * @returns A new object without the specified keys.
 */
export function omitKeysFromObject<Object extends object, ObjectKeys extends keyof Object>(
	source: Object,
	...keys: readonly ObjectKeys[]
): Omit<Object, ObjectKeys> {
	const clone = deepClone(source);

	for (const key of keys) {
		Reflect.deleteProperty(clone, key);
	}

	return clone;
}
