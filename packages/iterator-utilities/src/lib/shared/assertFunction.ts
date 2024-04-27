export function assertFunction<Fn extends (...args: any[]) => any>(value: Fn): Fn {
	if (typeof value !== 'function') {
		throw new TypeError(`${value} must be a function`);
	}

	return value;
}
