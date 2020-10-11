const primitiveTypes = ['string', 'bigint', 'number', 'boolean'];

/**
 * Check whether a value is a primitive
 * @param input The input to check
 */
export function isPrimitive(input: unknown): input is string | bigint | number | boolean {
	return primitiveTypes.includes(typeof input);
}
