import { isObject } from './isObject';

/**
 * Convert an object to a tuple
 * @param value The object to convert
 * @param prefix The prefix for the key
 */
export function objectToTuples(original: Record<string, unknown>, prefix = ''): [string, unknown][] {
	const entries: [string, unknown][] = [];
	for (const [key, value] of Object.entries(original)) {
		if (isObject(value)) {
			entries.push(...objectToTuples(value as Record<string, unknown>, `${prefix}${key}.`));
		} else {
			entries.push([`${prefix}${key}`, value]);
		}
	}

	return entries;
}
