/**
 * Parses an URL, returns null if invalid.
 * @param url The url to parse
 */
export function parseURL(url: string) {
	try {
		// @ts-expect-error URL is globally available in NodeJS and browsers
		return new URL(url);
	} catch {
		return null;
	}
}
