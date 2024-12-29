import { assertFunction } from '../shared/_assertFunction';
import type { Awaitable } from '../shared/_types';
import { collectAsync } from './collect';
import { type AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Creates an iterable with the results of calling a provided function on each element of the input iterables as the function's parameters.
 *
 * @param iterable The iterable to map over.
 * @param callbackFn The callback function to apply to each element.
 * @returns An iterable iterator that yields the mapped elements.
 *
 * @example
 * ```typescript
 * import { starMapAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const values = [[1, 2], [3, 4], [5, 6]];
 * const iterable = starMapAsync(iterable, (a, b) => a + b);
 * console.log(await collectAsync(iterable));
 * // Output: [3, 7, 11]
 * ```
 *
 * @remarks
 *
 * While very similar to {@link map}, `starMap` takes an iterable of iterables (which can be an array of tuples) and
 * calls the function with each inner iterable's values as the function's parameters. {@link map} calls the function
 * with the value and the index by comparison.
 */
export async function* starMapAsync<const ElementType extends AsyncIterableResolvable<any>, const MappedType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (...args: AsyncStarMapParameters<ElementType>) => Awaitable<MappedType>
): AsyncIterableIterator<MappedType> {
	callbackFn = assertFunction(callbackFn);

	for await (const value of toAsyncIterableIterator(iterable)) {
		const args = (await collectAsync(value)) as AsyncStarMapParameters<ElementType>;
		yield callbackFn(...args);
	}
}

export type AsyncStarMapParameters<ElementType> = ElementType extends readonly [...infer ElementTypeEntry]
	? ElementTypeEntry
	: ElementType extends AsyncIterableResolvable<infer ElementType>
		? ElementType[]
		: never;
