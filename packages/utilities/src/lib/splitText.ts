/**
 * Split a string by its latest space character in a range from the character 0 to the selected one.
 *
 * @param str The text to split.
 * @param length The length of the desired string.
 * @param char The character to split with
 * @copyright 2019 Aura Román
 * @license Apache-2.0
 */
export function splitText(str: string, length: number, char = ' ') {
	const x = str.slice(0, Math.max(0, length)).lastIndexOf(char);
	const pos = x === -1 ? length : x;
	return str.slice(0, Math.max(0, pos));
}
