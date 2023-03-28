import type { Piece } from '@sapphire/framework';
import type { ClassWithName, EnumerableCacheEntry, EnumerableFieldReturnType, PieceConstructor, SyntheticClassDecoratorReturn } from './types';

const enumerableCache: Map<string, EnumerableCacheEntry[]> = new Map();

/**
 * Decorator that reads {@link enumerableCache} for the decorated class and sets the enumerable property of any fields decorated with {@link Enumerable}.
 *
 * Without applying this decorator on the class the field {@link Enumerable} decorators will have no effect!
 * @param value Whether the property should be enumerable or not
 */
export function Enumerable<Class extends PieceConstructor>(): SyntheticClassDecoratorReturn<Class>;
/**
 * Decorator that queues the decorated field for being marked as `enumerable` or not based on the parameter value.
 * Apply to the class by adding {@link Enumerable} on the class
 *
 * Without applying this decorator on the class {@link Enumerable} decorators on the fields will have no effect!
 *
 * @param value Whether the property should be enumerable or not
 */
export function Enumerable<This, Value>(enumerable: boolean): EnumerableFieldReturnType<This, Value>;
export function Enumerable<ThisOrClass, Value>(enumerable?: boolean) {
	if (typeof enumerable === 'boolean') {
		return (_value: undefined, context: ClassFieldDecoratorContext<ThisOrClass, Value>) =>
			function replacementField(this: ClassWithName, initialValue: Value): Value {
				const classFields = enumerableCache.get(this.name);

				if (classFields) {
					classFields.push({
						fieldName: context.name,
						shouldBeEnumerable: enumerable ?? true
					});
				} else {
					enumerableCache.set(this.name, [
						{
							fieldName: context.name,
							shouldBeEnumerable: enumerable ?? true
						}
					]);
				}

				return initialValue;
			};
	}

	return (DecoratedClass: PieceConstructor, _context: ClassDecoratorContext) =>
		function replacementClass(...args: ConstructorParameters<typeof Piece>) {
			const classInstance = new DecoratedClass(...args);

			for (const cacheEntry of (enumerableCache.get(classInstance.name) ?? []).values()) {
				Object.defineProperty(classInstance, cacheEntry.fieldName, {
					enumerable: cacheEntry.shouldBeEnumerable
				});
			}

			return classInstance;
		};
}
