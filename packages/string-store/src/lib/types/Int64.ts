import type { IType } from './base/IType';

export const Int64Type: IType<number, 64> = {
	serialize(buffer, value) {
		buffer.writeInt64(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readInt64(pointer);
	},
	BIT_SIZE: 64
};
