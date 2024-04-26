/**
 *
 * @param iterator An iterator to reduce.
 * @param callbackFn A function to execute for each element produced by the iterator. Its return value becomes the value
 * of the `accumulator` parameter on the next invocation of `callbackFn`. For the last invocation, the return value
 * becomes the return value of `reduce()`.
 * @param initialValue A value to which `accumulator` is initialized the first time the callback is called. If
 * `initialValue` is specified, `callbackFn` starts executing with the first element as `currentValue`. If
 * `initialValue` is not specified, `accumulator` is initialized to the first element, and `callbackFn` starts executing
 * with the second element as `currentValue`. In this case, if the iterator is empty (so that there's no first value to
 * return as `accumulator`), an error is thrown.
 * @returns
 */
export function reduce<const ElementType, const MappedType>(
	iterator: IterableIterator<ElementType>,
	callbackFn: (accumulator: MappedType, currentValue: ElementType, currentIndex: number) => MappedType,
	initialValue?: MappedType
): MappedType {
	let index: number;
	let accumulator: MappedType;
	if (arguments.length < 3) {
		const firstValue = iterator.next();
		if (firstValue.done) throw new TypeError('Reduce of empty iterator with no initial value');

		index = 1;
		accumulator = firstValue.value! as MappedType;
	} else {
		index = 0;
		accumulator = initialValue!;
	}

	for (const value of iterator) {
		accumulator = callbackFn(accumulator, value, index++);
	}

	return accumulator;
}
