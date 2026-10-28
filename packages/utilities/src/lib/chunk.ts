/**
 * Splits up an array into chunks
 *
 * @param array The array to chunk up
 * @param chunkSize The size of each individual chunk
 */
export function chunk<T>(array: readonly T[], chunkSize: number): T[][] {
	if (!Array.isArray(array)) throw new TypeError('entries must be an array.');
	if (!Number.isInteger(chunkSize)) throw new TypeError('chunkSize must be an integer.');
	if (chunkSize < 1) throw new RangeError('chunkSize must be 1 or greater.');
	const chunks: T[][] = [];
	for (let idx = 0; idx < array.length; idx += chunkSize) chunks.push(array.slice(idx, idx + chunkSize));
	return chunks;
}
