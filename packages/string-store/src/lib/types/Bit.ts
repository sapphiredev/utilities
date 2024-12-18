import type { IType } from './base/IType';

export const BitType: IType<0 | 1, 1, number> = {
	serialize(buffer, value) {
		buffer.writeBit(value & 0b1);
	},
	deserialize(buffer, pointer) {
		return buffer.readBit(pointer);
	},
	BIT_SIZE: 1
};
