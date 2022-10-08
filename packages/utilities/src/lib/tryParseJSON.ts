/**
 * Try parse a stringified JSON string.
 * @param value The value to parse
 */
export function tryParseJSON(value: string): object | string | number {
	try {
		return JSON.parse(value);
	} catch (err) {
		return value;
	}
}

export {
	/**
	 * @deprecated Will be removed in the next major version, switch to {@link tryParseJSON}.
	 */
	tryParseJSON as tryParse
};
