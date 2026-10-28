/**
 * Verify if a number is a finite number.
 *
 * @param input The number to verify
 */
export function isNumber(input: unknown): input is number {
	// eslint-disable-next-line no-param-reassign
	if (typeof input === 'string') input = Number(input);
	return typeof input === 'number' && !Number.isNaN(input) && Number.isFinite(input);
}
