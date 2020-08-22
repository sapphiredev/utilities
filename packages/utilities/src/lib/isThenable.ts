import { isFunction } from './isFunction';

export interface Thenable {
	then: (...args: unknown[]) => unknown;
	catch: (...args: unknown[]) => unknown;
}

function hasThen(input: { then?: (...args: unknown[]) => unknown }): boolean {
	return Reflect.has(input, 'then') && isFunction(input.then);
}

function hasCatch(input: { catch?: (...args: unknown[]) => unknown }): boolean {
	return Reflect.has(input, 'catch') && isFunction(input.catch);
}

/**
 * Verify if an object is a promise.
 * @param input The promise to verify
 */
export function isThenable(input: unknown): input is Thenable {
	if (typeof input !== 'object' || input === null) return false;
	return input instanceof Promise || (input !== Promise.prototype && hasThen(input) && hasCatch(input));
}
