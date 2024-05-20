/**
 * Transforms text from `snAkE_cASE` to `camelCase`.
 * @param str - Text to transform
 * @returns the input `st_R` as `stR`
 *
 * @example
 * ```ts
 * snakeToCamelCase('hello_world') // 'helloWorld'
 * ```
 */
export function snakeToCamelCase(str: string) {
	return str.toLowerCase().replace(/([-_][a-z])/g, (group: string) => group.slice(1).toUpperCase());
}

export { snakeToCamelCase as kebabToCamelCase };
