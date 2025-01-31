import type { DuplexBuffer } from '../../buffer/DuplexBuffer';
import type { Pointer } from '../../shared/Pointer';

export interface IType<ValueType, BitSize extends number | null, InputValue = ValueType> {
	/**
	 * Serialize a value to a buffer.
	 *
	 * @param buffer The buffer to write to
	 * @param value The value to write
	 */
	serialize(buffer: DuplexBuffer, value: InputValue): void;

	/**
	 * Deserialize a value from a buffer.
	 *
	 * @param buffer The buffer to read from
	 * @param pointer The pointer indicating the current position in the buffer
	 */
	deserialize(buffer: DuplexBuffer, pointer: Pointer): ValueType;

	/**
	 * The size of the value in bits, or `null` if the size is variable.
	 */
	readonly BIT_SIZE: BitSize;
}
