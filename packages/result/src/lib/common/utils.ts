export type Awaitable<T> = PromiseLike<T> | T;

export function isFunction<A extends readonly any[], R>(cb: (...args: A) => R): cb is (...args: A) => R;
export function isFunction(input: any): input is (...args: readonly any[]) => any;
export function isFunction(input: any) {
	return typeof input === 'function';
}
