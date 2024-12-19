import { makeAsyncIterableIterator } from '../shared/_makeAsyncIterableIterator';
import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Creates an iterator which ends after the first `done` result from the original iterator.
 *
 * After an iterator returns a `done` result, future calls may or may not yield additional results again. This function
 * adapts an iterator, ensuring that after a `done` result is given, it will always return a `done` result forever.
 *
 * @param iterable An iterator to fuse.
 *
 * @example
 * ```typescript
 * import { fuseAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = {
 *   state: 0,
 *   next() {
 *     const value = this.state;
 *     this.state += 1;
 *
 *     const result = value % 2 === 0 //
 *       ? { done: false, value }
 *       : { done: true, value: undefined };
 *     return Promise.resolve(result);
 *   }
 * };
 *
 * // We can see our iterator going back and forth
 * assert(await iterable.next(), { done: false, value: 0 });
 * assert(await iterable.next(), { done: true, value: undefined });
 * assert(await iterable.next(), { done: false, value: 2 });
 * assert(await iterable.next(), { done: true, value: undefined });
 *
 * // However, once we fuse it...
 * const fused = fuseAsync(iterable);
 *
 * assert(await fused.next(), { done: false, value: 4 });
 * assert(await fused.next(), { done: true, value: undefined });
 *
 * // It will always return a `done` result after the first time
 * assert(await fused.next(), { done: true, value: undefined });
 * assert(await fused.next(), { done: true, value: undefined });
 * assert(await fused.next(), { done: true, value: undefined });
 * ```
 */
export function fuseAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>): AsyncIterableIterator<ElementType> {
	let ended = false;
	const iterator = toAsyncIterableIterator(iterable);
	return makeAsyncIterableIterator(async () => {
		if (ended) {
			return { done: true, value: undefined };
		}

		const result = await iterator.next();
		if (result.done) {
			ended = true;
		}

		return result;
	});
}
