/**
 * Converts a TypeScript enum to a 1-way object, stripping out the number keys.
 * @param enumObject The enum to convert
 * @example
 * ```typescript
 * enum Permissions {
 * 	Read: 1 << 0,
 * 	Write: 1 << 1
 * }
 * // {
 * // 	Read: 1,
 * // 	Write: 2,
 * // 	1: 'Read',
 * // 	2: 'Write'
 * // }
 *
 * enumToObject(Permissions);
 * // { Read: 1, Write: 2 }
 * ```
 * @returns The mapped object
 */
export function enumToObject<T extends object>(enumObject: T): { [K in Exclude<keyof T, `${number}`>]: T[K] } {
	const result = {} as { [K in Exclude<keyof T, `${number}`>]: T[K] };
	for (const [key, value] of Object.entries(enumObject)) {
		if (Number.isNaN(Number(key))) result[key as Exclude<keyof T, `${number}`>] = value;
	}

	return result;
}
