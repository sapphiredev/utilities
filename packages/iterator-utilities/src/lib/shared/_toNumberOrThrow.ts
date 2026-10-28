export function toNumberOrThrow(value: NumberResolvable): number {
	// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
	switch (typeof value) {
		case 'bigint':
			throw new TypeError('Cannot convert a BigInt value to a number');
		case 'symbol':
			throw new TypeError('Cannot convert a Symbol value to a number');
		case 'boolean':
			return value ? 1 : 0;
		case 'number':
			return assertNumber(value, value);
		case 'undefined':
			throw new TypeError('Cannot convert an undefined value to a number');
		default:
			return assertNumber(Number(value), value);
	}
}

export type NumberResolvable = boolean | number | { [Symbol.toPrimitive](): boolean | number | null } | { valueOf(): boolean | number | null } | null;

function assertNumber(value: number, original: unknown): number {
	if (Number.isNaN(value)) {
		throw new RangeError(`${original} must be a non-NaN number`);
	}

	return value;
}
