import type { NonNullObject } from '@sapphire/utilities';
import { createMethodDecorator } from './utils';

/**
 * Decorator that sets the enumerable property of a class field to the desired value.
 * @param value Whether the property should be enumerable or not
 */
export function Enumerable(value: boolean) {
	return (target: unknown, key: string) => {
		Reflect.defineProperty(target as NonNullObject, key, {
			enumerable: value,
			set(this: unknown, val: unknown) {
				Reflect.defineProperty(this as NonNullObject, key, {
					configurable: true,
					enumerable: value,
					value: val,
					writable: true
				});
			}
		});
	};
}

/**
 * Decorator that sets the enumerable property of a class field to the desired value.
 * @param value Whether the property should be enumerable or not
 * @deprecated Use `@Enumerable` instead.
 * The lowercased decorator will be removed in the next major version of `@sapphire/decorators`
 */
export const enumerable = Enumerable;

/**
 * Decorator that sets the enumerable property of a class method to the desired value.
 * @param value Whether the method should be enumerable or not
 */
export function EnumerableMethod(value: boolean) {
	return createMethodDecorator((_target, _propertyKey, descriptor) => {
		descriptor.enumerable = value;
	});
}

/**
 * Decorator that sets the enumerable property of a class method to the desired value.
 * @param value Whether the method should be enumerable or not
 * @deprecated Use `@EnumerableMethod` instead.
 * The lowercased decorator will be removed in the next major version of `@sapphire/decorators`
 */
export const enumerableMethod = EnumerableMethod;
