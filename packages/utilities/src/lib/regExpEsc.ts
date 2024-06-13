import { charIn, createRegExp, global } from 'magic-regexp';

const REGEXPESC = createRegExp(charIn('-/\\^$*+?.()|[]{}'), [global]);

/**
 * Cleans a string from regex injection
 * @param str The string to clean
 */
export function regExpEsc(str: string): string {
	return str.replace(REGEXPESC, '\\$&');
}
