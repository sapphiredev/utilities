/**
 * Verify if the input is a function.
 * @param input The function to verify
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(input: unknown): input is Function {
	return typeof input === 'function';
}
