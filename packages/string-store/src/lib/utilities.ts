export type TypedArray =
	| BigInt64Array
	| BigUint64Array
	| Float32Array
	| Float64Array
	| Int8Array
	| Int16Array
	| Int32Array
	| Uint8Array
	| Uint8ClampedArray
	| Uint16Array
	| Uint32Array;

/**
 * Converts a {@link TypedArray} to a string.
 *
 * @param buffer - The buffer to convert
 * @returns The generated UTF16 string
 */
export function toUTF16(buffer: TypedArray) {
	let result = '';
	for (const value of new Uint16Array(buffer.buffer)) {
		result += String.fromCodePoint(value);
	}

	return result;
}

/**
 * Converts a string to a {@link Uint16Array}.
 *
 * @param buffer - The string to convert
 * @returns The generated {@link Uint16Array}
 */
export function fromUTF16(buffer: string): Uint16Array {
	const result = new Uint16Array(buffer.length);
	for (let idx = 0; idx < buffer.length; idx++) {
		result[idx] = buffer.codePointAt(idx)!;
	}

	return result;
}
