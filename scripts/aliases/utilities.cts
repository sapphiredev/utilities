export const aliasStore = new Map<string, string | string[]>([
	['filterNullAndUndefined', 'filterNullish'],
	['filterNullAndUndefinedAndEmpty', ['filterNullishAndEmpty', 'filterNullishOrEmpty']],
	['filterNullAndUndefinedAndZero', ['filterNullishAndZero', 'filterNullishOrZero']],
	['isNullOrUndefined', 'isNullish'],
	['isNullOrUndefinedOrEmpty', 'isNullishOrEmpty'],
	['isNullOrUndefinedOrZero', 'isNullishOrZero'],
	['snakeToCamelCase', 'kebabToCamelCase'],
	['tryParseJSON', 'tryParse'],
	['tryParseURL', 'parseURL']
]);
