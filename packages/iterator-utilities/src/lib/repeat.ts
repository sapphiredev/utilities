import { assertNotNegative } from './shared/assertNotNegative';
import { makeIterableIterator } from './shared/makeIterableIterator';
import { toNumberOrThrow } from './shared/toNumberOrThrow';

/**
 * Creates an iterable that repeats the input iterable `count` times.
 *
 * @param value The value to be repeated.
 * @param count The number of times to repeat the value.
 *
 * @example
 * ```typescript
 * import { repeat } from '@sapphire/iterator-utilities';
 *
 * const iterator = repeat('Hello, world!', 3);
 * console.log([...iterator]);
 * // Output: ['Hello, world!', 'Hello, world!', 'Hello, world!']
 * ```
 *
 * @remarks This function does not clone `value`, it will be repeated as a reference.
 */
export function repeat<const ElementType>(value: ElementType, count: number): IterableIterator<ElementType> {
	count = assertNotNegative(toNumberOrThrow(count), count);

	let i = 0;
	return makeIterableIterator<ElementType>(() =>
		i >= count //
			? { done: true, value: undefined }
			: (i++, { done: false, value })
	);
}
