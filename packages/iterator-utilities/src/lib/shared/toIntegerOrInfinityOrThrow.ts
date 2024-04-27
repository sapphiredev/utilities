import { toNumberOrThrow } from './toNumberOrThrow';

export function toIntegerOrInfinityOrThrow(value: number): number {
	const number = toNumberOrThrow(value);
	if (Number.isNaN(number) || number === 0) return 0;
	if (number === Number.POSITIVE_INFINITY) return Number.POSITIVE_INFINITY;
	if (number === Number.NEGATIVE_INFINITY) return Number.NEGATIVE_INFINITY;

	return Math.trunc(number);
}
