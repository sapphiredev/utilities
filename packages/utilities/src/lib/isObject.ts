import type { Constructor } from './utilityTypes';

/**
 * Verify if the input is an object literal (or class).
 * @param input The object to verify
 * @param constructorType The type of the constructor of the object. Use this if you want a `class` of your choosing to pass the check as well.
 */
export function isObject<T extends Constructor<unknown> = Constructor<ObjectConstructor>>(
	input: unknown,
	constructorType?: T
): input is Record<PropertyKey, unknown> | object {
	return typeof input === 'object' && input ? input.constructor === (constructorType ?? Object) : false;
}
