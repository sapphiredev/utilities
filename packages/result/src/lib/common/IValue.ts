export interface IValue<T> {
	/**
	 * The `toString()` method returns a string representing the object.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString}
	 */
	toString(): IValue.ToString<T>;

	/**
	 * The `valueOf()` method returns the primitive value of the specified object.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf}
	 */
	valueOf(): IValue.ValueOf<T>;

	/**
	 * Customizes the JSON stringfication behavior.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior}
	 */
	toJSON(): IValue.ToJSON<T>;

	/**
	 * A method that converts an object to a number.
	 * @param hint The preferred type of the result primitive value.
	 */
	[Symbol.toPrimitive](hint: 'number'): IValue.ToNumber<T>;
	/**
	 * A method that converts an object to a string.
	 * @param hint The preferred type of the result primitive value.
	 */
	[Symbol.toPrimitive](hint: 'string'): IValue.ToString<T>;
	/**
	 * A method that converts an object to a primitive.
	 * @param hint The preferred type of the result primitive value.
	 *
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive}
	 */
	[Symbol.toPrimitive](hint: IValue.PrimitiveHint): IValue.ToPrimitive<T>;
}

export namespace IValue {
	export type ToString<T> = T extends string | number | bigint | boolean | null | undefined
		? `${T}`
		: T extends { toString(): infer R }
		? R extends string
			? R
			: string
		: string;

	export type ValueOf<T> = T extends { valueOf(): infer R } ? R : T;
	export type ToJSON<T> = T extends { toJSON(): infer R } ? R : T;

	export type BooleanToNumber<T> = T extends true ? 1 : T extends false ? 0 : 1 | 0;
	export type EnsureNumber<T> = T extends number ? T : number;
	export type ToNumber<T> = T extends number
		? T
		: T extends boolean
		? BooleanToNumber<T>
		: T extends null
		? 0
		: T extends { valueOf(): infer R }
		? EnsureNumber<R>
		: number;

	export type PrimitiveHint = 'number' | 'string' | 'default';
	export type ToPrimitive<T> = ToNumber<T> | ToString<T>;
}
