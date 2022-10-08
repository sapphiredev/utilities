/**
 * Picks a random element from an array
 * @param array The array to pick a random element from
 */
export function pickRandom<T>(array: readonly T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}
