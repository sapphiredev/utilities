import { isObject } from './isObject';
import type { AnyObject } from './utilityTypes';

/**
 * Flattens an object to a list of its keys, traversing deeply into nested objects and arrays of objects.
 *
 * @note By default Nested array values are flattened to `arrayKey.${index}.subKey`. This can be changed to `arrayKey[${index}].subKey` by setting `arrayKeysBracedIndex` to `true`.
 *
 * @param obj The object of which to deeply retrieve its keys
 * @returns An array of strings holding the keys of the object
 */
export function getDeepObjectKeys<T>(
	obj: AnyObject<T>,
	{ arrayKeysIndexStyle = 'dotted' }: GetDeepObjectKeysOptions = { arrayKeysIndexStyle: 'dotted' }
): string[] {
	const keys: string[] = [];

	for (const [key, value] of Object.entries(obj)) {
		if (Array.isArray(value)) {
			for (const [index, innerValue] of value.entries()) {
				const arraySubKeys = getDeepObjectKeys(innerValue);
				keys.push(
					...arraySubKeys.map((arraySubKey) => {
						switch (arrayKeysIndexStyle) {
							case 'braces-with-dot':
								return `${key}[${index}].${arraySubKey}`;
							case 'braces':
								return `${key}[${index}]${arraySubKey}`;
							case 'dotted':
							default:
								return `${key}.${index}.${arraySubKey}`;
						}
					})
				);
			}
		} else if (isObject(value)) {
			const objectSubKeys = getDeepObjectKeys(value);
			keys.push(...objectSubKeys.map((subKey) => `${key}.${subKey}`));
		} else {
			keys.push(key);
		}
	}

	return keys;
}

/**
 * The options for {@link getDeepObjectKeys}
 */
export interface GetDeepObjectKeysOptions {
	/**
	 * Whether to use `.${index}.` (`'dotted'`), `[${index}].`, (`'braces-with-dot'`) or `[${index}]` (`'braces'`) to separate array keys
	 * @default 'dotted'
	 */
	arrayKeysIndexStyle?: 'dotted' | 'braces-with-dot' | 'braces';
}
