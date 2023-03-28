import type {
	ClassMethodDecoratorTarget,
	FunctionFallback,
	FunctionPrecondition,
	MethodDecoratorModifier,
	StrictClassMethodDecoratorContext
} from './types';

/**
 * Utility to make a class method decorator with lighter syntax.
 *
 * @param target The method to decorate
 * @param context The context of the method
 * @param value Whether the method should be enumerable or not
 *
 * @example
 * ```typescript
 * export function MyDecorator<This, Args extends unknown[], Return>(myArgs: unknown): ClassMethodDecorator<This, Args, Return> {
 *   return (target: ClassMethodDecoratorTarget<This, Args, Return>, context: StrictClassMethodDecoratorContext<This, Args, Return>) =>
 *     createMethodDecorator(target, () => {
 *       // myModifyingCodeHere
 *     });
 * }
 * ```
 */
export function createMethodDecorator<This, Args extends unknown[], Return>(
	target: ClassMethodDecoratorTarget<This, Args, Return>,
	methodModifier: MethodDecoratorModifier
): ClassMethodDecoratorTarget<This, Args, Return> {
	methodModifier();

	return function replacementMethod(this: This, ...args: Args) {
		return target.call(this, ...args);
	};
}

/**
 * Utility to make function preconditions.
 *
 * ```typescript
 * // No fallback (returns undefined)
 * function requireGuild(value: number) {
 *   return createFunctionPrecondition((message: Message) =>
 *     message.guild !== null
 *   );
 * }
 *
 * // With fallback
 * function requireGuild(
 *   value: number,
 *   fallback: () => unknown = () => undefined
 * ) {
 *   return createFunctionPrecondition(
 *     (message: Message) => message.guild !== null,
 *     fallback
 *   );
 * }
 * ```
 * @since 1.0.0
 * @param target The method to decorate
 * @param _context The context of the method
 * @param precondition The function that defines whether or not the function should be run, returning the returned value from fallback
 * @param fallback The fallback value that defines what the method should return in case the precondition fails
 */
export function createFunctionPrecondition<This, Args extends unknown[], Return>(
	target: ClassMethodDecoratorTarget<This, Args, Return>,
	_context: StrictClassMethodDecoratorContext<This, Args, Return>,
	precondition: FunctionPrecondition<Args>,
	fallback: FunctionFallback<This, Args, Return> = (): Return => undefined as Return
): ClassMethodDecoratorTarget<This, Args, Return> {
	return function replacementMethod(this: This, ...args: Args): Return {
		const canRun = precondition(...args);
		return canRun ? target.call(this, ...args) : fallback.call(this, ...args);
	};
}
