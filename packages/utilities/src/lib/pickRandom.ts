/**
 * Picks a random element from an array
 * @param array The array to pick a random element from
 */
export function pickRandom<T>(array: readonly T[], count?: 1): T;
export function pickRandom<T>(array: readonly T[], count: number): T[];
export function pickRandom<T>(array: readonly T[], count = 1): T | T[] {
	const picked: T[] = [];
	for (let i = 0; i < count; i++) {
		picked.push(array[Math.floor(Math.random() * array.length)]);
	}

	return count === 1 ? picked[0] : picked;
}
