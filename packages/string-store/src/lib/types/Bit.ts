import type { IType } from './base/IType';

export const BitType: IType<number, 1> = {
	serialize(buffer, value) {
		buffer.writeBit(value & 0b1);
	},
	deserialize(buffer, pointer) {
		return buffer.readBit(pointer);
	},
	BIT_SIZE: 1
};
