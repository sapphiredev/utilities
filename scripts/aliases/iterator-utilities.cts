export const aliasStore = new Map<string, string | string[]>([
	['append', 'concat'],
	['difference', ['except', 'omit']],
	['drop', 'skip'],
	['dropLast', 'skipLast'],
	['dropWhile', 'skipWhile'],
	['indexOf', 'position']
]);
