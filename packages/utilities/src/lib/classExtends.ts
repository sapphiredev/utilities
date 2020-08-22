import type { Ctor } from './utilityTypes';

/**
 * Checks whether or not the value class extends the base class.
 * @param value The constructor to be checked against.
 * @param base The base constructor.
 */
export function classExtends<T extends Ctor>(value: Ctor, base: T): value is T {
	let ctor: Ctor | null = value;
	while (ctor !== null) {
		if (ctor === base) return true;
		ctor = Object.getPrototypeOf(ctor);
	}

	return false;
}
