import { assertFunction } from '../shared/_assertFunction';
import { makeIterableIterator } from '../shared/_makeIterableIterator';
import { from, type IterableResolvable } from './from';

/**
 * Does something with each element of an iterator, passing the value on.
 *
 * When using iterators, you'll often chain several of them together. While working on such code, you might want to
 * check out what's happening at various parts in the pipeline. To do that, insert a call to this function.
 *
 * It's more common for this function to be used as a debugging tool than to exist in your final code, but applications
 * may find it useful in certain situations when errors need to be logged before being discarded.
 *
 * @param iterable An iterator to inspect.
 *
 * @example
 * ```typescript
 * import { inspect } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 4, 2, 3];
 *
 * let iter = inspect(iter, (value) => console.log(`about to filter: ${value}`));
 * iter = filter(iterable, (value) => value % 2 === 0);
 * iter = inspect(iter, (value) => console.log(`made it through filter: ${value}`));
 *
 * const sum = reduce(iter, (acc, value) => acc + value, 0);
 * console.log(sum);
 *
 * // Output:
 * // about to filter: 1
 * // about to filter: 4
 * // made it through filter: 4
 * // about to filter: 2
 * // made it through filter: 2
 * // about to filter: 3
 * // 6
 * ```
 */
export function inspect<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => void
): IterableIterator<ElementType> {
	callbackFn = assertFunction(callbackFn);

	let index = 0;
	const iterator = from(iterable);
	return makeIterableIterator<ElementType>(() => {
		const result = iterator.next();
		if (!result.done) {
			callbackFn(result.value, index++);
		}

		return result;
	});
}
