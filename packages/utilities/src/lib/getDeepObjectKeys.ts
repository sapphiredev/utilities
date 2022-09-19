import { isNullOrUndefinedOrEmpty } from './isNullOrUndefinedOrEmpty';
import type { AnyObject } from './types';

/**
 * Flattens an object to a list of its keys, traversing deeply into nested objects and arrays of objects.
 *
 * @note By default Nested array values are flattened to `arrayKey.${index}.subKey`.
 * This can be changed to `arrayKey[${index}].subKey` by setting `options.arrayKeysIndexStyle` to `'braces-with-dot'`.
 * Or it can also be changed to `arrayKey[${index}]subKey` by setting `options.arrayKeysIndexStyle` to `'braces'`.
 *
 * @param obj The object of which to deeply retrieve its keys
 * @param options The options with which to customize the output of this function
 * @returns An array of strings holding the keys of the object
 */
export function getDeepObjectKeys<T>(obj: AnyObject<T>, options?: GetDeepObjectKeysOptions): string[] {
	return [...getDeepObjectKeysGenerator(obj, options)];
}

function* getDeepObjectKeysGenerator<T>(
	obj: AnyObject<T>,
	{ arrayKeysIndexStyle = 'dotted' }: GetDeepObjectKeysOptions = { arrayKeysIndexStyle: 'dotted' }
): Generator<string> {
	if (Array.isArray(obj)) {
		for (const [index, value] of obj.entries()) {
			yield* getDeepArrayKeysRecursive(value, index, { arrayKeysIndexStyle });
		}
	} else {
		for (const [key, value] of Object.entries(obj)) {
			yield* getDeepObjectKeysRecursive(value, `${key}`, { arrayKeysIndexStyle });
		}
	}
}

function* getDeepArrayKeysRecursive(value: unknown, index: number, { arrayKeysIndexStyle }: GetDeepObjectKeysOptions): Generator<string> {
	const resolvedIndex = arrayKeysIndexStyle === 'dotted' ? `${index}` : arrayKeysIndexStyle === 'braces' ? `[${index}]` : `[${index}].`;
	yield* getDeepObjectKeysRecursive(value, resolvedIndex, { arrayKeysIndexStyle });
}

function* getDeepObjectKeysRecursive(obj: unknown, prefix: string, { arrayKeysIndexStyle }: GetDeepObjectKeysOptions): Generator<string> {
	if (typeof obj !== 'object' || obj === null) {
		yield prefix;
		return;
	}

	if (Array.isArray(obj)) {
		for (const [index, value] of obj.entries()) {
			const resolvedPrefixedIndex = arrayKeysIndexStyle === 'dotted' ? `${prefix}.${index}` : `${prefix}[${index}]`;

			yield* getDeepObjectKeysRecursive(value, resolvedPrefixedIndex, { arrayKeysIndexStyle });
		}
	} else {
		const objectEntries = Object.entries(obj);
		if (isNullOrUndefinedOrEmpty(objectEntries) && prefix) {
			yield prefix;
		} else {
			for (const [key, value] of objectEntries) {
				yield* getDeepObjectKeysRecursive(value, arrayKeysIndexStyle === 'braces' ? `${prefix}${key}` : `${prefix}.${key}`, {
					arrayKeysIndexStyle
				});
			}
		}
	}
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
