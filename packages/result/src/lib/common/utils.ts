import type { IValue } from './IValue';

export type Awaitable<T> = PromiseLike<T> | T;

export function isFunction<A extends readonly any[], R>(cb: (...args: A) => R): true;
export function isFunction(input: any): input is (...args: readonly any[]) => any;
export function isFunction(input: any) {
	return typeof input === 'function';
}

export function isPromise<T>(input: PromiseLike<T>): true;
export function isPromise(input: any): input is PromiseLike<any>;
export function isPromise(input: any) {
	return typeof input === 'object' && input && typeof input.then === 'function';
}

function hasMethod<T, K extends PropertyKey>(value: T, name: K): value is T & Record<K, (...args: readonly any[]) => unknown> {
	return name in value && typeof (value as any)[name] === 'function';
}

function callMethodOrReturn<K extends string>(value: unknown, name: K) {
	return typeof value === 'object' && value !== null && hasMethod(value, name) ? value[name]() : value;
}

export function toString<T>(value: T): IValue.ToString<T> {
	switch (typeof value) {
		case 'string':
		case 'number':
		case 'bigint':
		case 'boolean':
		case 'symbol':
		case 'function':
			return value.toString() as IValue.ToString<T>;
		case 'undefined':
			return 'undefined' as IValue.ToString<T>;
		default:
			return String(value) as IValue.ToString<T>;
	}
}

export function valueOf<T>(value: T): IValue.ValueOf<T> {
	return callMethodOrReturn(value, 'valueOf') as IValue.ValueOf<T>;
}

export function toJSON<T>(value: T): IValue.ToJSON<T> {
	return callMethodOrReturn(value, 'toJSON') as IValue.ToJSON<T>;
}

export function toPrimitive<T>(hint: 'number', value: T): IValue.ToNumber<T>;
export function toPrimitive<T>(hint: 'string', value: T): IValue.ToString<T>;
export function toPrimitive<T>(hint: IValue.PrimitiveHint, value: T): IValue.ToPrimitive<T>;
export function toPrimitive<T>(hint: IValue.PrimitiveHint, value: T): IValue.ToPrimitive<T> {
	const result =
		typeof value === 'object' && value !== null && hasMethod(value, Symbol.toPrimitive)
			? value[Symbol.toPrimitive](hint)
			: hint === 'number'
			? Number(value)
			: String(value);

	return result as IValue.ToPrimitive<T>;
}
