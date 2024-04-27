import type { IterableResolvable } from './from';
import { assertFunction } from './shared/assertFunction';
import { toIterableIterator } from './toIterableIterator';

/**
 * Consumes the iterable and reduces it to the reducer function's result.
 *
 * @param iterable An iterator to reduce.
 * @param callbackFn A function to execute for each element produced by the iterator. Its return value becomes the value
 * of the `accumulator` parameter on the next invocation of `callbackFn`. For the last invocation, the return value
 * becomes the return value of `reduce()`.
 * @param initialValue A value to which `accumulator` is initialized the first time the callback is called. If
 * `initialValue` is specified, `callbackFn` starts executing with the first element as `currentValue`. If
 * `initialValue` is not specified, `accumulator` is initialized to the first element, and `callbackFn` starts executing
 * with the second element as `currentValue`. In this case, if the iterator is empty (so that there's no first value to
 * return as `accumulator`), an error is thrown.
 * @returns
 *
 * @example
 * ```typescript
 * import { reduce } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(reduce(iterable, (accumulator, currentValue) => accumulator + currentValue));
 * // Output: 15
 * ```
 *
 * @remarks
 *
 * If `initialValue` is not provided, the first element of the iterator is used as the initial value of `accumulator`,
 * consuming the first element.
 */
export function reduce<const ElementType, const MappedType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (accumulator: MappedType, currentValue: ElementType, currentIndex: number) => MappedType,
	initialValue?: MappedType
): MappedType {
	callbackFn = assertFunction(callbackFn);

	let index: number;
	let accumulator: MappedType;
	const resolvedIterable = toIterableIterator(iterable);
	if (arguments.length < 3) {
		const firstValue = resolvedIterable.next();
		if (firstValue.done) throw new TypeError('Reduce of empty iterator with no initial value');

		index = 1;
		accumulator = firstValue.value! as MappedType;
	} else {
		index = 0;
		accumulator = initialValue!;
	}

	for (const value of resolvedIterable) {
		accumulator = callbackFn(accumulator, value, index++);
	}

	return accumulator;
}
