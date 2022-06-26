export type Awaitable<T> = PromiseLike<T> | T;

export function isFunction<A extends readonly any[], R>(cb: (...args: A) => R): true;
export function isFunction(input: any): input is (...args: readonly any[]) => any;
export function isFunction(input: any) {
	return typeof input === 'function';
}

export function isPromise<T>(input: PromiseLike<T>): true;
export function isPromise(input: any): input is PromiseLike<any>;
export function isPromise(input: any) {
	return typeof input === 'object' && input !== null && typeof input.then === 'function';
}
