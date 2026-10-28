/**
 * Try parse a stringified JSON string.
 *
 * @param value The string to parse as JSON.
 * @param reviver A function that transforms the results. This function is recursively called for each member of the object.
 */
export function tryParseJSON(
	value: string,
	reviver?: (this: object, key: string, value: unknown) => unknown
): boolean | number | object | string | null {
	try {
		return JSON.parse(value, reviver);
	} catch {
		return value;
	}
}

export {
	/**
	 * @deprecated Will be removed in the next major version, switch to {@link tryParseJSON}.
	 */
	tryParseJSON as tryParse
};
