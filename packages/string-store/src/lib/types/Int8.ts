import type { IType } from './base/IType';

export const Int8Type: IType<number, 8> = {
	serialize(buffer, value) {
		buffer.writeInt8(value);
	},
	deserialize(buffer, pointer) {
		return buffer.readInt8(pointer);
	},
	BIT_SIZE: 8
};
