import { assertFunction } from '../shared/_assertFunction';
import { fromAsync, type AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Determines if the elements of both iterators are equal with respect to the specified equality function.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 * @returns Whether the two iterators are equal with respect to the specified equality function.
 *
 * @example
 * ```typescript
 * import { equalByAsync } from '@sapphire/iterator-utilities';
 *
 * const x = [1, 2, 3, 4];
 * const y = [1, 4, 9, 16];
 *
 * console.log(await equalByAsync(x, y, (a, b) => a * a === b));
 * // Output: true
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function equalByAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	other: AsyncIterableResolvable<ElementType>,
	callbackFn: (x: ElementType, y: ElementType) => boolean
): Promise<boolean> {
	callbackFn = assertFunction(callbackFn);

	const iterator1 = fromAsync(other);

	for await (const value0 of toAsyncIterableIterator(iterable)) {
		const result1 = await iterator1.next();
		if (result1.done || !callbackFn(value0, result1.value)) return false;
	}

	return (await iterator1.next()).done === true;
}

export { equalByAsync as eqByAsync };
