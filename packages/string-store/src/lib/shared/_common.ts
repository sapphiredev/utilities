export function isArrayLike(object: unknown): object is ArrayLike<unknown> {
	// If the item is not an object, it is not array-like:
	if (!isObject(object)) return false;
	// If the item is an array, it is array-like:
	if (Array.isArray(object)) return true;
	// If the item doesn't have a numeric length property, it is not array-like:
	if (!hasLength(object)) return false;
	// If the length isn't a valid index, it is not array-like:
	if (!isValidLength(object.length)) return false;

	return object.length === 0 || object.length - 1 in object;
}

function isObject(item: unknown): item is object {
	return typeof item === 'object' && item !== null;
}

function hasLength(item: object): item is { length: number } {
	return 'length' in item && typeof item.length === 'number';
}

export function isValidLength(length: number) {
	return Number.isSafeInteger(length) && length >= 0 && length < 2147483648;
}
