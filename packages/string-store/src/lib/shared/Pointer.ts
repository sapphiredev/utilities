import { isValidLength } from './_common';

/**
 * A pointer to a position in a buffer.
 *
 * This is used to keep track of the current position in a buffer while allowing
 * the position to be updated by multiple different functions.
 *
 * @privateRemarks
 *
 * This class draws inspiration from the following constructs:
 * - `int*` in C/C++
 * - `ref int` in C#
 * - `*mut i32` in Rust
 */
export class Pointer {
	#value = 0;

	public get value() {
		return this.#value;
	}

	public add(value: number) {
		const added = this.#value + value;
		if (!isValidLength(added)) {
			throw new RangeError(`The pointer value cannot be an invalid length value`);
		}

		this.#value = added;
		return this;
	}

	public static from(pointer: PointerLike) {
		if (pointer instanceof Pointer) {
			return pointer;
		}

		const instance = new Pointer();
		instance.add(Number(pointer));
		return instance;
	}
}

export type PointerLike = Pointer | { valueOf(): number } | { [Symbol.toPrimitive](hint: 'number'): number };
