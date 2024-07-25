import { cast, type NonNullObject } from '@sapphire/utilities';
import { LegacyDecoratorsOnlyError } from './utils';

/**
 * Decorator that sets the enumerable property of a class field to the desired value.
 * @param value Whether the property should be enumerable or not
 */
export function Enumerable(value: boolean) {
	// @ts-expect-error asd
	return (target: unknown, key: string, ...args: any[]) => {
		// Modern ECMAScript decorators do not support setting the enumerable property of a field
		if (target === undefined) {
			throw new LegacyDecoratorsOnlyError('Enumerable(boolean)');
		} else {
			// Legacy decorators
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
		}
	};
}

/**
 * Decorator that sets the enumerable property of a class method to the desired value.
 *
 * @param value - Whether the method should be enumerable or not. By default class methods are not enumerable.
 *
 * @remarks
 * - Please note that with legacy decorators there is a high chance that this will not work due to how legacy decorators
 * are implemented. It is recommended to use the modern ECMAScript decorators.
 */
export function EnumerableMethod<ClzArgs extends NonNullObject>(value: boolean): EnumerableMethodDecorator<ClzArgs> {
	return <Args = unknown[], ReturnType = unknown>(
		target: ((...args: Args[]) => ReturnType) | unknown,
		contextOrPropertyKey: (string | symbol) | ClassMethodDecoratorContext<ClzArgs, any>,
		descriptor?: TypedPropertyDescriptor<(...args: Args[]) => ReturnType>
	): void => {
		if (descriptor === undefined) {
			const typedContext = cast<ClassMethodDecoratorContext<ClzArgs, any>>(contextOrPropertyKey);
			typedContext.addInitializer(function decorate(this: ClzArgs) {
				Reflect.defineProperty(this, typedContext.name, {
					value: target,
					enumerable: value,
					configurable: true,
					writable: true
				});
			});
		} else {
			Reflect.defineProperty(target as ClzArgs, contextOrPropertyKey as string | symbol, {
				value: descriptor.value,
				enumerable: value,
				configurable: true,
				writable: true
			});
		}
	};
}

/**
 * The return type for {@link EnumerableMethod}
 *
 * @param ClzArgs - The class constructor arguments
 */
export interface EnumerableMethodDecorator<ClzArgs extends NonNullObject> {
	// Modern ECMAScript decorators
	<Args extends any[], ReturnType = unknown>(
		target: (...args: Args[]) => ReturnType,
		context: ClassMethodDecoratorContext<ClzArgs, any>,
		descriptor?: undefined
	): void;

	// Legacy decorators
	<Args extends any[], ReturnType = unknown>(
		target: unknown,
		propertyKey: string | symbol,
		descriptor: TypedPropertyDescriptor<(...args: Args[]) => ReturnType>
	): void;
}
