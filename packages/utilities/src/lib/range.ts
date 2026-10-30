/**
 * Get an array of numbers with the selected range
 *
 * @param min - The minimum value
 * @param max - The maximum value
 * @param step - The step value
 */
export function range(min: number, max: number, step: number): number[] {
	// eslint-disable-next-line unicorn/no-new-array
	return new Array(Math.floor((max - min) / step) + 1).fill(0).map((_val, idx) => min + idx * step);
}
