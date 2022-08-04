import { Awaitable, isFunction } from './common/utils';
import { None, none as _none } from './Option/None';
import { Some, some as _some } from './Option/Some';

export * from './Option/IOption';
export * from './Option/OptionError';

/**
 * The union of the two variations of `Option`.
 * @typeparam T The value's type.
 */
export type Option<T> = Option.Some<T> | Option.None;

export namespace Option {
	export type Resolvable<T> = T | null | undefined | Option<T>;
	function resolve<T>(value: Resolvable<T>) {
		if (value === null || value === undefined) return none;
		if (is(value)) return value;
		return some(value);
	}

	export function is<T>(value: Option<T>): true;
	export function is(value: any): value is Option<unknown>;
	export function is(value: any) {
		return value instanceof None || value instanceof Some;
	}

	/**
	 * Creates an {@link Option} out of a value or callback.
	 * @typeparam T The result's type.
	 */
	export function from<T>(op: Resolvable<T> | (() => Resolvable<T>)): Option<T> {
		if (!isFunction(op)) return resolve(op);

		try {
			return resolve(op());
		} catch {
			return none;
		}
	}

	/**
	 * Creates an {@link Option} out of a value or callback.
	 * @typeparam T The result's type.
	 */
	export async function fromAsync<T>(op: Awaitable<Resolvable<T>> | (() => Awaitable<Resolvable<T>>)): Promise<Option<T>> {
		try {
			return resolve(await (isFunction(op) ? op() : op));
		} catch {
			return none;
		}
	}

	export const none = _none;
	export const some = _some;

	export type Some<T> = import('./Option/Some').Some<T>;
	export type None = import('./Option/None').None;

	export type UnwrapSome<T extends Option<any>> = T extends Some<infer S> ? S : never;
}
