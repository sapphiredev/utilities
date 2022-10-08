/**
 * Tries parse a string to a {@link URL} object
 * @param value The possible URL to parse
 * @returns an URL object if it was a valid URL or `null` if it was not.
 */
export function tryParseURL(value: string): URL | null {
	try {
		return new URL(value);
	} catch {
		return null;
	}
}

export {
	/**
	 * @deprecated Will be removed in the next major version, switch to {@link tryParseURL}.
	 */
	tryParseURL as parseURL
};
