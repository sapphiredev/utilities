import { isFunction, type Awaitable } from './common/utils.js';
import { createNone, OptionNone } from './Option/None.js';
import { createSome, OptionSome } from './Option/Some.js';

export type * from './Option/IOption.js';
export * from './Option/OptionError.js';
export { createSome as some, createNone as none, type OptionNone as None, type OptionSome as Some };

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
		return value instanceof OptionNone || value instanceof OptionSome;
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

	/**
	 * Creates a {@link Some} that is the combination of all collected {@link Some} values as an array, or the first
	 * {@link None} encountered.
	 * @param options An array of {@link Option}s.
	 * @returns A new {@link Option}.
	 */
	export function all<T extends readonly Option<any>[]>(options: [...T]): Option<UnwrapSomeArray<T>> {
		const values: unknown[] = [];
		for (const option of options) {
			if (option.isNone()) {
				return option;
			}

			values.push(option.unwrap());
		}

		return some(values as UnwrapSomeArray<T>);
	}

	/**
	 * Returns the first encountered {@link Some}, or a {@link None} if none was found.
	 * @param options An array of {@link Option}s.
	 * @returns A new {@link Option}.
	 */
	export function any<T extends readonly Option<any>[]>(options: [...T]): Option<UnwrapSomeArray<T>[number]> {
		for (const result of options) {
			if (result.isSome()) {
				return result;
			}
		}

		return none;
	}

	export const none = createNone;
	export const some = createSome;

	export type Some<T> = OptionSome<T>;
	export type None = OptionNone;

	export type UnwrapSome<T extends Option<any>> = T extends Some<infer S> ? S : never;
	export type UnwrapSomeArray<T extends readonly Option<any>[] | []> = {
		-readonly [P in keyof T]: UnwrapSome<T[P]>;
	};
}
