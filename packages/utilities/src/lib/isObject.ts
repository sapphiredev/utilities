import type { Constructor, NonNullObject } from './types';

/**
 * Verify if the input is an object literal (or class).
 * @param input The object to verify
 * @param constructorType The type of the constructor of the object. Use this if you want a `class` of your choosing to pass the check as well.
 */
export function isObject(input: unknown, constructorType?: ObjectConstructor): input is NonNullObject;
export function isObject<T extends Constructor<unknown>>(input: unknown, constructorType: T): input is InstanceType<T>;
export function isObject<T extends Constructor<unknown> = ObjectConstructor>(input: unknown, constructorType?: T): input is NonNullObject {
	return typeof input === 'object' && input ? input.constructor === (constructorType ?? Object) : false;
}
