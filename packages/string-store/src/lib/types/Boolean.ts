import type { IType } from './base/IType';

export const BooleanType: IType<boolean, 1> = {
	serialize(buffer, value) {
		buffer.writeBit(Number(value));
	},
	deserialize(buffer, pointer) {
		return buffer.readBit(pointer) === 1;
	},
	BIT_SIZE: 1
};
