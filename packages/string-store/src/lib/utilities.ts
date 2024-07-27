export type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array
	| BigInt64Array
	| BigUint64Array;

/**
 * Converts a {@link TypedArray} to a string.
 *
 * @param buffer The buffer to convert
 * @returns The generated UTF16 string
 */
export function toUTF16(buffer: TypedArray) {
	let result = '';
	for (const value of new Uint16Array(buffer.buffer)) {
		result += String.fromCharCode(value);
	}

	return result;
}

/**
 * Converts a string to a {@link Uint16Array}.
 *
 * @param buffer The string to convert
 * @returns The generated {@link Uint16Array}
 */
export function fromUTF16(buffer: string): Uint16Array {
	const result = new Uint16Array(buffer.length);
	for (let i = 0; i < buffer.length; i++) {
		result[i] = buffer.charCodeAt(i);
	}

	return result;
}
