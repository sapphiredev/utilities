/**
 * Picks a random element from an array
 * @param array The array to pick a random element from
 */
export function pickRandom<T>(array: readonly T[], count?: 1): T;
export function pickRandom<T>(array: readonly T[], count: number): T[];
export function pickRandom<T>(array: readonly T[], count = 1): T | T[] {
	const arr = [...array];
	if (typeof count === 'undefined') return arr[Math.floor(Math.random() * arr.length)];
	if (!arr.length || !count) return [];
	return Array.from({ length: Math.min(count, arr.length) }, (): T => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]!);
}
