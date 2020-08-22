/**
 * Checks whether or not a value is null or undefined
 * @param value The value to check
 */
export function isNullOrUndefined(value: unknown): value is undefined | null {
	return value === undefined || value === null;
}
