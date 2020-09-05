/**
 * Properly rounds up or down a number.
 * Also supports strings using an exponent to indicate large or small numbers.
 * @param num The number to round off
 * @param scale The amount of decimals to retain
 */
export function roundNumber(num: number | string, scale = 0) {
	if (!num.toString().includes('e')) {
		return Number(`${Math.round(Number(`${num}e+${scale}`))}e-${scale}`);
	}
	const arr = `${num}`.split('e');
	let sig = '';

	if (Number(arr[1]) + scale > 0) {
		sig = '+';
	}

	return Number(`${Math.round(Number(`${Number(arr[0])}e${sig}${Number(arr[1]) + scale}`))}e-${scale}`);
}
