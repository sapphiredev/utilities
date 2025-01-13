import type { IterableResolvable, IterableResolved } from '../sync/from';

/**
 * Resolves an iterable from an iterable or iterator-like object.
 *
 * @param value The value to convert to an iterator.
 *
 * @example
 * ```typescript
 * import { fromAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = fromAsync([1, 2, 3, 4, 5]);
 * for await (const element of iterable) {
 * 	console.log(element);
 * 	// Output: 1, 2, 3, 4, 5
 * }
 * ```
 */
export function fromAsync<const ElementType, const ResolvableType extends AsyncIterableResolvable<ElementType>>(
	value: ResolvableType
): AsyncIterableResolved<ResolvableType>;
export function fromAsync(value: any) {
	if (typeof value === 'object' && value !== null) {
		if (typeof value[Symbol.asyncIterator] === 'function') {
			return value[Symbol.asyncIterator]();
		}

		if (typeof value[Symbol.iterator] === 'function') {
			return value[Symbol.iterator]();
		}

		if (typeof value.next === 'function') {
			return value;
		}
	}

	if (typeof value === 'string') {
		return value[Symbol.iterator]();
	}

	throw new TypeError(`${String(value)} cannot be converted to an async iterable`);
}

export type AsyncIterableResolvable<ElementType> =
	| AsyncIterable<ElementType>
	| AsyncIterator<ElementType>
	| AsyncIterableIterator<ElementType>
	| IterableResolvable<ElementType>;

export type AsyncIterableResolved<Type> =
	Type extends AsyncIterableIterator<infer Output>
		? AsyncIterableIterator<Output>
		: Type extends AsyncIterable<infer Output>
			? AsyncIterator<Output>
			: Type extends AsyncIterator<infer Output>
				? AsyncIterator<Output>
				: IterableResolved<Type>;
