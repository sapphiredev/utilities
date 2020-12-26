/**
 * The inhibitor interface.
 */
export interface FunctionPrecondition {
	/**
	 * The arguments passed to the function or class' method.
	 */
	(...args: any[]): boolean | Promise<boolean>;
}

/**
 * The fallback interface, this is called when the inhibitor returns or resolves with a falsy value.
 */
export interface FunctionFallback {
	/**
	 * The arguments passed to the function or class' method.
	 */
	(...args: any[]): unknown;
}

/**
 * Utility to make a method decorator with lighter syntax and inferred types.
 *
 * ```ts
 * // Enumerable function
 *	function enumerableMethod(value: boolean) {
 *		return createMethodDecorator((_target, _propertyKey, descriptor) => {
 *			descriptor.enumerable = value;
 *		});
 *	}
 * ```
 * @param fn The method to decorate
 */
export function createMethodDecorator(fn: MethodDecorator): MethodDecorator {
	return fn;
}

/**
 * Utility to make a class decorator with lighter syntax and inferred types.
 * @param fn The class to decorate
 * @see {@link ApplyOptions}
 */
export function createClassDecorator<TFunction extends (...args: any[]) => void>(fn: TFunction): ClassDecorator {
	return fn;
}

/**
 * Utility to make function inhibitors.
 *
 * ```ts
 *	// No fallback (returns undefined)
 *	function requiresPermission(value: number) {
 *		return createFunctionInhibitor((message: KlasaMessage) =>
 *			message.hasAtLeastPermissionLevel(value));
 *	}
 *
 *	// With fallback
 *	function requiresPermission(
 *		value: number,
 *		fallback: () => unknown = () => undefined
 *	) {
 *		return createFunctionInhibitor((message: KlasaMessage) =>
 *			message.hasAtLeastPermissionLevel(value), fallback);
 *	}
 * ```
 * @since 1.0.0
 * @param inhibitor The function that defines whether or not the function should be run, returning the returned value from fallback
 * @param fallback The fallback value that defines what the method should return in case the inhibitor fails
 */
export function createFunctionPrecondition(inhibitor: FunctionPrecondition, fallback: FunctionFallback = (): void => undefined): MethodDecorator {
	return createMethodDecorator((_target, _propertyKey, descriptor) => {
		const method = descriptor.value;
		if (!method) throw new Error('Function inhibitors require a [[value]].');
		if (typeof method !== 'function') throw new Error('Function inhibitors can only be applied to functions.');

		descriptor.value = (async function descriptorValue(this: (...args: any[]) => any, ...args: any[]) {
			const canRun = await inhibitor(...args);
			return canRun ? method.call(this, ...args) : fallback.call(this, ...args);
		} as unknown) as undefined;
	});
}

/**
 * Creates a new proxy to efficiently add properties to class without creating subclasses
 * @param target The constructor of the class to modify
 * @param handler The handler function to modify the constructor behavior for the target
 * @hidden
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function createProxy<T extends object>(target: T, handler: Omit<ProxyHandler<T>, 'get'>): T {
	return new Proxy(target, {
		...handler,
		get: (target, property) => {
			const value = Reflect.get(target, property);
			return typeof value === 'function' ? (...args: readonly unknown[]) => value.apply(target, args) : value;
		}
	});
}
