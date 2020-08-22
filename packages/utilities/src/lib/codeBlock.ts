const zws = String.fromCharCode(8203);

/**
 * Wraps text in a markdown codeblock with optionally a language indicator for syntax highlighting
 * @param expression The expression to be wrapped in the codeblock
 * @param language The codeblock language
 * @default 'md'
 */
export function codeBlock<T extends unknown>(expression: T, language = 'md'): string {
	if (typeof expression === 'string') {
		if (expression.length === 0) return `\`\`\`${zws}\`\`\``;
		return `\`\`\`${language}\n${expression.replace(/```/, `\`${zws}\`\``).replace(/`$/g, `\`${zws}`)}\`\`\``;
	}
	return `\`\`\`${language}\n${expression || zws}\`\`\``;
}
