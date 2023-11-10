import type { BitArray } from './BitArray';

export const TypedArray = Object.getPrototypeOf(Uint8Array) as TypedArrayConstructor;
export type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| BigInt64Array
	| BigUint64Array;

export type TypedArrayConstructor =
	| Int8ArrayConstructor
	| Uint8ArrayConstructor
	| Uint8ClampedArrayConstructor
	| Int16ArrayConstructor
	| Uint16ArrayConstructor
	| Int32ArrayConstructor
	| Uint32ArrayConstructor
	| BigInt64ArrayConstructor
	| BigUint64ArrayConstructor;

export function HasArrayBufferData(data: object): data is ArrayBuffer | SharedArrayBuffer {
	return data instanceof ArrayBuffer || data instanceof SharedArrayBuffer;
}

export function GetValueFromBuffer(srcData: ArrayBufferLike, srcByteIndex: number, srcType: NumberConstructor | BigIntConstructor): number {
	// 25.1.3.15 GetValueFromBuffer(arrayBuffer, byteIndex, type, isTypedArray, order [, isLittleEndian])
	// https://tc39.es/ecma262/#sec-getvaluefrombuffer

	void srcData;
	void srcByteIndex;
	void srcType;

	// TODO: Finish
	throw new Error('Function not implemented.');
}

export function SetValueInBuffer(data: Uint8Array, targetByteIndex: number, elementType: NumberConstructor | BigIntConstructor, value: number) {
	// 25.1.3.17 SetValueInBuffer(arrayBuffer, byteIndex, type, value, isTypedArray, order [, isLittleEndian])
	// https://tc39.es/ecma262/#sec-setvalueinbuffer

	void data;
	void targetByteIndex;
	void elementType;
	void value;

	// TODO: Finish
	throw new Error('Function not implemented.');
}

export function CloneArrayBuffer(srcBuffer: TypedArray): Uint8Array {
	// 25.1.3.5 CloneArrayBuffer(srcBuffer, srcByteOffset, srcLength)
	// https://tc39.es/ecma262/#sec-clonearraybuffer

	// 2. Let targetBuffer be ? AllocateArrayBuffer(%ArrayBuffer%, srcLength).
	return new Uint8Array(srcBuffer);
}

export function SetBit(buffer: Uint8Array, byteOffset: number, mask: number, value: number): number {
	return value === 1 ? (buffer[byteOffset] |= mask) : (buffer[byteOffset] &= ~mask);
}

export function GetMethod<ReturnType>(V: object, P: PropertyKey): (() => ReturnType) | undefined {
	// 7.3.11 GetMethod(V, P)
	// https://tc39.es/ecma262/#sec-getmethod

	// 1. Let func be ? GetV(V, P).
	const func = Reflect.get(V, P);
	// 2. If func is either undefined or null, return undefined.
	if (func === undefined || func === null) return undefined;
	// 3. If IsCallable(func) is false, throw a TypeError exception.
	if (typeof func !== 'function') throw new TypeError(`${func} is not a function`);
	// 4. Return func.
	return func;
}

export function IsValidIntegerIndex(O: BitArray, index: number) {
	// 10.4.5.14 IsValidIntegerIndex(O, index)
	// https://tc39.es/ecma262/#sec-isvalidintegerindex

	// 2. If IsIntegralNumber(index) is false, return false.
	if (!Number.isInteger(index)) return false;
	// 3. If index is -0𝔽, return false.
	if (Object.is(index, -0)) return false;
	// 6. If IsIntegerIndexedObjectOutOfBounds(iieoRecord) is true, return false.
	if (index < 0 || index >= O.length) return false;

	return true;
}

export function ToIntegerOrInfinity(argument: any) {
	// 7.1.5 ToIntegerOrInfinity(argument)
	// https://tc39.es/ecma262/#sec-tointegerorinfinity

	const number = Number(argument);
	if (Number.isNaN(number) || number === 0) return 0;
	if (!Number.isFinite(number)) return number;
	return Math.trunc(number);
}

export function ToIndex(value: any) {
	// 7.1.22 ToIndex(value)
	// https://tc39.es/ecma262/#sec-toindex

	// 1. Let integer be ? ToIntegerOrInfinity(value).
	const integer = ToIntegerOrInfinity(value);
	// 2. If integer is not in the inclusive interval from 0 to 2**53 - 1, throw a RangeError exception.
	if (integer < 0 || integer > Number.MAX_SAFE_INTEGER) throw new RangeError('index out of range');
	// 3. Return integer.
	return integer;
}

export function SetTypedArrayFromTypedArray(target: BitArray, targetOffset: number, source: ArrayBufferView) {
	// 23.2.3.26.1 SetTypedArrayFromTypedArray(target, targetOffset, source)
	// https://tc39.es/ecma262/#sec-settypedarrayfromtypedarray

	void target;
	void targetOffset;
	void source;

	// TODO: Finish
	throw new Error('Function not implemented.');
}

export function SetTypedArrayFromArrayLike(target: BitArray, targetOffset: number, source: ArrayLike<number>) {
	// 23.2.3.26.2 SetTypedArrayFromArrayLike(target, targetOffset, source)
	// https://tc39.es/ecma262/#sec-settypedarrayfromarraylike

	const targetLength = target.length;

	// 4. Let src be ? ToObject(source).
	const src = Object(source);
	// 5. Let srcLength be ? LengthOfArrayLike(src).
	const srcLength = LengthOfArrayLike(src);
	// 6. If targetOffset = +∞, throw a RangeError exception.
	if (targetOffset === Number.POSITIVE_INFINITY) throw new RangeError('targetOffset cannot be infinite');
	// 7. If srcLength + targetOffset > targetLength, throw a RangeError exception.
	if (srcLength + targetOffset > targetLength) throw new RangeError('srcLength + targetOffset cannot be greater than targetLength');

	for (let k = 0; k < srcLength; k++) {
		const value = k in src ? src[k] : 0;
		target.setAt(targetOffset + k, value);
	}
}

export function LengthOfArrayLike(obj: any) {
	// 7.3.19 LengthOfArrayLike(obj)
	// https://tc39.es/ecma262/#sec-lengthofarraylike

	// 1. Return ℝ(? ToLength(? Get(obj, "length"))).
	return ToLength(obj.length);
}

export function ToLength(argument: number) {
	// 7.1.20 ToLength(argument)
	// https://tc39.es/ecma262/#sec-tolength

	// 1. Let len be ? ToIntegerOrInfinity(argument).
	const len = ToIntegerOrInfinity(argument);
	// 2. If len ≤ 0, return +0.
	if (len <= 0) return 0;
	// 3. Return min(len, 2^53 - 1).
	return Math.min(len, Number.MAX_SAFE_INTEGER);
}

export interface BitArrayDefinition<T extends number | bigint> {
	// [[TypedArrayName]]
	name: string;
	// [[ContentType]]
	type: NumberConstructor | BigIntConstructor;
	// Bits per element
	size: number;
	converter: (value: T) => T;
}

const BitArrayDefinition = Symbol('@sapphire/bit-array:BitArrayDefinition');
export function defineBitArray<T extends number | bigint>(ctor: object, definition: BitArrayDefinition<T>) {
	Reflect.set(ctor, BitArrayDefinition, definition);
}

export function GetBitArrayDefinition<T extends number | bigint = number | bigint>(obj: object) {
	return Reflect.get(obj, BitArrayDefinition) as BitArrayDefinition<T> | undefined;
}

export function GetContentType(obj: object) {
	return GetBitArrayDefinition(obj)?.type;
}

export function GetTypedArrayName(obj: object) {
	return GetBitArrayDefinition(obj)?.name;
}

export function TypedArrayElementSize(obj: object) {
	return GetBitArrayDefinition(obj)?.size;
}

export function TypedArraySpeciesCreate<T extends ArrayBufferView>(exemplar: T, argumentsList: readonly any[], methodName: string): T {
	// 23.2.4.1 TypedArraySpeciesCreate ( exemplar, argumentList )
	// https://tc39.es/ecma262/#typedarray-species-create

	// 2. Let constructor be ? SpeciesConstructor(exemplar, defaultConstructor).
	const ctor = SpeciesConstructor(exemplar);
	// 3. Let result be ? TypedArrayCreate(constructor, argumentList).
	const result = Reflect.construct(ctor, argumentsList);
	// 4. Assert: result has [[TypedArrayName]] and [[ContentType]] internal slots.
	const contentType = GetContentType(result);
	if (contentType === undefined) throw new TypeError(`Method ${methodName} called on incompatible receiver ${String(result)}`);
	// 5. If result.[[ContentType]] ≠ exemplar.[[ContentType]], throw a TypeError exception.
	if (contentType !== GetContentType(exemplar)) throw new TypeError(`${methodName} constructed typed array of different content type from |this|`);
	// 6. Return result.
	return result;
}

export function TypedArrayCreateSameType<T extends ArrayBufferView>(exemplar: T, length: number): T {
	// 23.2.4.3 TypedArrayCreateSameType(exemplar, argumentList)
	// https://tc39.es/ecma262/#sec-typedarray-create-same-type

	// 1. Let constructor be the intrinsic object associated with the constructor name exemplar.[[TypedArrayName]]
	const ctor = exemplar.constructor as Constructor<T>;
	// 2. Return ? TypedArrayCreate(constructor, argumentList).
	return Reflect.construct(ctor, [length]);
}

export function SpeciesConstructor<T extends ArrayBufferView>(O: T): Constructor<T> {
	// 7.3.23 SpeciesConstructor(O, defaultConstructor)
	// https://tc39.es/ecma262/#sec-speciesconstructor

	// 1. Let C be ? Get(O, "constructor").
	const C = O.constructor as Constructor<T>;
	// 3. If C is not an Object, throw a TypeError exception.
	if (typeof C !== 'function') throw new TypeError('target.constructor is not a constructor');
	// 4. Let S be ? Get(C, @@species).
	const S = Reflect.get(C, Symbol.species) as Constructor<T>;
	// 5. If S is either undefined or null, return defaultConstructor.
	if (S === undefined || S === null) return C;
	// 6. If IsConstructor(S) is true, return S.
	if (typeof S === 'function') return S;
	// 7. Throw a TypeError exception.
	throw new TypeError('target.constructor[Symbol.species] is not a constructor');
}

export function CompareTypedArrayElementsFallback(x: number, y: number): -1 | 0 | 1 {
	// 23.2.4.7 CompareTypedArrayElements (x, y, comparefn)
	// https://tc39.es/ecma262/#sec-comparetypedarrayelements

	// 3. If x and y are both NaN, return +0𝔽.
	if (Number.isNaN(x) && Number.isNaN(y)) return 0;
	// 4. If x is NaN, return 1𝔽.
	if (Number.isNaN(x)) return 1;
	// 5. If y is NaN, return -1𝔽.
	if (Number.isNaN(y)) return -1;
	// 6. If x < y, return -1𝔽.
	if (x < y) return -1;
	// 7. If x > y, return 1𝔽.
	if (x > y) return 1;
	// 8. If x is -0𝔽 and y is +0𝔽, return -1𝔽.
	if (Object.is(x, -0) && Object.is(y, +0)) return -1;
	// 9. If x is +0𝔽 and y is -0𝔽, return 1𝔽.
	if (Object.is(x, +0) && Object.is(y, -0)) return 1;
	// 10. Return +0𝔽.
	return 0;
}

export interface Constructor<T extends object> {
	new (...args: any[]): T;
}
