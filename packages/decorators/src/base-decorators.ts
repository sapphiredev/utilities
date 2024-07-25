import { cast, type NonNullObject } from '@sapphire/utilities';

/**
 * Decorator that sets the enumerable property of a class field to the desired value.
 * @param value Whether the property should be enumerable or not
 *
 * @remarks
 * - Please note that with legacy decorators there is a high chance that this will not work due to how legacy decorators
 * are implemented. It is recommended to use the modern ECMAScript decorators.
 */
export function Enumerable<ClzArgs extends NonNullObject>(value: boolean): EnumerableDecorator<ClzArgs> {
	return (target: ClzArgs | undefined, contextOrPropertyKey: (string | symbol) | ClassFieldDecoratorContext<ClzArgs, any>) => {
		if (target === undefined) {
			const typedContext = cast<ClassFieldDecoratorContext<ClzArgs, any>>(contextOrPropertyKey);
			typedContext.addInitializer(function decorate(this: ClzArgs) {
				Reflect.defineProperty(this, typedContext.name, {
					value: typedContext.access.get(this),
					enumerable: value,
					configurable: true,
					writable: true
				});
			});
		} else {
			const typedPropertyKey = cast<string | symbol>(contextOrPropertyKey);
			Reflect.defineProperty(target, typedPropertyKey, {
				enumerable: value,
				set(this: NonNullObject, fieldValue: unknown) {
					Reflect.defineProperty(this, typedPropertyKey, {
						configurable: true,
						enumerable: value,
						value: fieldValue,
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
 * The return type for {@link Enumerable}
 *
 * @param ClzArgs - The class constructor arguments
 */
export interface EnumerableDecorator<ClzArgs extends NonNullObject> {
	// Modern ECMAScript decorators
	(target: undefined, contextOrPropertyKey: ClassFieldDecoratorContext<ClzArgs, any>): void;

	// Legacy decorators
	(target: ClzArgs, propertyKey: string | symbol): void;
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
