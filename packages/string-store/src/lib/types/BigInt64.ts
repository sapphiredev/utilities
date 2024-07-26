import type { IType } from './base/IType';

export const BigInt64Type: IType<bigint, 64> = {
	serialize(buffer, value) {
		buffer.writeBigInt64(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readBigInt64(pointer);
	},
	BIT_SIZE: 64
};
