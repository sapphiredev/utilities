/**
 * Casts any value to `T`
 *
 * Note that this function is not type-safe, and may cause runtime errors if used incorrectly.
 * Also note that this function is effectively useless in a JavaScript project, it only serves a purpose for TypeScript projects.
 *
 * @param value The value to cast to another type
 * @returns The value but as type `T`
 */
export function cast<T>(value: unknown): T {
	return value as T;
}
