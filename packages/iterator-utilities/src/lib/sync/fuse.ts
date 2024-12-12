import { makeIterableIterator } from '../shared/_makeIterableIterator';
import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

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
 * import { fuse } from '@sapphire/iterator-utilities';
 *
 * const iterable = {
 *   state: 0,
 *   next() {
 *     const value = this.state;
 *     this.state += 1;
 *
 *     return value % 2 === 0 //
 *       ? { done: false, value }
 *       : { done: true, value: undefined };
 *   }
 * };
 *
 * // We can see our iterator going back and forth
 * assert(iterable.next(), { done: false, value: 0 });
 * assert(iterable.next(), { done: true, value: undefined });
 * assert(iterable.next(), { done: false, value: 2 });
 * assert(iterable.next(), { done: true, value: undefined });
 *
 * // However, once we fuse it...
 * const fused = fuse(iterable);
 *
 * assert(fused.next(), { done: false, value: 4 });
 * assert(fused.next(), { done: true, value: undefined });
 *
 * // It will always return a `done` result after the first time
 * assert(fused.next(), { done: true, value: undefined });
 * assert(fused.next(), { done: true, value: undefined });
 * assert(fused.next(), { done: true, value: undefined });
 * ```
 */
export function fuse<const ElementType>(iterable: IterableResolvable<ElementType>): IterableIterator<ElementType> {
	let ended = false;
	const iterator = toIterableIterator(iterable);
	return makeIterableIterator(() => {
		if (ended) {
			return { done: true, value: undefined };
		}

		const result = iterator.next();
		if (result.done) {
			ended = true;
		}

		return result;
	});
}
