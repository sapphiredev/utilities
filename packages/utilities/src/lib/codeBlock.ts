const zws = String.fromCharCode(8203);

/**
 * Wraps the content inside a codeblock with no language
 *
 * @remark If the provided content includes 3 backticks (```) then those backticks will be escaped
 * by adding a [Zero Width Space](https://en.wikipedia.org/wiki/Zero-width_space) between the first and second backtick
 *
 * @remark If the provided content ends with a backtick then a [Zero Width Space](https://en.wikipedia.org/wiki/Zero-width_space) will be added
 * to the end of the content
 *
 * @param content - The content to wrap
 */
export function codeBlock<C extends string>(content: C): `\`\`\`\n${C}\n\`\`\``;

/**
 * Wraps the content inside a codeblock with the specified language
 *
 * @remark If the provided content includes 3 backticks (```) then those backticks will be escaped
 * by adding a [Zero Width Space](https://en.wikipedia.org/wiki/Zero-width_space) between the first and second backtick
 *
 * @remark If the provided content ends with a backtick then a [Zero Width Space](https://en.wikipedia.org/wiki/Zero-width_space) will be added
 * to the end of the content
 *
 * @param language The codeblock language
 * @param content The expression to be wrapped in the codeblock
 */
export function codeBlock<L extends string, C extends string>(language: L, content: C): `\`\`\`${L}\n${C}\n\`\`\``;
export function codeBlock(...args: [string, string?]): string {
	const [language, content] = args.length === 1 ? ['', args[0]] : args;
	return `\`\`\`${language}\n${String(content).replace(/```/, `\`${zws}\`\``).replace(/`$/g, `\`${zws}`)}\n\`\`\``;
}
