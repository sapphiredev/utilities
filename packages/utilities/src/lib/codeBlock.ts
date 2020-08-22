const zws = String.fromCharCode(8203);

/**
 * Wraps text in a markdown codeblock with optionally a language indicator for syntax highlighting
 * @param language The codeblock language
 * @param expression The expression to be wrapped in the codeblock
 */
export function codeBlock<T extends unknown>(language: string, expression: T): string {
	if (typeof expression === 'string') {
		if (expression.length === 0) return `\`\`\`${zws}\`\`\``;
		return `\`\`\`${language}\n${expression.replace(/```/, `\`${zws}\`\``).replace(/`$/g, `\`${zws}`)}\`\`\``;
	}
	return `\`\`\`${language}\n${expression || zws}\`\`\``;
}
