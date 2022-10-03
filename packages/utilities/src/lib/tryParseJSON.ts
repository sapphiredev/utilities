/**
 * Try parse a stringified JSON string.
 * @param value The value to parse
 */
export function tryParseJSON(value: string): object | string {
	try {
		return JSON.parse(value);
	} catch (err) {
		return value;
	}
}

/**
 * Try parse a stringified JSON string.
 * @param value The value to parse
 * @deprecated Use {@link tryParseJSON} instead
 */
export function tryParse(value: string): object | string {
	return tryParseJSON(value);
}
