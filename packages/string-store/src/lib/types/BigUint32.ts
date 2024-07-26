import type { IType } from './base/IType';

export const BigUint32Type: IType<bigint, 32> = {
	serialize(buffer, value) {
		buffer.writeBigInt32(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readBigUint32(pointer);
	},
	BIT_SIZE: 32
};
