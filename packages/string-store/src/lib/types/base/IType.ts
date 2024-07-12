import type { Pointer } from '../../shared/Pointer';
import type { UnalignedUint16Array } from '../../UnalignedUint16Array';

export interface IType<ValueType, BitSize extends number | null> {
	/**
	 * Serialize a value to a buffer.
	 *
	 * @param buffer The buffer to write to
	 * @param value The value to write
	 */
	serialize(buffer: UnalignedUint16Array, value: Readonly<ValueType>): void;

	/**
	 * Deserialize a value from a buffer.
	 *
	 * @param buffer The buffer to read from
	 * @param pointer The pointer indicating the current position in the buffer
	 */
	deserialize(buffer: UnalignedUint16Array, pointer: Pointer): ValueType;

	/**
	 * The size of the value in bits, or `null` if the size is variable.
	 */
	readonly BIT_SIZE: BitSize;
}
