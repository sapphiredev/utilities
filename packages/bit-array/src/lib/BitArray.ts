import {
	CloneArrayBuffer,
	CompareTypedArrayElementsFallback,
	GetContentType,
	GetMethod,
	GetTypedArrayName,
	GetValueFromBuffer,
	HasArrayBufferData,
	IsValidIntegerIndex,
	LengthOfArrayLike,
	SetBit,
	SetTypedArrayFromArrayLike,
	SetTypedArrayFromTypedArray,
	SetValueInBuffer,
	ToIndex,
	ToIntegerOrInfinity,
	TypedArray,
	TypedArrayCreateSameType,
	TypedArrayElementSize,
	TypedArraySpeciesCreate,
	defineBitArray
} from './utils';

export class BitArray {
	#buffer!: Uint8Array;
	#bitLength!: number;
	#byteOffset = 0;
	#bitOffset = 0;

	public constructor(
		...args: [length?: number] | [data: ArrayLike<number> | ArrayBufferLike] | [buffer: ArrayBufferLike, bitOffset?: number, length?: number]
	) {
		// 23.2.5.1 TypedArray(...args)
		// https://tc39.es/ecma262/#sec-typedarray

		// 4. Let numberOfArgs be the number of elements in args.
		const numberOfArgs = args.length;
		if (numberOfArgs === 0) {
			this.#bitLength = 0;
			this.#buffer = new Uint8Array(0);
			return this;
		}

		// a. Let firstArgument be args[0].
		const firstArgument = args[0];
		// b. If firstArgument is an Object, then
		if (typeof firstArgument === 'object') {
			// ii. If firstArgument has a [[TypedArrayName]] internal slot, then
			if (GetTypedArrayName(firstArgument)) {
				// 1. Perform ? InitializeTypedArrayFromTypedArray(O, firstArgument).
				this.#InitializeTypedArrayFromTypedArray(firstArgument as TypedArray);
				return this;
			}

			// iii. Else if firstArgument has an [[ArrayBufferData]] internal slot, then
			if (HasArrayBufferData(firstArgument)) {
				// 1. If numberOfArgs > 1, let byteOffset be args[1]; else let byteOffset be undefined.
				const bitOffset = numberOfArgs > 1 ? (args[1] as number) : undefined;
				// 2. If numberOfArgs > 2, let length be args[2]; else let length be undefined.
				const length = numberOfArgs > 2 ? (args[2] as number) : undefined;
				// 3. Perform ? InitializeTypedArrayFromArrayBuffer(O, firstArgument, byteOffset, length).
				this.#InitializeTypedArrayFromArrayBuffer(firstArgument, bitOffset, length);
				return this;
			}

			// iv. Else,
			// 2. Let usingIterator be ? GetMethod(firstArgument, @@iterator).
			const usingIterator = GetMethod<IterableIterator<number>>(firstArgument, Symbol.iterator);
			// 3. If usingIterator is not undefined, then
			if (usingIterator !== undefined) {
				// a. Let values be ? IteratorToList(? GetIteratorFromMethod(firstArgument, usingIterator)).
				const values = [...usingIterator()];
				// b. Perform ? InitializeTypedArrayFromList(O, values).
				this.#InitializeTypedArrayFromList(values);
				return this;
			}

			// 4. Else,
			// a. NOTE: firstArgument is not an Iterable so assume it is already an array-like object.
			// b. Perform ? InitializeTypedArrayFromArrayLike(O, firstArgument).
			this.#InitializeTypedArrayFromArrayLike(firstArgument);
			return this;
		}

		// c. Else,
		// ii. Let elementLength be ? ToIndex(firstArgument).
		this.#bitLength = ToIndex(firstArgument);
		// iii. Return ? AllocateTypedArray(constructorName, NewTarget, proto, elementLength).
		this.#buffer = new Uint8Array(Math.ceil(this.#bitLength / 8));
	}

	/**
	 * Returns the length (in elements) of this typed array.
	 */
	public get length(): number {
		return this.#bitLength;
	}

	/**
	 * Returns the {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer ArrayBuffer} or {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer SharedArrayBuffer} referenced by this typed array at construction time.
	 */
	public get buffer(): ArrayBufferLike {
		// 23.2.3.2 get %TypedArray%.prototype.buffer
		// https://tc39.es/ecma262/#sec-get-%typedarray%.prototype.buffer
		return this.#buffer.buffer;
	}

	/**
	 * Returns the length (in bits) of this typed array.
	 */
	public get bitLength(): number {
		return this.#bitLength;
	}

	/**
	 * Returns the length (in bytes) of this typed array.
	 */
	public get byteLength(): number {
		// 23.2.3.3 get %TypedArray%.prototype.byteLength
		// https://tc39.es/ecma262/#sec-get-%typedarray%.prototype.bytelength

		return this.buffer.byteLength;
	}

	/**
	 * Returns the offset (in bits) of the elements in this typed array from the start of its {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer ArrayBuffer} or {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer SharedArrayBuffer}.
	 */
	public get bitOffset(): number {
		return this.#bitOffset;
	}

	/**
	 * Returns the offset (in bytes) of this typed array from the start of its {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer ArrayBuffer} or {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer SharedArrayBuffer}.
	 */
	public get byteOffset(): number {
		// 23.2.3.4 get %TypedArray%.prototype.byteOffset
		// https://tc39.es/ecma262/#sec-get-%typedarray%.prototype.byteoffset
		return this.#byteOffset;
	}

	/**
	 * Takes an integer value and returns the item at that index, allowing for positive and negative integers. Negative integers count back from the last item in the typed array. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at Array.prototype.at()}.
	 * @param index Zero-based index of the typed array element to be returned, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#integer_conversion converted to an integer}. Negative index counts back from the end of the typed array — if `index < 0`, `index + array.length` is accessed.
	 * @returns The element in the typed array matching the given index. Always returns {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined undefined} if `index < -array.length` or `index >= array.length` without attempting to access the corresponding property.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([0, 1, 1, 0, 0, 1, 1, 1]);
	 *
	 * console.log(bits.at(0));
	 * // Expected output: 0
	 *
	 * console.log(bits.at(-1));
	 * // Expected output: 1
	 * ```
	 */
	public at(index: number): number | undefined {
		// 23.2.3.1 %TypedArray%.prototype.at(index)
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.at

		const len = this.bitLength;

		let k = ToIntegerOrInfinity(index);
		if (k < 0) k += len;
		if (k < 0 || k >= len) return undefined;

		const bitOffset = k % 8;
		return (this.#buffer[(k - bitOffset) / 8] >> bitOffset) & 1;
	}

	/**
	 * Shallow copies part of this typed array to another location in the same typed array and returns this typed array without modifying its length. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin Array.prototype.copyWithin()}.
	 * @param target Zero-based index at which to copy the sequence to, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#integer_conversion converted to an integer}. This corresponds to where the element at start will be copied to, and all elements between start and end are copied to succeeding indices.
	 * @param start Zero-based index at which to start copying elements from, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#integer_conversion converted to an integer}.
	 * @param end Zero-based index at which to end copying elements from, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#integer_conversion converted to an integer}. copyWithin() copies up to but not including end.
	 * @returns The modified typed array.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([0, 1, 1, 0, 0, 1, 1, 1]);
	 *
	 * // Insert position, start position, end position
	 * bits.copyWithin(2, 0, 2);
	 *
	 * console.log(bits);
	 * // Expected output: BitArray [0, 1, 0, 1, 0, 1, 1, 1]
	 * ```
	 */
	public copyWithin(target: number, start: number, end?: number | undefined): this {
		// 23.2.3.6 %TypedArray%.prototype.copyWithin(target, start [, end])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin

		const len = this.length;

		// 4: Let relativeTarget be ? ToIntegerOrInfinity(target).
		const relativeTarget = ToIntegerOrInfinity(target);
		let to: number;
		// 5. If relativeTarget = -∞, let to be 0.
		if (relativeTarget === Number.NEGATIVE_INFINITY) to = 0;
		// 6. Else if relativeTarget < 0, let to be max(len + relativeTarget, 0).
		else if (relativeTarget < 0) to = Math.max(len + relativeTarget, 0);
		// 7. Else, let to be min(relativeTarget, len).
		else to = Math.min(relativeTarget, len);

		// 8. Let relativeStart be ? ToIntegerOrInfinity(start).
		const relativeStart = ToIntegerOrInfinity(start);
		let from: number;
		// 9. If relativeStart = -∞, let from be 0.
		if (relativeStart === Number.NEGATIVE_INFINITY) from = 0;
		// 10. Else if relativeStart < 0, let from be max(len + relativeStart, 0).
		else if (relativeStart < 0) from = Math.max(len + relativeStart, 0);
		// 11. Else, let from be min(relativeStart, len).
		else from = Math.min(relativeStart, len);

		// 12. If end is undefined, let relativeEnd be len; else let relativeEnd be ? ToIntegerOrInfinity(end).
		const relativeEnd = end === undefined ? len : ToIntegerOrInfinity(end);
		let final: number;
		// 13. If relativeEnd = -∞, let final be 0.
		if (relativeEnd === Number.NEGATIVE_INFINITY) final = 0;
		// 14. Else if relativeEnd < 0, let final be max(len + relativeEnd, 0).
		else if (relativeEnd < 0) final = Math.max(len + relativeEnd, 0);
		// 15. Else, let final be min(relativeEnd, len).
		else final = Math.min(relativeEnd, len);

		// 16. Let count be min(final - from, len - to).
		const count = Math.min(final - from, len - to);

		if (count <= 0) return this;

		// let bitOffset = this.bitOffset;
		// let byteOffset = this.byteOffset;
		// let bufferByteLimit =
		// TODO: Finish

		throw new Error('Not implemented');
	}

	/**
	 * returns a new {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator array iterator} object that contains the key/value pairs for each index in the typed array. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries Array.prototype.entries()}.
	 * @returns A new {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator iterable iterator object}.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 * const entries = bits.entries();
	 *
	 * entries.next();
	 * entries.next();
	 *
	 * console.log(entries.next().value);
	 * // Expected output: [2, 0]
	 * ```
	 */
	public *entries(): IterableIterator<[number, number]> {
		// 23.2.3.7 %TypedArray%.prototype.entries()
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
		const len = this.length;
		if (len === 0) return;

		const buffer = this.#buffer;
		let byteOffset = 0;
		let byte = buffer[byteOffset];
		let mask = 1;
		for (let k = 0; k < len; ++k) {
			yield [k, (byte & mask) === 0 ? 0 : 1];

			if ((mask <<= 1) === 0x100) {
				mask = 1;
				byte = buffer[++byteOffset];
			}
		}
	}

	/**
	 * Tests whether all elements in the typed array pass the test implemented by the provided function. It returns a Boolean value. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every Array.prototype.every()}.
	 * @param callbackfn A function to execute for each element in the typed array. It should return a {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy} value to indicate the element passes the test, and a {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy falsy} value otherwise.
	 * @param thisArg A value to use as `this` when executing `callbackfn`. See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods iterative methods}.
	 * @returns `true` unless `callbackfn` returns a {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy falsy} value for a typed array element, in which case `false` is immediately returned.
	 * @example
	 * ```javascript
	 * function isZero(element, index, array) {
	 *   return element === 0;
	 * }
	 *
	 * const bits = new BitArray([1, 1, 0, 0, 0]);
	 * console.log(bits.every(isZero));
	 * // Expected output: false
	 * ```
	 */
	public every(callbackfn: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean {
		// 23.2.3.8 %TypedArray%.prototype.every(callbackfn [, thisArg])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.every

		if (typeof callbackfn !== 'function') throw new TypeError('predicate must be a function');

		for (const [index, value] of this.entries()) {
			if (!callbackfn.call(thisArg, value, index, this)) return false;
		}

		return true;
	}

	/**
	 * Changes all elements within a range of indices in a typed array to a static value. It returns the modified typed array. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill Array.prototype.fill()}.
	 * @param value Value to fill the typed array with.
	 * @param start Zero-based index at which to start filling, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#integer_conversion converted to an integer}.
	 * @param end Zero-based index at which to end filling, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#integer_conversion converted to an integer}. `fill()` fills up to but not including `end`.
	 * @returns The modified typed array, filled with `value`.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 1, 1, 1]);
	 *
	 * // Value, start position, end position
	 * bits.fill(0, 1, 3);
	 *
	 * console.log(bits);
	 * // Expected output: BitArray [1, 0, 0, 1, 1]
	 * ```
	 */
	public fill(value: number, start?: number | undefined, end?: number | undefined): this {
		// 23.2.3.9 %TypedArray%.prototype.fill(value [, start [, end]])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill

		const len = this.length;
		value = Number(value) % 1;

		// 6. Let relativeStart be ? ToIntegerOrInfinity(start).
		const relativeStart = ToIntegerOrInfinity(start);
		let k: number;
		// 7. If relativeStart = -∞, let k be 0.
		if (relativeStart === Number.NEGATIVE_INFINITY) k = 0;
		// 8. Else if relativeStart < 0, let k be max(len + relativeStart, 0).
		else if (relativeStart < 0) k = Math.max(len + relativeStart, 0);
		// 9. Else, let k be min(relativeStart, len).
		else k = Math.min(relativeStart, len);

		// 10. If end is undefined, let relativeEnd be len; else let relativeEnd be ? ToIntegerOrInfinity(end).
		const relativeEnd = end === undefined ? len : ToIntegerOrInfinity(end);
		let final: number;
		// 11. If relativeEnd = -∞, let final be 0.
		if (relativeEnd === Number.NEGATIVE_INFINITY) final = 0;
		// 12. Else if relativeEnd < 0, let final be max(len + relativeEnd, 0).
		else if (relativeEnd < 0) final = Math.max(len + relativeEnd, 0);
		// 13. Else, let final be min(relativeEnd, len).
		else final = Math.min(relativeEnd, len);

		// 17. Set final to min(final, len).
		final = Math.min(final, len);

		const buffer = this.#buffer;
		let byteOffset = 0;
		let byte = buffer[byteOffset];
		let mask = 1;
		for (; k < final; ++k) {
			buffer[byteOffset] = (byte & ~mask) | (value << k);
			if ((mask <<= 1) === 0x100) {
				mask = 1;
				byte = buffer[++byteOffset];
			}
		}

		return this;
	}

	/**
	 * Creates a copy of a portion of a given typed array, filtered down to just the elements from the given typed array that pass the test implemented by the provided function. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter Array.prototype.filter()}.
	 * @param callbackfn A function to execute for each element in the typed array. It should return a {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy} value to keep the element in the resulting typed array, and a {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy falsy} value otherwise.
	 * @param thisArg A value to use as `this` when executing `callbackfn`. See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods iterative methods}.
	 * @returns A copy of the given typed array containing just the elements that pass the test. If no elements pass the test, an empty typed array is returned.
	 * @example
	 * ```javascript
	 * function isOne(element, index, array) {
	 *   return element === 1;
	 * }
	 *
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 * const ones = bits.filter(isZero);
	 *
	 * console.log(ones);
	 * // Expected output: BitArray [1, 1, 1]
	 * ```
	 */
	public filter(callbackfn: (value: number, index: number, array: this) => any, thisArg?: any): BitArray {
		// 23.2.3.10 %TypedArray%.prototype.filter(callbackfn [, thisArg])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter

		if (typeof callbackfn !== 'function') throw new TypeError('predicate must be a function');

		const kept: number[] = [];
		for (const [index, value] of this.entries()) {
			if (callbackfn.call(thisArg, value, index, this)) kept.push(value);
		}

		return new BitArray(kept);
	}

	/**
	 * Returns the first element in the provided typed array that satisfies the provided testing function. If no values satisfy the testing function, {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined undefined} is returned. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find Array.prototype.find()}.
	 * @param predicate A function to execute for each element in the typed array. It should return a {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy} value to indicate a matching element has been found, and a {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy falsy} value otherwise. The function is called with the following arguments:
	 * @param thisArg A value to use as `this` when executing `callbackfn`. See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods iterative methods}.
	 * @returns The first element in the typed array that satisfies the provided testing function. Otherwise, {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined undefined} is returned.
	 * @example
	 * ```javascript
	 * function isOne(element, index, array) {
	 *   return element === 1;
	 * }
	 *
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 * const found = bits.find(isOne);
	 *
	 * console.log(found);
	 * // Expected output: 1
	 * ```
	 */
	public find(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number | undefined {
		// 23.2.3.11 %TypedArray%.prototype.find(predicate [, thisArg])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.find

		if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');

		for (const [index, value] of this.entries()) {
			if (predicate.call(thisArg, value, index, this)) return value;
		}

		return undefined;
	}

	/**
	 * Returns the index of the first element in a typed array that satisfies the provided testing function. If no elements satisfy the testing function, -1 is returned. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex Array.prototype.findIndex()}.
	 * @param predicate A function to execute for each element in the typed array. It should return a {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy} value to indicate a matching element has been found, and a {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy falsy} value otherwise. The function is called with the following arguments:
	 * @param thisArg A value to use as `this` when executing `callbackfn`. See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods iterative methods}.
	 * @returns The index of the first element in the typed array that passes the test. Otherwise, `-1`.
	 * @example
	 * ```javascript
	 * function isZero(element, index, array) {
	 *   return element === 0;
	 * }
	 *
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 * const index = bits.findIndex(isZero);
	 *
	 * console.log(index);
	 * // Expected output: 2
	 * ```
	 */
	public findIndex(predicate: (value: number, index: number, obj: this) => boolean, thisArg?: any): number {
		// 23.2.3.12 %TypedArray%.prototype.findIndex(predicate [, thisArg])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex

		if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');

		for (const [index, value] of this.entries()) {
			if (predicate.call(thisArg, value, index, this)) return index;
		}

		return -1;
	}

	/**
	 * iterates the typed array in reverse order and returns the value of the first element that satisfies the provided testing function. If no elements satisfy the testing function, {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined undefined} is returned. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast Array.prototype.findLast()}.
	 * @param predicate A function to execute for each element in the typed array. It should return a {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy} value to indicate a matching element has been found, and a {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy falsy} value otherwise.
	 * @param thisArg A value to use as `this` when executing `callbackfn`. See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods iterative methods}.
	 * @returns The last (highest-index) element in the typed array that satisfies the provided testing function; {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined undefined} if no matching element is found.
	 * @example
	 * ```javascript
	 * function isOne(element, index, array) {
	 *   return element === 1;
	 * }
	 *
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 * const found = bits.findLast(isOne);
	 *
	 * console.log(found);
	 * // Expected output: 1
	 * ```
	 */
	public findLast<S extends number>(predicate: (value: number, index: number, array: this) => value is S, thisArg?: any): S | undefined;
	public findLast(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): number | undefined;
	public findLast(predicate: unknown, thisArg?: unknown): number | undefined {
		// 23.2.3.13 %TypedArray%.prototype.findLast(predicate [, thisArg])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findlast

		if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');

		for (const [index, value] of this.#entriesReversed()) {
			if (predicate.call(thisArg, value, index, this)) return value;
		}

		return undefined;
	}

	/**
	 * Iterates the typed array in reverse order and returns the index of the first element that satisfies the provided testing function. If no elements satisfy the testing function, `-1` is returned. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex Array.prototype.findLastIndex()}.
	 * @param predicate A function to execute for each element in the typed array. It should return a {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy} value to indicate a matching element has been found, and a {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy falsy} value otherwise. The function is called with the following arguments:
	 * @param thisArg A value to use as `this` when executing `callbackfn`. See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods iterative methods}.
	 * @returns The index of the first element in the typed array that passes the test. Otherwise, `-1`.
	 * @example
	 * ```javascript
	 * function isZero(element, index, array) {
	 *   return element === 0;
	 * }
	 *
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 * const index = bits.findLastIndex(isZero);
	 *
	 * console.log(index);
	 * // Expected output: 3
	 * ```
	 */
	public findLastIndex(predicate: (value: number, index: number, array: this) => unknown, thisArg?: any): number {
		// 23.2.3.14 %TypedArray%.prototype.findLastIndex(predicate [, thisArg])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findlastindex

		if (typeof predicate !== 'function') throw new TypeError('predicate must be a function');

		for (const [index, value] of this.#entriesReversed()) {
			if (predicate.call(thisArg, value, index, this)) return index;
		}

		return -1;
	}

	/**
	 * Executes a provided function once for each typed array element. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach Array.prototype.forEach()}.
	 * @param callbackfn A function to execute for each element in the typed array. Its return value is discarded.
	 * @param thisArg A value to use as `this` when executing `callbackfn`. See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods iterative methods}.
	 * @returns None ({@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined undefined})
	 * @example
	 * ```javascript
	 * function log(element, index, array) {
	 *  console.log(`[${index}] = ${element}`);
	 * }
	 *
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 * bits.forEach(log);
	 * // Expected output:
	 * // [0] = 1
	 * // [1] = 1
	 * // [2] = 0
	 * // [3] = 0
	 * // [4] = 1
	 * ```
	 */
	public forEach(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): void {
		// 23.2.3.15 %TypedArray%.prototype.forEach(callbackfn [, thisArg])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach

		if (typeof callbackfn !== 'function') throw new TypeError('predicate must be a function');

		for (const [index, value] of this.entries()) {
			callbackfn.call(thisArg, value, index, this);
		}
	}

	/**
	 * Determines whether a typed array includes a certain value among its entries, returning `true` or `false` as appropriate. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes Array.prototype.includes()}.
	 * @param searchElement The value to search for.
	 * @param fromIndex Zero-based index at which to start searching, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#integer_conversion converted to an integer}.
	 * @returns A boolean value which is `true` if the value `searchElement` is found within the typed array (or the part of the typed array indicated by the index `fromIndex`, if specified).
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 *
	 * console.log(bits.includes(0));
	 * // Expected output: true
	 *
	 * // Check from position 4
	 * console.log(bits.includes(0, 4));
	 * // Expected output: false
	 * ```
	 */
	public includes(searchElement: number, fromIndex?: number | undefined): boolean {
		// 23.2.3.16 %TypedArray%.prototype.includes(searchElement [, fromIndex])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes

		const len = this.length;
		// 4. If len = 0, return false.
		if (len === 0) return false;

		// 5. Let n be ? ToIntegerOrInfinity(fromIndex).
		let n = ToIntegerOrInfinity(fromIndex);
		// 7. If n = +∞, return false.
		if (n === Number.POSITIVE_INFINITY) return false;
		// 8. Else if n = -∞, set n to 0.
		else if (n === Number.NEGATIVE_INFINITY) n = 0;

		let k =
			n >= 0
				? // 9. If n ≥ 0, then let k be n
				  n
				: // 10. Else, let k be len + n. If k < 0, set k to 0
				  Math.max(len + n, 0);

		// Set searchElement to the result of converting searchElement to 1 or 0.
		searchElement = Number(searchElement) & 1;

		const buffer = this.#buffer;
		const bitOffset = k % 8;
		let byteOffset = (k - bitOffset) / 8;
		let byte = buffer[byteOffset];
		let mask = 1 << bitOffset;
		for (; k < len; ++k) {
			const value = (byte & mask) === 0 ? 0 : 1;
			if (value === searchElement) return true;

			if ((mask <<= 1) === 0x100) {
				mask = 1;
				byte = buffer[++byteOffset];
			}
		}

		return false;
	}

	/**
	 * Returns the first index at which a given element can be found in the typed array, or `-1` if it is not present. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf Array.prototype.indexOf()}.
	 * @param searchElement Element to locate in the typed array.
	 * @param fromIndex Zero-based index at which to start searching, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#integer_conversion converted to an integer}.
	 * @returns The first index of `searchElement` in the typed array; `-1` if not found.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 *
	 * console.log(bits.indexOf(0));
	 * // Expected output: 2
	 *
	 * // From position 4
	 * console.log(bits.indexOf(0, 4));
	 * // Expected output: -1
	 * ```
	 */
	public indexOf(searchElement: number, fromIndex?: number | undefined): number {
		// 23.2.3.17 %TypedArray%.prototype.indexOf(searchElement [, fromIndex])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof

		const len = this.length;
		// 4. If len = 0, return false.
		if (len === 0) return -1;

		// 5. Let n be ? ToIntegerOrInfinity(fromIndex).
		let n = ToIntegerOrInfinity(fromIndex);
		// 7. If n = +∞, return false.
		if (n === Number.POSITIVE_INFINITY) return -1;
		// 8. Else if n = -∞, set n to 0.
		else if (n === Number.NEGATIVE_INFINITY) n = 0;

		let k =
			n >= 0
				? // 9. If n ≥ 0, then let k be n
				  n
				: // 10. Else, let k be len + n. If k < 0, set k to 0
				  Math.max(len + n, 0);

		// Set searchElement to the result of converting searchElement to 1 or 0.
		searchElement = Number(searchElement) & 1;

		const buffer = this.#buffer;
		const bitOffset = k % 8;
		let byteOffset = (k - bitOffset) / 8;
		let byte = buffer[byteOffset];
		let mask = 1 << bitOffset;
		for (; k < len; ++k) {
			const value = (byte & mask) === 0 ? 0 : 1;
			if (value === searchElement) return k;

			if ((mask <<= 1) === 0x100) {
				mask = 1;
				byte = buffer[++byteOffset];
			}
		}

		return -1;
	}

	/**
	 * Creates and returns a new string by concatenating all of the elements in this typed array, separated by commas or a specified separator string. If the typed array has only one item, then that item will be returned without using the separator. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join Array.prototype.join()}.
	 * @param separator A string to separate each pair of adjacent elements of the typed array. If omitted, the typed array elements are separated with a comma (",").
	 * @returns A string with all typed array elements joined. If `array.length` is `0`, the empty string is returned.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 *
	 * console.log(bits.join());
	 * // Expected output: "1,1,0,0,1"
	 *
	 * console.log(bits.join(''));
	 * // Expected output: "11001"
	 *
	 * console.log(bits.join('-'));
	 * // Expected output: "1-1-0-0-1"
	 * ```
	 */
	public join(separator?: string | undefined): string {
		// 23.2.3.18 %TypedArray%.prototype.join(separator)
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.join

		// 4. If separator is undefined, let sep be ",".
		if (separator === undefined) separator = ',';
		// 5. Else, let sep be ? ToString(separator).
		else separator = String(separator);

		// 6. Let R be the empty String.
		let R = '';
		for (const value of this.values()) {
			const next = value ? '1' : '0';
			if (R.length === 0) R = next;
			else R += separator + next;
		}

		return R;
	}

	/**
	 * Returns a new {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator array iterator} object that contains the keys for each index in the typed array. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys Array.prototype.keys()}.
	 * @returns A new {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator iterable iterator object}.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 * const keys = bits.keys();
	 *
	 * keys.next();
	 * keys.next();
	 *
	 * console.log(keys.next().value);
	 * // Expected output: 2
	 * ```
	 */
	public *keys(): IterableIterator<number> {
		// 23.2.3.19 %TypedArray%.prototype.keys()
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys

		const len = this.length;
		for (let k = 0; k < len; ++k) yield k;
	}

	/**
	 * Returns the last index at which a given element can be found in the typed array, or `-1` if it is not present. The typed array is searched backwards, starting at `fromIndex`. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf Array.prototype.lastIndexOf()}.
	 * @param searchElement Element to locate in the typed array.
	 * @param fromIndex Zero-based index at which to start searching backwards, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#integer_conversion converted to an integer}.
	 */
	public lastIndexOf(searchElement: number, fromIndex?: number | undefined): number {
		// 23.2.3.20 %TypedArray%.prototype.lastIndexOf(searchElement [, fromIndex])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof

		const len = this.length;
		// 4. If len = 0, return false.
		if (len === 0) return -1;

		// 5. If fromIndex is present, let n be ? ToIntegerOrInfinity(fromIndex); else let n be len - 1.
		const n = fromIndex === undefined ? len - 1 : ToIntegerOrInfinity(fromIndex);
		// 6. If n = -∞, return -1𝔽.
		if (n === Number.NEGATIVE_INFINITY) return -1;

		let k =
			n >= 0
				? // 7. If n ≥ 0, then let k be min(n, len - 1).
				  Math.min(n, len - 1)
				: // 8. Else, let k be len + n
				  len + n;

		// Set searchElement to the result of converting searchElement to 1 or 0.
		searchElement = Number(searchElement) & 1;

		const buffer = this.#buffer;
		const bitOffset = k % 8;
		let byteOffset = (k - bitOffset) / 8;
		let byte = buffer[byteOffset];
		let mask = 1 << len % 8;
		for (; k >= 0; --k) {
			const value = (byte & mask) === 0 ? 0 : 1;
			if (value === searchElement) return k;

			if ((mask >>= 1) === 0) {
				mask = 0b1000_0000;
				byte = buffer[--byteOffset];
			}
		}

		return -1;
	}

	/**
	 * Creates a new typed array populated with the results of calling a provided function on every element in the calling typed array. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map Array.prototype.map()}.
	 * @param callbackfn A function to execute for each element in the typed array. Its return value is added as a single element in the new typed array.
	 * @param thisArg A value to use as `this` when executing `callbackfn`. See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods iterative methods}.
	 * @returns A new typed array with each element being the result of the callback function.
	 * @example
	 * ```javascript
	 * function flip(element, index, array) {
	 *   return element === 1 ? 0 : 1;
	 * }
	 *
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 * const flipped = bits.map(flip);
	 *
	 * console.log(flipped);
	 * // Expected output: BitArray [0, 0, 1, 1, 0]
	 * ```
	 */
	public map(callbackfn: (value: number, index: number, array: this) => number, thisArg?: any): BitArray {
		// 23.2.3.22 %TypedArray%.prototype.map(callbackfn [, thisArg])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.map

		if (typeof callbackfn !== 'function') throw new TypeError('callbackfn must be a function');

		const mappedValues: number[] = [];
		for (const [k, value] of this.entries()) {
			mappedValues.push(callbackfn.call(thisArg, value, k, this));
		}

		return new BitArray(mappedValues);
	}

	/**
	 * Executes a user-supplied "reducer" callback function on each element of the typed array, in order, passing in the return value from the calculation on the preceding element. The final result of running the reducer across all elements of the typed array is a single value. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce Array.prototype.reduce()}.
	 * @param callbackfn A function to execute for each element in the typed array. Its return value becomes the value of the `accumulator` parameter on the next invocation of `callbackfn`. For the last invocation, the return value becomes the return value of `reduce()`.
	 * @param initialValue A value to which `accumulator` is initialized the first time the callback is called. If `initialValue` is specified, `callbackFn` starts executing with the first value in the typed array as `currentValue`. If `initialValue` is not specified, `accumulator` is initialized to the first value in the typed array, and `callbackFn` starts executing with the second value in the typed array as `currentValue`. In this case, if the typed array is empty (so that there's no first value to return as `accumulator`), an error is thrown.
	 * @example
	 * ```javascript
	 * function sum(previousValue, currentValue, currentIndex, array) {
	 *   return previousValue + currentValue;
	 * }
	 *
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 *
	 * console.log(bits.reduce(sum));
	 * // Expected output: 3
	 * ```
	 */
	public reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
	public reduce<U = number>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
	public reduce(callbackfn: unknown, initialValue?: unknown): unknown {
		// 23.2.3.23 %TypedArray%.prototype.reduce(callbackfn [, initialValue])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce

		// 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
		if (typeof callbackfn !== 'function') throw new TypeError('callbackfn must be a function');

		const len = this.length;
		// 5. If len = 0 and initialValue is not present, throw a TypeError exception.
		if (len === 0 && initialValue === undefined) throw new TypeError('initialValue must be present if array is empty');

		const buffer = this.#buffer;
		let byteOffset = 0;
		let byte = buffer[byteOffset];
		let mask = 1;

		// 6. Let k be 0.
		let k = 0;
		// 7. Let accumulator be undefined.
		let accumulator: unknown;
		// 8. If initialValue is not present, then
		if (initialValue === undefined) {
			accumulator = (byte & mask) === 0 ? 0 : 1;
			k = 1;
			mask = 0b10;
		} else {
			// a. Set accumulator to initialValue.
			accumulator = initialValue;
		}

		for (; k < len; ++k) {
			accumulator = callbackfn(accumulator, (byte & mask) === 0 ? 0 : 1, k, this);

			if ((mask <<= 1) === 0x100) {
				mask = 1;
				byte = buffer[++byteOffset];
			}
		}

		// 11. Return accumulator.
		return accumulator;
	}

	/**
	 * Executes a user-supplied "reducer" callback function on each element of the typed array, in reverse order, passing in the return value from the calculation on the preceding element. The final result of running the reducer across all elements of the typed array is a single value. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight Array.prototype.reduceRight()}.
	 * @param callbackfn A function to execute for each element in the typed array. Its return value becomes the value of the `accumulator` parameter on the next invocation of `callbackfn`. For the last invocation, the return value becomes the return value of `reduceRight()`.
	 * @param initialValue A value to which `accumulator` is initialized the first time the callback is called. If `initialValue` is specified, `callbackFn` starts executing with the last value in the typed array as `currentValue`. If `initialValue` is not specified, `accumulator` is initialized to the last value in the typed array, and `callbackFn` starts executing with the second to last value in the typed array as `currentValue`. In this case, if the typed array is empty (so that there's no last value to return as `accumulator`), an error is thrown.
	 * @example
	 * ```javascript
	 * function concat(previousValue, currentValue, currentIndex, array) {
	 *   return `${previousValue}, ${currentValue}`;
	 * }
	 *
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 *
	 * console.log(bits.reduceRight(sum));
	 * // Expected output: "1, 0, 0, 1, 1"
	 * ```
	 */
	public reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: this) => number): number;
	public reduceRight<U = number>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: this) => U, initialValue: U): U;
	public reduceRight(callbackfn: unknown, initialValue?: unknown): unknown {
		// 23.2.3.24 %TypedArray%.prototype.reduceRight(callbackfn [, initialValue])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright

		// 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
		if (typeof callbackfn !== 'function') throw new TypeError('callbackfn must be a function');

		const len = this.length;
		// 5. If len = 0 and initialValue is not present, throw a TypeError exception.
		if (len === 0 && initialValue === undefined) throw new TypeError('initialValue must be present if array is empty');

		const buffer = this.#buffer;
		let byteOffset = 0;
		let byte = buffer[byteOffset];
		let mask = 1 << len % 8;

		// 6. Let k be len - 1.
		let k = len - 1;
		// 7. Let accumulator be undefined.
		let accumulator: unknown;
		// 8. If initialValue is not present, then
		if (initialValue === undefined) {
			accumulator = (byte & mask) === 0 ? 0 : 1;
			k--;
			mask >>= 1;
		} else {
			// a. Set accumulator to initialValue.
			accumulator = initialValue;
		}

		for (; k >= 0; --k) {
			accumulator = callbackfn(accumulator, (byte & mask) === 0 ? 0 : 1, k, this);

			if ((mask >>= 1) === 0) {
				mask = 0b1000_0000;
				byte = buffer[--byteOffset];
			}
		}

		// 11. Return accumulator.
		return accumulator;
	}

	/**
	 * Reverses a typed array {@link https://en.wikipedia.org/wiki/In-place_algorithm in place} and returns the reference to the same typed array, the first typed array element now becoming the last, and the last typed array element becoming the first. In other words, elements order in the typed array will be turned towards the direction opposite to that previously stated. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse Array.prototype.reverse()}.
	 * @returns The reference to the original typed array, now reversed. Note that the typed array is reversed {@link https://en.wikipedia.org/wiki/In-place_algorithm in place}, and no copy is made.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 * bits.reverse();
	 *
	 * console.log(bits);
	 * // Expected output: BitArray [1, 0, 0, 1, 1]
	 * ```
	 */
	public reverse(): this {
		// 23.2.3.25 %TypedArray%.prototype.reverse()
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse

		const len = this.length;

		// 4. Let middle be floor(len / 2).
		const middle = Math.floor(len / 2);
		// 5. Let lower be 0.
		let lower = 0;

		const buffer = this.#buffer;
		let lowerByteOffset = 0;
		let lowerByte = buffer[lowerByteOffset];
		let lowerMask = 1;

		while (lower !== middle) {
			const upper = len - lower - 1;
			const upperBitOffset = upper % 8;
			const upperByteOffset = (upper - upperBitOffset) / 8;

			let upperByte = buffer[upper];
			const upperMask = 1 << upperBitOffset;
			const upperValue = (upperByte & upperMask) === 0 ? 0 : 1;
			const lowerValue = (lowerByte & lowerMask) === 0 ? 0 : 1;

			if (upperValue !== lowerValue) {
				upperByte = SetBit(buffer, upperByteOffset, upperMask, lowerValue);
				lowerByte = SetBit(buffer, lowerByteOffset, lowerMask, upperValue);
			}

			if ((lowerMask <<= 1) === 0x100) {
				lowerMask = 1;
				lowerByte = buffer[++lowerByteOffset];
			}

			lower++;
		}

		return this;
	}

	/**
	 * Stores multiple values in the typed array, reading input values from a specified array.
	 * @param source The array from which to copy values. All values from the source array are copied into the target array, unless the length of the source array plus the target offset exceeds the length of the target array, in which case an exception is thrown.
	 * @param offset The offset into the target array at which to begin writing values from the source array. If this value is omitted, 0 is assumed (that is, the source array will overwrite values in the target array starting at index 0).
	 * @returns None ({@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined undefined})
	 * @example
	 * ```javascript
	 * const bits = new BitArray(8);
	 *
	 * // Copy the values into the array
	 * bits.set([1, 1, 0, 0, 1, 1, 1, 0]);
	 *
	 * console.log(bits);
	 * // Expected output: BitArray [1, 1, 0, 0, 1, 1, 1, 0]
	 *
	 * // Copy the values into the array, starting at index 2
	 * bits.set([1, 1, 1], 2);
	 *
	 * console.log(bits);
	 * // Expected output: BitArray [1, 1, 1, 1, 1, 1, 1, 0]
	 * ```
	 */
	public set(source: ArrayLike<number>, offset?: number | undefined): void {
		// 23.2.3.26 %TypedArray%.prototype.set(source [, offset])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set

		// 4. Let targetOffset be ? ToIntegerOrInfinity(offset).
		const targetOffset = ToIntegerOrInfinity(offset);
		// 5. If targetOffset < 0, throw a RangeError exception.
		if (targetOffset < 0) throw new RangeError('offset must be >= 0');

		if (source instanceof TypedArray) SetTypedArrayFromTypedArray(this, targetOffset, source);
		else SetTypedArrayFromArrayLike(this, targetOffset, source);
	}

	/**
	 * Stores a single value in the typed array.
	 * @param index Zero-based index of the typed array element to be returned, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#integer_conversion converted to an integer}. Negative index counts back from the end of the typed array — if `index < 0`, `index + array.length` is accessed.
	 * @param value The value to be set, will be coerced into a single bit.
	 * @returns The set bit.
	 * @example
	 * ```javascript
	 * const bits = new BitArray(8);
	 *
	 * bits.setAt(0, 1);
	 * bits.setAt(2, 1);
	 *
	 * console.log(bits);
	 * // Expected output: BitArray [1, 0, 1, 0, 0, 0, 0, 0]
	 * ```
	 */
	public setAt(index: number, value: number): number {
		const len = this.bitLength;

		let k = ToIntegerOrInfinity(index);
		if (k < 0) k += len;
		if (k < 0 || k >= len) throw new RangeError('index out of range');

		value = Number(value) & 1;

		const bitOffset = k % 8;
		const byteOffset = (k - bitOffset) / 8;
		const mask = 1 << bitOffset;
		SetBit(this.#buffer, byteOffset, mask, value);

		return value;
	}

	/**
	 * Returns a copy of a portion of a typed array into a new typed array object selected from `start` to `end` (`end` not included) where `start` and `end` represent the index of items in that typed array. The original typed array will not be modified. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice Array.prototype.slice()}.
	 * @param start Zero-based index at which to start searching, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#integer_conversion converted to an integer}.
	 * @param end Zero-based index at which to start searching, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#integer_conversion converted to an integer}. `slice()` extracts up to but not including `end`.
	 * @returns A new typed array containing the extracted elements.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 *
	 * console.log(bits.slice(2));
	 * // Expected output: BitArray [0, 0, 1]
	 *
	 * console.log(bits.slice(1, 3));
	 * // Expected output: BitArray [1, 0]
	 * ```
	 */
	public slice(start?: number | undefined, end?: number | undefined): BitArray {
		// 23.2.3.27 %TypedArray%.prototype.slice(start, end)
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice

		const len = this.length;

		// 4. Let relativeStart be ? ToIntegerOrInfinity(start).
		const relativeStart = ToIntegerOrInfinity(start);

		let k: number;
		// 5. If relativeStart = -∞, let k be 0.
		if (relativeStart === Number.NEGATIVE_INFINITY) k = 0;
		// 6. Else if relativeStart < 0, let k be max(len + relativeStart, 0).
		else if (relativeStart < 0) k = Math.max(len + relativeStart, 0);
		// 7. Else, let k be min(relativeStart, len).
		else k = Math.min(relativeStart, len);

		// 8. If end is undefined, let relativeEnd be len; else let relativeEnd be ? ToIntegerOrInfinity(end).
		const relativeEnd = end === undefined ? len : ToIntegerOrInfinity(end);

		let final: number;
		// 9. If relativeEnd = -∞, let final be 0.
		if (relativeEnd === Number.NEGATIVE_INFINITY) final = 0;
		// 10. Else if relativeEnd < 0, let final be max(len + relativeEnd, 0).
		else if (relativeEnd < 0) final = Math.max(len + relativeEnd, 0);
		// 11. Else, let final be min(relativeEnd, len).
		else final = Math.min(relativeEnd, len);

		// 12. Let count be max(final - k, 0).
		const count = Math.max(final - k, 0);
		// 13. Let A be ? TypedArraySpeciesCreate(O, «count»).
		const A = TypedArraySpeciesCreate(this, [count], 'TypedArray.prototype.slice');
		if (count <= 0) return A;

		// d. Set final to min(final, len).
		final = Math.min(final, len);
		// e. Let srcType be TypedArrayElementType(O).
		const srcType = GetContentType(this);
		// f. Let targetType be TypedArrayElementType(A).
		const targetType = GetContentType(A);
		// g. If srcType is targetType, then
		if (srcType === targetType) {
			// TODO: Finish
			throw new Error('Method not implemented.');
		} else {
			// i. Let n be 0.
			let n = 0;
			// j. Repeat, while k < final
			while (k < final) {
				A.setAt(n++, this.at(k++)!);
			}
		}

		// 15. Return A.
		return A;
	}

	/**
	 * Tests whether at least one element in the typed array passes the test implemented by the provided function. It returns true if, in the typed array, it finds an element for which the provided function returns true; otherwise it returns false. It doesn't modify the typed array. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some Array.prototype.some()}.
	 * @param callbackfn A function to execute for each element in the typed array. It should return a {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy} value to keep the element in the resulting typed array, and a {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy falsy} value otherwise.
	 * @param thisArg A value to use as `this` when executing `callbackfn`. See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#iterative_methods iterative methods}.
	 * @returns `false` unless `callbackFn` returns a {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy} value for a typed array element, in which case true is immediately returned.
	 * @example
	 * ```javascript
	 * function isOne(element, index, array) {
	 *   return element === 1;
	 * }
	 *
	 * const bits = new BitArray([0, 0, 0, 1, 0]);
	 *
	 * console.log(bits.some(isOne));
	 * // Expected output: true
	 * ```
	 */
	public some(callbackfn: (value: number, index: number, array: this) => unknown, thisArg?: any): boolean {
		// 23.2.3.28 %TypedArray%.prototype.some(callbackfn [, thisArg])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.some

		if (typeof callbackfn !== 'function') throw new TypeError('callbackfn must be a function');

		for (const [k, value] of this.entries()) {
			if (callbackfn.call(thisArg, value, k, this)) return true;
		}

		return false;
	}

	/**
	 * Sorts the elements of a typed array {@link https://en.wikipedia.org/wiki/In-place_algorithm in place} and returns the reference to the same typed array, now sorted. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort Array.prototype.sort()}, except that it sorts the values numerically instead of as strings by default.
	 * @param comparefn A function that defines the sort order. The return value should be a number whose sign indicates the relative order of the two elements: negative if `a` is less than `b`, positive if `a` is greater than `b`, and zero if they are equal. `NaN` is treated as `0`. If omitted, the typed array elements are sorted according to numeric value.
	 * @returns The reference to the original typed array, now sorted. Note that the typed array is sorted {@link https://en.wikipedia.org/wiki/In-place_algorithm in place}, and no copy is made.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 *
	 * bits.sort();
	 * console.log(bits);
	 * // Expected output: BitArray [0, 0, 1, 1, 1]
	 *
	 * bits.sort((a, b) => b - a);
	 * console.log(bits);
	 * // Expected output: BitArray [1, 1, 1, 0, 0]
	 * ```
	 */
	public sort(comparefn?: ((a: number, b: number) => number) | undefined): this {
		// 23.2.3.29 %TypedArray%.prototype.sort(comparefn)
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort

		// 1. If comparefn is not undefined and IsCallable(comparefn) is false, throw a TypeError exception.
		if (comparefn === undefined) comparefn = CompareTypedArrayElementsFallback;
		else if (typeof comparefn !== 'function') throw new TypeError('comparefn must be a function');

		this.set([...this].sort(comparefn));
		return this;
	}

	/**
	 * Returns a new typed array on the same {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer ArrayBuffer} store and with the same element types as for this typed array. The begin offset is inclusive and the end offset is exclusive.
	 * @param begin Element to begin at. The offset is inclusive. The whole array will be included in the new view if this value is not specified.
	 * @param end Element to end at. The offset is exclusive. If not specified, all elements from the one specified by `begin` to the end of the array are included in the new view.
	 * @returns A new {@linkcode BitArray} object.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 *
	 * console.log(bits.subarray(1));
	 * // Expected output: BitArray [1, 0, 0, 1]
	 *
	 * console.log(bits.subarray(1, 3));
	 * // Expected output: BitArray [1, 0]
	 * ```
	 */
	public subarray(begin?: number | undefined, end?: number | undefined): BitArray {
		// 23.2.3.30 %TypedArray%.prototype.subarray(begin, end)
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray

		const srcLength = this.length;
		// 8. Let relativeBegin be ? ToIntegerOrInfinity(begin).
		const relativeBegin = ToIntegerOrInfinity(begin);
		let beginIndex: number;
		// 9. If relativeBegin = -∞, let beginIndex be 0.
		if (relativeBegin === Number.NEGATIVE_INFINITY) beginIndex = 0;
		// 10. Else if relativeBegin < 0, let beginIndex be max(srcLength + relativeBegin, 0).
		else if (relativeBegin < 0) beginIndex = Math.max(srcLength + relativeBegin, 0);
		// 11. Else, let beginIndex be min(relativeBegin, srcLength).
		else beginIndex = Math.min(relativeBegin, srcLength);

		// 12. Let elementSize be TypedArrayElementSize(O).
		const elementSize = TypedArrayElementSize(this)!;
		// 13. Let srcByteOffset be O.[[ByteOffset]].
		const srcByteOffset = this.byteOffset;
		// 14. Let beginByteOffset be srcByteOffset + beginIndex × elementSize.
		const beginByteOffset = srcByteOffset + beginIndex * elementSize;

		// a. If end is undefined, let relativeEnd be srcLength; else let relativeEnd be ? ToIntegerOrInfinity(end).
		const relativeEnd = end === undefined ? srcLength : ToIntegerOrInfinity(end);
		let endIndex: number;
		// b. If relativeEnd = -∞, let endIndex be 0.
		if (relativeEnd === Number.NEGATIVE_INFINITY) endIndex = 0;
		// c. Else if relativeEnd < 0, let endIndex be max(srcLength + relativeEnd, 0).
		else if (relativeEnd < 0) endIndex = Math.max(srcLength + relativeEnd, 0);
		// d. Else, let endIndex be min(relativeEnd, srcLength).
		else endIndex = Math.min(relativeEnd, srcLength);
		// e. Let newLength be max(endIndex - beginIndex, 0).
		const newLength = Math.max(endIndex - beginIndex, 0);
		// f. Let argumentsList be « buffer, 𝔽(beginByteOffset), 𝔽(newLength) ».
		const argumentsList = [this.#buffer, beginByteOffset, newLength];

		// 17. Return ? TypedArraySpeciesCreate(O, argumentsList).
		return TypedArraySpeciesCreate(this, argumentsList, 'TypedArray.prototype.subarray');
	}

	/**
	 * Returns a string representing the elements of the typed array. The elements are converted to strings using their `toLocaleString` methods and these strings are separated by a locale-specific string (such as a comma ","). This method has the same algorithm as {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString Array.prototype.toLocaleString()}.
	 * @returns A string representing the elements of the typed array.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 *
	 * console.log(bits.toString());
	 * // Expected output: "1,1,0,0,1"
	 * ```
	 */
	public toLocaleString(...parameters: Parameters<number['toLocaleString']>): string {
		// 23.2.3.31 %TypedArray%.prototype.toLocaleString([reserved1 [, reserved2]])
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring

		// 6. Let R be the empty String.
		let R = '';
		for (const value of this.values()) {
			const next = value.toLocaleString(...parameters);
			if (R.length === 0) R = next;
			else R += `,${next}`;
		}

		return R;
	}

	/**
	 * The {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#copying_methods_and_mutating_methods copying} counterpart of the {@linkcode reverse()} method. It returns a new typed array with the elements in reversed order. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed Array.prototype.toReversed()}.
	 * @returns A new typed array containing the elements in reversed order.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 * const reversed = bits.toReversed();
	 *
	 * console.log(bits);
	 * // Expected output: BitArray [1, 1, 0, 0, 1]
	 *
	 * console.log(reversed);
	 * // Expected output: BitArray [1, 0, 0, 1, 1]
	 * ```
	 */
	public toReversed(): BitArray {
		// 23.2.3.32 %TypedArray%.prototype.toReversed()
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.toreversed

		const len = this.length;
		// 4. Let A be ? TypedArrayCreateSameType(O, « 𝔽(length) »).
		const A = TypedArrayCreateSameType(this, len);
		A.set([...this].reverse());

		// 7. Return A.
		return A;
	}

	/**
	 * The {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#copying_methods_and_mutating_methods copying} version of the {@linkcode sort sort()} method. It returns a new typed array with the elements sorted in ascending order. This method has the same algorithm as {@linkcode Array.prototype.toSorted()}, except that it sorts the values numerically instead of as strings by default.
	 * @param comparefn Specifies a function that defines the sort order. If omitted, the typed array elements are sorted according to numeric value.
	 * @returns A new typed array with the elements sorted in ascending order.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 *
	 * console.log(bits.toSorted());
	 * // Expected output: BitArray [0, 0, 1, 1, 1]
	 *
	 * console.log(bits.toSorted((a, b) => b - a));
	 * // Expected output: BitArray [1, 1, 1, 0, 0]
	 *
	 * console.log(bits);
	 * // Expected output: BitArray [1, 1, 0, 0, 1]
	 * ```
	 */
	public toSorted(comparefn?: ((a: number, b: number) => number) | undefined): BitArray {
		// 23.2.3.33 %TypedArray%.prototype.toSorted(comparefn)
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tosorted

		// 1. If comparefn is not undefined and IsCallable(comparefn) is false, throw a TypeError exception.
		if (comparefn === undefined) comparefn = CompareTypedArrayElementsFallback;
		else if (typeof comparefn !== 'function') throw new TypeError('comparefn must be a function');

		const len = this.length;
		// 5. Let A be ? TypedArrayCreateSameType(O, « 𝔽(len) »).
		const A = TypedArrayCreateSameType(this, len);
		A.set([...this].sort(comparefn));

		// 11. Return A.
		return A;
	}

	/**
	 * Returns a string representing the specified typed array and its elements. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString Array.prototype.toString()}.
	 * @returns A string representing the elements of the typed array.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 *
	 * console.log(bits.toString());
	 * // Expected output: "1,1,0,0,1"
	 * ```
	 */
	public toString(): string {
		// 23.2.3.34 %TypedArray%.prototype.toString()
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tostring
		return this.join();
	}

	/**
	 * Returns a new {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator array iterator} object that iterates the value of each item in the typed array. This method has the same algorithm as {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values Array.prototype.values()}.
	 * @returns A new {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator iterable iterator object}.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 * const values = bits.values();
	 *
	 * values.next();
	 * values.next();
	 *
	 * console.log(values.next().value);
	 * // Expected output: 0
	 * ```
	 */
	public *values(): IterableIterator<number> {
		// 23.2.3.35 %TypedArray%.prototype.values()
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.values

		const len = this.length;
		if (len === 0) return;

		const buffer = this.#buffer;
		let byteOffset = 0;
		let byte = buffer[byteOffset];
		let mask = 1;
		for (let k = 0; k < len; ++k) {
			yield (byte & mask) === 0 ? 0 : 1;

			if ((mask <<= 1) === 0x100) {
				mask = 1;
				byte = buffer[++byteOffset];
			}
		}
	}

	/**
	 * The copying version of setting a value at a given index. It returns a new typed array with the element at the given index replaced with the given value. This method has the same algorithm as {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with Array.prototype.with()}.
	 * @param index Zero-based index at which to start searching, {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#integer_conversion converted to an integer}.
	 * @param value Any value to be assigned to the given index.
	 * @returns A new typed array with the element at `index` replaced with `value`.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 * const flipped = bits.with(2, 1);
	 *
	 * console.log(bits);
	 * // Expected output: BitArray [1, 1, 0, 0, 1]
	 *
	 * console.log(flipped);
	 * // Expected output: BitArray [1, 1, 1, 0, 1]
	 * ```
	 */
	public with(index: number, value: number): BitArray {
		// 23.2.3.36 %TypedArray%.prototype.with(index, value)
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype.with

		const len = this.length;
		// 4. Let relativeIndex be ? ToIntegerOrInfinity(index).
		const relativeIndex = ToIntegerOrInfinity(index);
		// 5. If relativeIndex ≥ 0, let actualIndex be relativeIndex.
		// 6. Else, let actualIndex be len + relativeIndex.
		const actualIndex = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
		// 7. If O.[[ContentType]] is BIGINT, let numericValue be ? ToBigInt(value).
		// 8. Else, let numericValue be ? ToNumber(value).
		const numericValue = Number(value) & 1;
		// 9. If IsValidIntegerIndex(O, 𝔽(actualIndex)) is false, throw a RangeError exception.
		if (!IsValidIntegerIndex(this, actualIndex)) throw new RangeError('index out of range');
		// 10. Let A be ? TypedArrayCreateSameType(O, « 𝔽(len) »).
		const A = TypedArrayCreateSameType(this, len);
		// 11. Let k be 0.
		let k = 0;
		// 12. Repeat, while k < len
		while (k < len) {
			// b. If k is actualIndex, let fromValue be numericValue.
			// c. Else, let fromValue be ! Get(O, Pk).
			const fromValue = k === actualIndex ? numericValue : this.at(k)!;
			// d. Perform ! Set(A, Pk, fromValue, true).
			A.setAt(k, fromValue);
			// e. Set k to k + 1.
			k++;
		}

		// 13. Return A.
		return A;
	}

	/**
	 * Implements the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols iterable protocol} and allows typed arrays to be consumed by most syntaxes expecting iterables, such as the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax spread syntax} and {@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of for...of} loops. It returns an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator array iterator object} that yields the value of each index in the typed array.
	 * @returns The same return value as {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/values TypedArray.prototype.values()}: a new {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator iterable iterator object} that yields the value of each index in the typed array.
	 * @example
	 * ```javascript
	 * const bits = new BitArray([1, 1, 0, 0, 1]);
	 *
	 * for (const bit of bits) {
	 *   console.log(bit);
	 * }
	 *
	 * // Expected output:
	 * // 1
	 * // 1
	 * // 0
	 * // 0
	 * // 1
	 * ```
	 */
	public [Symbol.iterator](): IterableIterator<number> {
		// 23.2.3.37 %TypedArray%.prototype[@@iterator]()
		// https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
		return this.values();
	}

	/**
	 * Returns an iterable iterator that yields the entries of the BitArray in reverse order.
	 * Each entry is a tuple of the index and the value (0 or 1).
	 */
	*#entriesReversed(): IterableIterator<[number, number]> {
		const len = this.length;
		if (len === 0) return;

		const buffer = this.#buffer;
		let byteOffset = this.byteLength - 1;
		let byte = buffer[byteOffset];
		let mask = 1 << len % 8;
		for (let k = len - 1; k >= 0; --k) {
			yield [k, (byte & mask) === 0 ? 0 : 1];

			if ((mask >>= 1) === 0) {
				mask = 0b1000_0000;
				byte = buffer[--byteOffset];
			}
		}
	}

	public get [Symbol.toStringTag]() {
		// 23.2.3.38 get %TypedArray%.prototype[@@toStringTag]
		// https://tc39.es/ecma262/#sec-get-%typedarray%.prototype-@@tostringtag

		const name = GetTypedArrayName(this);
		if (typeof name === 'string') return name;
		throw new TypeError('Symbol.toStringTag must be a string');
	}

	#InitializeTypedArrayFromTypedArray(srcArray: TypedArray) {
		// 23.2.5.1.2 InitializeTypedArrayFromTypedArray(O, srcArray)
		// https://tc39.es/ecma262/#sec-initializetypedarrayfromtypedarray

		// 1. Let srcData be srcArray.[[ViewedArrayBuffer]].
		const srcData = srcArray;
		// 2. Let elementType be TypedArrayElementType(O).
		const elementType = GetContentType(this)!;
		// 3. Let elementSize be TypedArrayElementSize(O).
		const elementSize = TypedArrayElementSize(this)!;
		// 4. Let srcType be TypedArrayElementType(srcArray).
		const srcType = GetContentType(srcArray)!;
		// 5. Let srcElementSize be TypedArrayElementSize(srcArray).
		const srcElementSize = TypedArrayElementSize(srcArray)!;
		// 6. Let srcByteOffset be srcArray.[[ByteOffset]].
		const srcByteOffset = srcArray.byteOffset;
		// 9. Let elementLength be IntegerIndexedObjectLength(srcRecord).
		const elementLength = srcArray.length;
		// 10. Let byteLength be elementSize × elementLength.
		const bitLength = elementSize * elementLength;
		const byteLength = Math.ceil(bitLength / 8);

		let data: Uint8Array;
		// 11. If elementType is srcType, then
		if (elementType === srcType) {
			// a. Let data be ? CloneArrayBuffer(srcData, srcByteOffset, byteLength).
			data = CloneArrayBuffer(srcData);
		} else {
			// 12. Else,
			// a. Let data be ? AllocateArrayBuffer(%ArrayBuffer%, byteLength).
			data = new Uint8Array(byteLength);
			// b. If srcArray.[[ContentType]] is not O.[[ContentType]], throw a TypeError exception.
			if (GetContentType(srcArray) !== GetContentType(this)) throw new TypeError('srcArray and target array have different content types');
			// c. Let srcByteIndex be srcByteOffset.
			let srcByteIndex = srcByteOffset;
			// d. Let targetByteIndex be 0.
			let targetByteIndex = 0;
			// e. Let count be elementLength.
			let count = elementLength;
			// f. Repeat, while count > 0,
			while (count > 0) {
				// i. Let value be GetValueFromBuffer(srcData, srcByteIndex, srcType, true, UNORDERED).
				const value = GetValueFromBuffer(srcData, srcByteIndex, srcType);
				// ii. Perform SetValueInBuffer(data, targetByteIndex, elementType, value, true, UNORDERED).
				SetValueInBuffer(data, targetByteIndex, elementType, value);
				// iii. Set srcByteIndex to srcByteIndex + srcElementSize.
				srcByteIndex += srcElementSize;
				// iv. Set targetByteIndex to targetByteIndex + elementSize.
				targetByteIndex += elementSize;
				// v. Set count to count - 1.
				count--;
			}
		}

		this.#buffer = data;
		this.#byteOffset = 0;
		this.#bitLength = bitLength;
	}

	#InitializeTypedArrayFromArrayBuffer(buffer: ArrayBuffer | SharedArrayBuffer, bitOffset: number | undefined, length: number | undefined) {
		// 23.2.5.1.3 InitializeTypedArrayFromArrayBuffer(O, buffer, byteOffset, length)
		// https://tc39.es/ecma262/#sec-initializetypedarrayfromarraybuffer

		let byteOffset: number;
		if (bitOffset === undefined) {
			byteOffset = 0;
		} else {
			this.#bitOffset = ToIndex(bitOffset);
			byteOffset = Math.floor(this.#bitOffset / 8);
		}

		this.#InitializeTypedArrayFromTypedArray(new Uint8Array(buffer, byteOffset, length));
	}

	#InitializeTypedArrayFromList(values: readonly any[]) {
		// 23.2.5.1.4 InitializeTypedArrayFromList(O, values)
		// https://tc39.es/ecma262/#sec-initializetypedarrayfromlist

		this.#InitializeTypedArrayFromArrayLike(values);
	}

	#InitializeTypedArrayFromArrayLike(arrayLike: ArrayLike<number>) {
		// 23.2.5.1.5 InitializeTypedArrayFromArrayLike(O, arrayLike)
		// https://tc39.es/ecma262/#sec-initializetypedarrayfromarraylike

		// 1. Let len be ? LengthOfArrayLike(arrayLike).
		const len = LengthOfArrayLike(arrayLike);
		// 2. Perform ? AllocateTypedArrayBuffer(O, len).
		const data = new Uint8Array(Math.ceil(len / 8));
		for (let k = 0, byteOffset = 0, mask = 1; k < len; ++k) {
			SetBit(this.#buffer, byteOffset, mask, Number(arrayLike[k]) & 1);

			if ((mask <<= 1) === 0x100) {
				mask = 1;
				byteOffset++;
			}
		}

		this.#buffer = data;
	}

	/**
	 * The size in bytes of each element in the typed array.
	 */
	public static readonly BYTES_PER_ELEMENT: 0.125;

	/**
	 * The size in bits of each element in the typed array.
	 */
	public static readonly BITS_PER_ELEMENT: 1;

	/**
	 * Returns the constructor used to construct return values from typed array methods.
	 * @returns The value of the constructor (`this`) on which `get @@species` was called. The return value is used to construct return values from typed array methods that create new typed arrays.
	 */
	public static get [Symbol.species](): typeof this {
		// 23.2.2.4 get %TypedArray%[@@species]
		// https://tc39.es/ecma262/#sec-get-%typedarray%-@@species
		return this;
	}
}

export interface BitArray {
	/**
	 * The size in bytes of each element in the typed array.
	 */
	readonly BYTES_PER_ELEMENT: 0.125;

	/**
	 * The size in bits of each element in the typed array.
	 */
	readonly BITS_PER_ELEMENT: 1;
}

const BYTES_PER_ELEMENT = 0.125 as const;
Reflect.defineProperty(BitArray.prototype, 'BYTES_PER_ELEMENT', { value: BYTES_PER_ELEMENT });
Reflect.defineProperty(BitArray, 'BYTES_PER_ELEMENT', { value: BYTES_PER_ELEMENT });

const BITS_PER_ELEMENT = 1;
Reflect.defineProperty(BitArray.prototype, 'BITS_PER_ELEMENT', { value: BITS_PER_ELEMENT });
Reflect.defineProperty(BitArray, 'BITS_PER_ELEMENT', { value: BITS_PER_ELEMENT });

defineBitArray(BitArray.prototype, {
	name: 'BitArray',
	size: 1,
	type: Number,
	converter: (value) => Number(value) & 1
});
