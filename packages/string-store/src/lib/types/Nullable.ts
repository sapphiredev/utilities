import type { IType } from './base/IType';

export function NullableType<ValueType, ValueBitSize extends number | null>(
	type: IType<ValueType, ValueBitSize>
): IType<ValueType | null, null, ValueType | null | undefined> {
	return {
		serialize(buffer, value) {
			if (value === null || value === undefined) {
				buffer.writeBit(0);
			} else {
				buffer.writeBit(1);
				type.serialize(buffer, value);
			}
		},
		deserialize(buffer, pointer) {
			return buffer.readBit(pointer) ? type.deserialize(buffer, pointer) : null;
		},
		BIT_SIZE: null
	};
}
