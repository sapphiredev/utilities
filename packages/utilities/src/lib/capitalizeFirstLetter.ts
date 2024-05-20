/**
 * Transforms the first letter to a capital then adds all the rest after it
 *
 * This differs from {@link toTitleCase} in that it doesn't force lowercase on the rest of the string.
 *
 * @param str - Text to transform
 * @returns The input `str` as `Str`
 *
 * @example
 * ```ts
 * capitalizeFirstLetter('hello world') // 'Hello world'
 * ```
 */
export function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
