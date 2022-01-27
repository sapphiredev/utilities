/**
 * @license MIT
 * @copyright 2020 1Computer
 *
 * The computation is successful.
 * @typeparam T - Type of results.
 */
export interface Ok<T> {
	/**
	 * If this is an Ok, this is true.
	 */
	readonly success: true;

	/**
	 * The resulting value, which only exists on an Ok.
	 */
	readonly value: T;

	readonly error?: undefined;
}

/**
 * @license MIT
 * @copyright 2020 1Computer
 *
 * The computation failed.
 * @typeparam E - Type of errors.
 */
export interface Err<E> {
	/**
	 * If this an Err, this is false.
	 */
	readonly success: false;

	readonly value?: undefined;

	/**
	 * The resulting error, which only exists on an Err.
	 */
	readonly error: E;
}

/**
 * @license MIT
 * @copyright 2020 1Computer
 *
 * A type that can express the lack of a value.
 * Used in this library for when a generic type could be nullable.
 * @typeparam T - Type of results.
 */
export type Option<T> = Some<T> | None;

/**
 * @license MIT
 * @copyright 2020 1Computer
 *
 * The value exists.
 * @typeparam T - Type of results.
 */
export interface Some<T> {
	/**
	 * If this is a Some, this is true.
	 */
	readonly exists: true;

	/**
	 * The value, which only exists on a Some.
	 */
	readonly value: T;
}

/**
 * @license MIT
 * @copyright 2020 1Computer
 *
 * The value does not exist.
 */
export interface None {
	/**
	 * If this is a None, this is false.
	 */
	readonly exists: false;

	readonly value?: undefined;
}
