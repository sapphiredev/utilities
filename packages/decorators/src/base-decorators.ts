import { createMethodDecorator } from './utils';

/**
 * Decorator that sets the enumerable property of a class field to the desired value.
 * @param value Whether the property should be enumerable or not
 */
export function Enumerable(value: boolean) {
	return (target: object, key: string) => {
		Reflect.defineProperty(target, key, {
			enumerable: value,
			set(this: unknown, val: unknown) {
				Reflect.defineProperty(this as object, key, {
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
 * Decorator that sets the enumerable property of a class method to the desired value.
 * @param value Whether the method should be enumerable or not
 */
export function EnumerableMethod(value: boolean) {
	return createMethodDecorator((_target, _propertyKey, descriptor) => {
		descriptor.enumerable = value;
	});
}
