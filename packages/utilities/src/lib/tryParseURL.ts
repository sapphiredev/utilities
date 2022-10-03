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

/**
 * Parses an URL, returns null if invalid.
 * @param url The url to parse
 * @deprecated Use {@link tryParseURL} instead
 */
export function parseURL(url: string): URL | null {
	try {
		return new URL(url);
	} catch {
		return null;
	}
}
