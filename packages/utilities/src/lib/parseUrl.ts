import type { URL } from 'url';

/**
 * Parses an URL, returns null if invalid.
 * @param url The url to parse
 */
export function parseURL(url: string): URL | null {
	try {
		// @ts-expect-error URL is global in NodeJS and evergreen Browsers
		return new URL(url);
	} catch {
		return null;
	}
}
