import type { Container, Piece } from '@sapphire/pieces';
import type { Ctor } from '@sapphire/utilities';

/**
 * The function precondition interface.
 */
export interface FunctionPrecondition<Args extends unknown[]> {
	/**
	 * The arguments passed to the function or class' method.
	 */
	(...args: Args): boolean;
}

/**
 * The method that is called in `createMethodDecorator` for modifying the source method.
 */
export type MethodDecoratorModifier = () => void;

/**
 * The fallback interface, this is called when the function precondition returns or resolves with a falsy value.
 */
export interface FunctionFallback<This, Args extends unknown[], Return = unknown> {
	/**
	 * The arguments passed to the function or class' method.
	 */
	(this: This, ...args: Args): Return;
}

/**
 * A class method that is decorated.
 */
export type ClassMethodDecoratorTarget<This, Args extends unknown[], Return> = (this: This, ...args: Args) => Return;

/**
 * A stricter context for {@link ClassMethodDecoratorContext} that includes {@link ClassMethodDecoratorTarget}
 */
export type StrictClassMethodDecoratorContext<This, Args extends unknown[], Return> = ClassMethodDecoratorContext<
	This,
	ClassMethodDecoratorTarget<This, Args, Return>
>;

/**
 * The return type for class method decorators that is strictly typed
 */
export type ClassMethodDecorator<This, Args extends unknown[], Return> = (
	target: ClassMethodDecoratorTarget<This, Args, Return>,
	context: StrictClassMethodDecoratorContext<This, Args, Return>
) => ClassMethodDecoratorTarget<This, Args, Return>;

/**
 * The cache for enumerable entries for the `Enumerable` decorator.
 */
export interface EnumerableCacheEntry {
	fieldName: string | symbol;
	shouldBeEnumerable: boolean;
}

/**
 * A generic interface for classes that have a `name` property.
 * This is a stand-in for `typeof Piece` because its other properties are not necessary.
 */
export type ClassWithName = Pick<Piece, 'name'>;

/**
 * The constructor of the {@link Piece} class using {@link Ctor} and {@link ConstructorParameters}
 */
export type PieceConstructor = Ctor<ConstructorParameters<typeof Piece>>;

/**
 * The return type for the `Enumerable` decorator when using on a class field
 * @param This a reference to the `this` context of the decorated class. This should be added automatically by TypeScript.
 * @param Value a reference to the current value being decorated. This should be added automatically by TypeScript.
 */
export type EnumerableFieldReturnType<This, Value> = (
	_value: undefined,
	context: ClassFieldDecoratorContext<This, Value>
) => (this: ClassWithName, initialValue: Value) => Value;

/**
 * A synthetic type of a class decorator return value
 * @param Target The type for the decorated class.
 * @param Context The type for the *decorator context*.
 * A context type based on the kind of decoration type, intersected with an object type consisting
 * of the target's *`name`, `placement`, and `visibility`*.
 * @param Return The allowed type for the decorator's return value. Note that any decorator may return `void` / `undefined`.
 * For a class decorator, this will be {@link T}.
 *
 */
export type SyntheticClassDecoratorReturn<Target extends PieceConstructor, Context = ClassDecoratorContext, Return = Target> = (
	target: Target,
	context: Context
) => Return | undefined;

/**
 * The parameters for the `ApplyOptions` decorator when used with a callback function
 */
export interface ApplyOptionsCallbackParameters {
	/** The {@link Container} of Sapphire */
	container: Container;
	/** The context of the current piece */
	context: Piece.Context;
}
