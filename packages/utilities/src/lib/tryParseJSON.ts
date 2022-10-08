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

export { tryParseJSON as tryParse };
