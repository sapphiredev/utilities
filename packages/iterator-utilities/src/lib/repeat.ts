import { assertNotNegative } from './shared/assertNotNegative';
import { makeIterableIterator } from './shared/makeIterableIterator';
import { toNumberOrThrow } from './shared/toNumberOrThrow';

/**
 * Generates an iterator that contains one repeated value.
 *
 * @param value The value to be repeated.
 * @param count The number of times to repeat the value.
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
