/**
 * Verify if the input is a function.
 * @param input The function to verify
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(input: unknown): input is Function {
	return typeof input === 'function';
}
