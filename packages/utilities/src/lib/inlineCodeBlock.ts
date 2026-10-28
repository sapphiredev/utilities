const zws = String.fromCodePoint(8_203);

/**
 * Wraps text in a markdown inline codeblock
 *
 * @param content The expression to be wrapped in the codeblock
 */
export function inlineCodeBlock<C extends string>(content: C): `\`${C}\`` {
	// Replace spaces with non-breaking spaces
	// eslint-disable-next-line no-param-reassign
	content = content.replaceAll(' ', '\u00A0') as C;

	// Replace backticks with zero-width-space escaped backticks
	// eslint-disable-next-line no-param-reassign
	content = content.replaceAll('`', `\`${zws}`) as C;

	// Return the input wrapped in backticks
	return `\`${content}\``;
}
