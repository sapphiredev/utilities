import type { Ctor } from './types';

/**
 * Verify if the input is a class constructor.
 * @param input The function to verify
 */
export function isClass(input: unknown): input is Ctor {
	return typeof input === 'function' && typeof input.prototype === 'object';
}
