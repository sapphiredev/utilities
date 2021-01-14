/**
 * Parses an URL, returns null if invalid.
 * @param url The url to parse
 */
export function parseURL(url: string): URL | null {
	try {
		return new URL(url);
	} catch {
		return null;
	}
}
