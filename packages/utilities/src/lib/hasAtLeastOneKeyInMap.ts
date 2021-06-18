/**
 * Checks whether any of the {@link keys} are in the {@link map}
 * @param map The map to check
 * @param keys The keys to find in the map
 * @returns `true` if at least one of the {@link keys} is in the {@link map}, `false` otherwise.
 */
export function hasAtLeastOneKeyInMap<T>(map: ReadonlyMap<T, any>, keys: readonly T[]): boolean {
	return keys.some((key) => map.has(key));
}
