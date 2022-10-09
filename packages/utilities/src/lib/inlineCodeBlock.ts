const zws = String.fromCharCode(8203);

/**
 * Wraps text in a markdown inline codeblock
 * @param content The expression to be wrapped in the codeblock
 */
export function inlineCodeBlock<C extends string>(content: C): `\`${C}\`` {
	// Replace spaces with non-breaking spaces
	content = content.replace(/ /g, '\u00A0') as C;

	// Replace backticks with zero-width-space escaped backticks
	content = content.replace(/`/g, `\`${zws}`) as C;

	// Return the input wrapped in backticks
	return `\`${content}\``;
}
