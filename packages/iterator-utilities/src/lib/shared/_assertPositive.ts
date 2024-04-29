export function assertPositive(value: number, original: unknown): number {
	if (value <= 0) {
		throw new RangeError(`${original} must be a positive number`);
	}

	return value;
}
