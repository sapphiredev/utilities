import type { IType } from './base/IType';

export const Int32Type: IType<number, 32> = {
	serialize(buffer, value) {
		buffer.writeInt32(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readInt32(pointer);
	},
	BIT_SIZE: 32
};
