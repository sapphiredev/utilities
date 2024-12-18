import type { IType } from './base/IType';

export const SnowflakeType: IType<bigint, 64, bigint | string> = {
	serialize(buffer, value) {
		buffer.writeBigInt64(BigInt(value));
	},
	deserialize(buffer, offset) {
		return buffer.readBigUint64(offset);
	},
	BIT_SIZE: 64
};
