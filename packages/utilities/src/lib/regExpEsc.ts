// eslint-disable-next-line @typescript-eslint/naming-convention
const REGEXPESC = /[-/\\^$*+?.()|[\]{}]/g;

/**
 * Cleans a string from regex injection
 * @param str The string to clean
 */
export function regExpEsc(str: string): string {
	return str.replace(REGEXPESC, '\\$&');
}
