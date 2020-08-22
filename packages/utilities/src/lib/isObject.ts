/* eslint-disable @typescript-eslint/ban-types */
/**
 * Verify if the input is an object literal (or class).
 * @param input The object to verify
 */
export function isObject(input: unknown): input is Record<PropertyKey, unknown> | object {
	return typeof input === 'object' && input ? input.constructor === Object : false;
}
