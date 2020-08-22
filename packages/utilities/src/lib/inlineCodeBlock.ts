const zws = String.fromCharCode(8203);

/**
 * Wraps text in a markdown inline codeblock
 * @param expression The expression to be wrapped in the codeblock
 */
export function inlineCodeBlock(input: string): string {
	return `\`${input.replace(/ /g, '\u00A0').replace(/`/g, `\`${zws}`)}\``;
}
