import { toNumberOrThrow } from './toNumberOrThrow';

export function toIntegerOrThrow(value: number): number {
	const number = toNumberOrThrow(value);
	if (Number.isNaN(number) || number === 0) return 0;
	if (number === Number.POSITIVE_INFINITY) throw new RangeError('+Infinity cannot be represented as an integer');
	if (number === Number.NEGATIVE_INFINITY) throw new RangeError('-Infinity cannot be represented as an integer');

	return Math.trunc(number);
}
