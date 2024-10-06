/**
 * Rounds a number to a specified amount of decimal places.
 *
 * @param input The number to round off
 * @param decimals The amount of decimals to retain
 */
export function roundNumber(input: number | string, decimals = 0) {
	const value = Number(input);

	if (decimals === 0) {
		return Math.round(value);
	}

	const scale = 10 ** decimals;
	return Math.round(value * scale) / scale;
}
