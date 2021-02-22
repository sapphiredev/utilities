import type { Piece, PieceContext, PieceOptions } from '@sapphire/framework';
import { createClassDecorator, createMethodDecorator, createProxy } from './utils';

type Arr = readonly any[];
type Ctor<A extends Arr = readonly any[], R = any> = new (...args: A) => R;

/**
 * Decorator function that applies given options to any Sapphire piece
 * @example
 * ```ts
 *	ApplyOptions<CommandOptions>({
 *		name: 'test',
 *		cooldown: 10
 *	})
 *	export default class extends Command {}
 * ```
 * @param options The options to pass to the piece constructor
 */
export function ApplyOptions<T extends PieceOptions>(optionsOrFn: T | ((context: PieceContext) => T)): ClassDecorator {
	return createClassDecorator((target: Ctor<ConstructorParameters<typeof Piece>, Piece>) =>
		createProxy(target, {
			construct: (ctor, [context, baseOptions = {}]) =>
				new ctor(context, {
					...baseOptions,
					...(typeof optionsOrFn === 'function' ? optionsOrFn(context) : optionsOrFn)
				})
		})
	);
}

/**
 * Decorator that sets the enumerable property of a class field to the desired value.
 * @param value Whether the property should be enumerable or not
 */
export function enumerable(value: boolean) {
	return (target: unknown, key: string) => {
		// eslint-disable-next-line @typescript-eslint/ban-types
		Reflect.defineProperty(target as object, key, {
			enumerable: value,
			set(this: unknown, val: unknown) {
				// eslint-disable-next-line @typescript-eslint/ban-types
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
 * @param value Whether the metthod should be enumerable or not
 */
export function enumerableMethod(value: boolean) {
	return createMethodDecorator((_target, _propertyKey, descriptor) => {
		descriptor.enumerable = value;
	});
}
