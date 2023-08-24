export const aliasStore = new Map([
	['filterNullAndUndefined', 'filterNullish'],
	['filterNullAndUndefinedAndEmpty', ['filterNullishAndEmpty', 'filterNullishOrEmpty']],
	['filterNullAndUndefinedAndZero', ['filterNullishAndZero', 'filterNullishOrZero']],
	['isNullOrUndefined', 'isNullish'],
	['isNullOrUndefinedOrEmpty', 'isNullishOrEmpty'],
	['isNullOrUndefinedOrZero', 'isNullishOrZero'],
	['tryParseJSON', 'tryParse'],
	['tryParseURL', 'parseURL']
]);
