import type { IType } from './base/IType';

export const BigUint64Type: IType<bigint, 64> = {
	serialize(buffer, value) {
		buffer.writeBigInt64(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readBigUint64(pointer);
	},
	BIT_SIZE: 64
};
